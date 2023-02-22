import React, { useEffect } from "react";
import LogOutButton from "../../Shared/LogOutButton/LogOutButton";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "../../App.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';


import moment from "moment";
import Form from "../Form";

function UserPage() {
  library.add(fas, far);
  let history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "FETCH_HABITS" });
  }, []);

  const handleClick = (entry_id) => {
    //console.log("you clicked the shape. the entry id is", entry_id);
    //handle update request to mark that entry_id as completed
  };

  const habits = useSelector((store) => store.habitReducer);
  //habits.length !== 0 && console.log("this is habits in overview page", habits);

  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);

//generate current day, month, and year from moment.js
  const today = moment().format('YYYY-MM-DD');
  const thisMonth = moment().format('MM');
  const thisYear = moment().format('YYYY')
  const monthName = moment(thisMonth, 'MM').format('MMMM');
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
    const startDate = moment([thisYear, currentMonthIndex]).clone().startOf("month");
    const endDate = moment([thisYear, currentMonthIndex]).clone().endOf("month");

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
    console.log("this is habits", habits);

    //once we have completed 12 months, append the full calendar to the DOM with icons
    if (monthsCompleted === 1) {
      return (
        <>
          {/* the habit names will be displayed in single column table. Map through the first date to get all habit names for the month  */}
          <table className="individual_tables">
            <tr>
              <td>name</td>
            </tr>
            
            {habits[0]?.map((entry) => {
              
              return (
                <tr>
                  <td onClick={() => history.push(`/edit/${entry.habit_id}`)} key={entry.id}>{entry.habit_name}</td>
                </tr>
              );
            })}
          </table>
          {/* each day of the month will be displayed in its own single column table with the habits below it. */}
          {habits.map((date) => (
            <table className="individual_tables">
              {/* {console.log("this is the date[0].was_completed", date[0].was_completed)} */}
              <tr>
                <td>
                  <div className="table_box">
                    {" "}
                    {moment(date[0].date).format("DD")}
                  </div>
                </td>
              </tr>
              {date.map((habit) => {
                //{console.log("has habit.was_completed", habit.was_completed)}
                //let type = "fa-solid";
                let type;
                habit.was_completed? type = "fa-solid" : type = "fa-regular";
                
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
                return (
                  <tr>
                    <td>
                      <div
                        key={habit.entry_id}
                        className="table_box"
                        onClick={() => handleClick(habit.entry_id)}
                      >
                        <FontAwesomeIcon icon={[type, shape]} className={colorClass} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </table>
          ))}
        </>
      );
    }
  };

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>
      <button onClick={() => {history.push('/form')}}>Add New Habit!</button>
      <LogOutButton className="btn" />

      <div className="listOfHabits">
        <h2>{thisYear}</h2>
        <h3>{monthName}</h3>

        <span>{getDate(monthName, currentMonthIndex)}</span>
      </div>
    </div>
  );
}

export default UserPage;



/* 
if (is_tracked){
  let type;
  is_complete? type = "fa-solid" : "fa-regular";

  let shape;
  switch(shape_id){
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
      shape = "fa-moon";
      break;
    case 8:
      shape = "fa-hand-peace";
      break;
    case 9:
      shape = "fa-gem";
      break;
    case 10:
      shape = "fa-chess-queen";
      break;
    case 11:
      shape = "fa-face-grin-beam";
      break;
  case 12:
      shape = "fa-futbol";
      break;
  case 13:
      shape = "fa-money-bill-1";
      break;
  case 14:
      shape = "fa-lightbulb";
      break;
}
<tr>
  <td>{habit_name}</td>
  {month.monthDates[0].map((day) => (
    <td className="dates">
      <div className="table_box">
        <FontAwesomeIcon icon=`${type} ${shape}` className=`${colorClass}` />
      </div>
    </td>
  ))}
</tr>


}
*/
