import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";

function UserPage() {
  //allows us to use the imported fontawesome icons
  library.add(fas, far);

  //allows use to use history to push to new pages
  let history = useHistory();

  //allows us to dispatch actions to saga
  const dispatch = useDispatch();

  useEffect(() => {
    //on inital load of page, this will populate all habits into the habit reducer
    dispatch({ type: "FETCH_HABITS" });
    dispatch({ type: "FETCH_HABIT_BASICS" });
  }, []);

  const handleClick = (entry_id, was_completed) => {
    console.log("you clicked the shape. the entry id is", entry_id);
    const newObject = {
      entry_id: entry_id,
      was_completed: !was_completed,
    };
    dispatch({ type: "CHANGE_COMPLETE", payload: newObject });
    //handle update request to mark that entry_id as completed
  };

  const habits = useSelector((store) => store.habitReducer);
  habits.length !== 0 && console.log("this is habits in overview page", habits);

  const habitBasics = useSelector((store) => store.habitBasicsReducer);
  //console.log("this is habitBasics", habitBasics);
  const habitBasicsTracked = habitBasics.filter(
    (habit) => habit.is_tracked === true
  );
  console.log("this is habitBasicsTracked", habitBasicsTracked);

  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);

  //generate current day, month, and year from moment.js
  const today = moment().format("YYYY-MM-DD");
  const thisMonth = moment().format("MM");
  const thisYear = moment().format("YYYY");
  const monthName = moment(thisMonth, "MM").format("MMMM");
  const currentMonthIndex = moment().month();

  // console.log("this is monthName", monthName);
  // console.log("this is thisYear", thisYear);
  // console.log("this is thisMonth", thisMonth);
  // console.log("this is currentMonthIndex", currentMonthIndex);
  // console.log("this is today", today);

  //this is the calendar that will hold all of the months with the name and dates of each
  //let calendar = [
  /*{monthName: month, dates:[]}*/
  // ];

  //tracks how many months have been added to the calendar year
  let monthsCompleted = 0;

  //function that generates all dates for a given month and then pushes that month info to the calendar array
  const getDate = (monthName, currentMonthIndex) => {
    //object that will hold all the newly generate monthly info
    let monthObject = {
      monthName: monthName,
      monthDates: [],
    };

    //combine the year and month index so we can use moment.js to calculate how many days are in the month
    let yearAndMonth = thisYear.toString() + "-" + (currentMonthIndex + 1);
    let daysInCurrentMonth = moment(yearAndMonth, "YYYY-MM").daysInMonth();

    //calculate first and last date of the month
    const startDate = moment([thisYear, currentMonthIndex])
      .clone()
      .startOf("month");
    const endDate = moment([thisYear, currentMonthIndex])
      .clone()
      .endOf("month");

    //find current day
    const day = startDate.clone().subtract(1, "day");

    //keeps adding a day to the monthDates array to match the number of days in current month, then maps over
    //all of the days and updates to the numbers match what the number of the date should be
    while (day.isBefore(endDate, "day")) {
      monthObject.monthDates.push(
        Array(daysInCurrentMonth)
          .fill(0)
          .map(() => day.add(1, "day").clone().format("DD"))
      );
    }

    //add fully populated month object to the calendar
    //calendar.push(monthObject);

    //increment tracker that we have completed 1 more month
    monthsCompleted++;
    //console.log("this is habits", habits);

    //once we have completed 12 months, append the full calendar to the DOM with icons
    if (monthsCompleted === 1) {
      return (
        <div>
          {/* the habit names will be displayed in single column table. Map through the first date to get all habit names for the month  */}
          <table className="individual_tables">
            <tr>
              <td>name</td>
            </tr>

            {habitBasicsTracked.map((habit) => {
              return (
                <tr>
                  <td
                    onClick={() => history.push(`/edit/${habit.id}`)}
                    key={habit.id}
                  >
                    {habit.habit_name}
                  </td>
                </tr>
              );
            })}

            {/* old code */}
            {/* {habits[0]?.map((entry) => {
              
              return (
                <tr>
                  <td onClick={() => history.push(`/edit/${entry.habit_id}`)} key={entry.id}>{entry.habit_name}</td>
                </tr>
              );
            })} */}
          </table>
          {/* this maps over every single day of the month */}
          {habits.map((date) => (
            <table className="individual_tables">
              <tr>
                <td>
                  <div className="table_box">
                    {" "}
                    {moment(date[0].date).format("DD")}
                  </div>
                </td>
              </tr>
              {/* this maps over array that confirms our habit order */}
              {habitBasicsTracked.map((habit) => {
                //console.log("current habit id", habit.id)
                
                  //console.log(date);
                  let index = date.findIndex((p) => p.habit_id === habit.id);
                  console.log("this is index", index);

                  if (index < 0) {
                    //append empty <tr><td><div></div></td></tr>
                    return (
                      <tr>
                        <td>
                          <div className="table_box"></div>
                        </td>
                      </tr>
                    );
                  } else {
                    //append tr><td><div> with the info at that index</div></td></tr>
                    let focus = date[index];
                    console.log("this is the focus object", focus);
                    let type;
                    focus.is_completed
                      ? (type = "fa-solid")
                      : (type = "fa-regular");

                    let shape;
                    switch (focus.shape_id) {
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
                    if (!focus.is_completed) {
                      colorClass = "regular";
                    } else {
                      switch (focus.color_id) {
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
                    return(<tr><td><div key={focus.entry_id} className="table_box"><FontAwesomeIcon icon={[type, shape]} className={colorClass} onClick={() =>handleClick(focus.entry_id, focus.is_completed)
                    }
                  /></div></td></tr>);
                  }
                
              })}
            </table>
          ))}

          {/* old code start */}
          {/* each day of the month will be displayed in its own single column table with the habits below it. */}
          {habits.map((date) => (
            <table className="individual_tables">
              {/* {console.log("this is the date[0].was_completed", date[0].was_completed)} */}
              {/* <tr>
                <td>
                  <div className="table_box">
                    {" "}
                    {moment(date[0].date).format("DD")}
                  </div>
                </td>
              </tr> */}
              {date.map((habit) => {
                //{console.log("has habit.was_completed", habit.was_completed)}
                //let type = "fa-solid";
                let type;
                habit.was_completed
                  ? (type = "fa-solid")
                  : (type = "fa-regular");

                let shape;
                switch (habit.shape_id) {
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
                if (!habit.was_completed) {
                  colorClass = "regular";
                } else {
                  switch (habit.color_id) {
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

                // return (
                //   <tr>
                //     <td>
                //       <div key={habit.entry_id} className="table_box">
                //         <FontAwesomeIcon
                //           icon={[type, shape]}
                //           className={colorClass}
                //           onClick={() =>
                //             handleClick(habit.entry_id, habit.was_completed)
                //           }
                //         />
                //       </div>
                //     </td>
                //   </tr>
                // );
              })}
            </table>
          ))} 
        </div>
      ); 
    } 
  };

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>

      <div className="list_of_habits">
        <h3>Habits for {monthName}</h3>
        <h5>{thisYear}</h5>

        <div className="all_habit_dates">
          {getDate(monthName, currentMonthIndex)}
        </div>
        <button
          onClick={() => {
            history.push("/form");
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" />
        </button>
      </div>
    </div>
  );
}

export default UserPage;
