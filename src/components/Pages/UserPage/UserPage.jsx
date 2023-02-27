import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function UserPage() {
  //allows us to use the imported fontawesome icons
  library.add(fas, far);

  //allows us to use history to push to new pages
  let history = useHistory();

  //allows us to dispatch actions to saga
  const dispatch = useDispatch();

  //pulls in all habit information from redux
  const habits = useSelector((store) => store.habitReducer);
  //console.log("this is habits", habits);
  
  const habitBasics = useSelector((store) => store.habitBasicsReducer);
  //only need to show habits that are being tracked
  const habitBasicsTracked = habitBasics.filter(
    (habit) => habit.is_tracked === true
  );

  //create local state to manage what month of habits the user is viewing
  const [monthView, setMonthView] = useState(moment().format("MM"));
  
let monthObject = {
  monthName: monthView,
  monthDates: []
}
  //generate current day, month, and year from moment.js
  const thisMonth = moment(monthView).format("MM");
  const currentMonthIndex = moment(thisMonth, "MM").month();
  const monthName = moment(thisMonth, "MM").format("MMMM");
  // console.log("this is monthView", monthView);
  // console.log("this is monthObject", monthObject);
  // console.log("this is currentMonthIndex", currentMonthIndex);
  // console.log("this is monthName", monthName);
  const thisYear = moment().format("YYYY");
  const currentYearAndMonth = moment(`${thisYear}-${monthView}`).format(
    "YYYY-MM"
  );
  //console.log("currentYearAndMonth", currentYearAndMonth);
  
  const allMonths = moment.months();
  // console.log("allMonths", allMonths);

  let daysInCurrentMonth = moment(currentYearAndMonth, "YYYY-MM").daysInMonth();
  //console.log("daysInCurrentMonth", daysInCurrentMonth);

  //calculate first and last date of the month
  const startDate = moment([thisYear, currentMonthIndex])
    .clone()
    .startOf("month");
  const endDate = moment([thisYear, currentMonthIndex]).clone().endOf("month");
  // console.log(
  //   "start and end date",
  //   moment(startDate).format("YYYY-MM-DD"),
  //   moment(endDate).format("YYYY-MM-DD")
  // );

  const day = startDate.clone().subtract(1, "day");
  //console.log("day", moment(day).format('YYYY-MM-DD'));


      //keeps adding a day to the monthDates array to match the number of days in current month, then maps over
    //all of the days and updates to the numbers match what the number of the date should be
    while (day.isBefore(endDate, "day")) {
      monthObject.monthDates.push(
        Array(daysInCurrentMonth)
          .fill(0)
          .map(() => day.add(1, "day").clone().format("DD"))
      );
    }
     //console.log("monthObject", monthObject);

  const handleClick = (entry_id, was_completed) => {
    const newObject = {
      entry_id: entry_id,
      was_completed: !was_completed,
      startDate: moment(startDate).format("YYYY-MM-DD")
    };
    //sends to saga to ask to update the completed status for this specific day
    dispatch({ type: "CHANGE_COMPLETE", payload: newObject });
  };

  useEffect(() => {
    //on inital load of page, this will populate all habits into the habit reducer
    //dispatch({ type: "FETCH_HABITS", payload: moment(startDate).format("YYYY-MM-DD") });
    dispatch({ type: "FETCH_HABIT_BASICS" });
  }, []);

  useEffect(() => {
    //on inital load of page, this will populate all habits into the habit reducer
    dispatch({ type: "FETCH_HABITS", payload: moment(startDate).format("YYYY-MM-DD") });
  
  }, [monthView]);
//console.log("this is monthView", monthView);
  return (
    <Container>
    <div className="listOfHabits">
      
      <h3>Habits for</h3>
      {/* {console.log("this is is monthView", moment(`${monthView}`).add(1, 'months').format('MM'))}  */}
    
      <span><Button onClick={() => setMonthView(moment(`${monthView}`).subtract(1, 'months').format('MM'))} className="overview-month-option" variant="light"><FontAwesomeIcon icon="fa-solid fa-angle-left" /></Button><h3 className="overview-month-option">{monthName}</h3><Button onClick={() => setMonthView(moment(`${monthView}`).add(1, 'months').format('MM'))} className="overview-month-option" variant="light"><FontAwesomeIcon icon="fa-solid fa-angle-right" /></Button></span>

      <h5>{thisYear}</h5>

      <div className="all_habit_dates">{
        <table className="individual_tables">
          <tbody>
            <tr className="habit_rows names">
              <td className="habit_data">habit name</td>
              
              {habitBasicsTracked.map((habit) => {
                return (
                  <td
                    onClick={() => history.push(`/edit/${habit.id}`)}
                    key={habit.habit_name}
                    className="habit_data text_clickable"
                  >
                    {habit.habit_name}
                  </td>
                );
              })}
            </tr>
              {/* {console.log("monthObject.monthDates[0]", monthObject.monthDates[0])} */}
              {monthObject.monthDates[0].map((date, i) => {
                return(
                  <tr className="habit_rows" key={i}>
                    <td className="habit_data">{date}</td>
                    {habitBasicsTracked.map((habit, j) => {
                      let index = habits[i]?.findIndex(p => {return p.habit_id === habit.id})
                      //  console.log("this is index", index); 
                       if (index < 0 || index === undefined) {
                        //console.log("{habit.id + i", habit.id + i)
                        return (
                          
                            <td className="habit_data">
                              <div key={j} className="table_box"></div>
                            </td>
                          
                        );  
                      } else if (index >= 0 && moment(habits[i][index].date).format('YYYY-MM') === moment(currentYearAndMonth).format('YYYY-MM')){
                        // console.log("i", i)
                        let currentObject = habits[i][index];
                        // console.log("we have a match!");
  
                        let type;
                        currentObject.was_completed
                          ? (type = "fa-solid")
                          : (type = "fa-regular");
  
                        let shape;
                        switch (currentObject.shape_id) {
                          case 1:
                            shape = "fa-square";
                            break;
                          case 2:
                            shape = "fa-circle";
                            break;
                          case 3:
                            shape = "fa-heart";
                            break;
                          case 4:
                            shape = "fa-star";
                            break;
                          case 5:
                            shape = "fa-lemon";
                            break;
                          case 6:
                            shape = "fa-sun";
                            break;
                          case 7:
                            shape = "fa-lightbulb";
                            break;
                          case 8:
                            shape = "fa-moon";
                            break;
                          case 9:
                            shape = "fa-hand-peace";
                            break;
                          case 10:
                            shape = "fa-gem";
                            break;
                          case 11:
                            shape = "fa-chess-queen";
                            break;
                          case 12:
                            shape = "fa-face-grin-beam";
                            break;
                          case 13:
                            shape = "fa-futbol";
                            break;
                          case 14:
                            shape = "fa-money-bill-1";
                            break;
                        }
  
                        let colorClass;
                        //console.log("this is the currentObject", currentObject);
                        if (!currentObject.was_completed) {
                          colorClass = "regular";
                        } else {
                          switch (currentObject.color_id) {
                            case 1:
                              colorClass = "one";
                              break;
                            case 2:
                              colorClass = "two";
                              break;
                            case 3:
                              colorClass = "three";
                              break;
                            case 4:
                              colorClass = "four";
                              break;
                            case 5:
                              colorClass = "five";
                              break;
                            case 6:
                              colorClass = "six";
                              break;
                            case 7:
                              colorClass = "seven";
                              break;
                            default:
                              colorClass = "regular";
                          }
                        }
                        //console.log("this is habit", habit);
                        return (
                          <td className="habit_data" >
                            <div  className="table_box">
                              <FontAwesomeIcon
                              key={currentObject.entry_id + 1}
                                icon={[type, shape]}
                                className={`${colorClass} clickable`}
                                onClick={() =>
                                  handleClick(currentObject.entry_id, currentObject.was_completed)
                                }
                              />
                            </div>
                          </td>
                        );
                      }else if(index >= 0 && moment(habits[i][index].date).format('YYYY-MM') != moment(currentYearAndMonth).format('YYYY-MM')){
                        //console.log("this is habit", habit);
                        return (
                          <td className="habit_data" key={j}>
                              <div key={j} className="table_box"></div>
                            </td>
                        )
                      }
                      

                    })}
                  </tr>
                )
              })}


            </tbody>
        </table>

      }</div>
      <Button
        onClick={() => {
          history.push("/form");
        }}
        variant="light"
      >
        <FontAwesomeIcon icon="fa-solid fa-plus" />
      </Button>
    </div>
    </Container>
  );
}

export default UserPage;
