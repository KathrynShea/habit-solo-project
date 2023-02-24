import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";

function UserPagenew() {
  //allows us to use the imported fontawesome icons
  library.add(fas, far);

  //allows us to use history to push to new pages
  let history = useHistory();

  //allows us to dispatch actions to saga
  const dispatch = useDispatch();

  const habits = useSelector((store) => store.habitReducer);
  const habitBasics = useSelector((store) => store.habitBasicsReducer);
  const habitBasicsTracked = habitBasics.filter(
    (habit) => habit.is_tracked === true
  );

  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);

  //generate current day, month, and year from moment.js
  const thisMonth = moment().format("MM");
  const thisYear = moment().format("YYYY");
  const monthName = moment(thisMonth, "MM").format("MMMM");
  const currentMonthIndex = moment().month();

  //tracks how many months have been added to the calendar year
  let monthsCompleted = 0;

  useEffect(() => {
    //on inital load of page, this will populate all habits into the habit reducer
    dispatch({ type: "FETCH_HABITS" });
    dispatch({ type: "FETCH_HABIT_BASICS" });
  }, []);

  const handleClick = (entry_id, was_completed) => {
    //console.log("you clicked the shape. the entry id is", entry_id);
    const newObject = {
      entry_id: entry_id,
      was_completed: !was_completed,
    };
    dispatch({ type: "CHANGE_COMPLETE", payload: newObject });
    //handle update request to mark that entry_id as completed
  };

  const getDate = (monthName, currentMonthIndex) => {
    let monthObject = {
      monthName: monthName,
      monthDates: [],
    };

    //combine the year and month index so we can use moment.js to calculate how many days are in the month
    let yearAndMonth = thisYear.toString() + "-" + (currentMonthIndex + 1);
    // console.log("yearAndMonth", yearAndMonth);
    let daysInCurrentMonth = moment(yearAndMonth, "YYYY-MM").daysInMonth();
    //console.log("daysInCurrentMonth", daysInCurrentMonth);

    //calculate first and last date of the month
    const startDate = moment([thisYear, currentMonthIndex])
      .clone()
      .startOf("month");
    const endDate = moment([thisYear, currentMonthIndex])
      .clone()
      .endOf("month");

    //console.log("startDate endDate", moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'));

    //find day
    const day = startDate.clone().subtract(1, "day");
    console.log("day", moment(day).format('YYYY-MM-DD'));

    //keeps adding a day to the monthDates array to match the number of days in current month, then maps over
    //all of the days and updates to the numbers match what the number of the date should be
    while (day.isBefore(endDate, "day")) {
      monthObject.monthDates.push(
        Array(daysInCurrentMonth)
          .fill(0)
          .map(() => day.add(1, "day").clone().format("DD"))
      );
    }

    monthsCompleted++;

    if (monthsCompleted > 0) {
      return (
        <table className="individual_tables">
          <tbody>
            <tr>
              <td>name</td>
              {habitBasicsTracked.map((habit) => {
                return (
                  <td
                    onClick={() => history.push(`/edit/${habit.id}`)}
                    key={habit.id}
                  >
                    {habit.habit_name}
                  </td>
                );
              })}
            </tr>
            {console.log(
              "this is the monthObject.monthDates[0]",
              monthObject.monthDates[0]
            )}
            {monthObject.monthDates[0].map((date, i) => {
              return (
                <tr>
                  <td>{date}</td>
                  {habitBasicsTracked.map((habit) => {
                    
                    let index = habits[i].findIndex(
                      (p) => p.habit_id === habit.id
                    );
                    

                    if (index < 0) {
                      return (
                        
                          <td>
                            <div className="table_box"></div>
                          </td>
                        
                      );
                    } else {
                      let currentObject = habits[i][index];

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
                      console.log("this is the currentObject", currentObject);
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
                      return (
                        <td>
                          <div key={currentObject.entry_id} className="table_box">
                            <FontAwesomeIcon
                              icon={[type, shape]}
                              className={colorClass}
                              onClick={() =>
                                handleClick(currentObject.entry_id, currentObject.was_completed)
                              }
                            />
                          </div>
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
  };
  return (
    <div className="container">
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

export default UserPagenew;
