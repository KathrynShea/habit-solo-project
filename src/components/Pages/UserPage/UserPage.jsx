import React, { useEffect, useState } from "react";
import LogOutButton from "../../Shared/LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";

function UserPage() {
  useEffect(() => {
    dispatch({ type: "FETCH_HABITS" });
  }, []);

  const habits = useSelector((store) => store.habitReducer);
  habits.length !== 0 &&
    console.log("this is habits in overview page", habits);

  

  //for new habit form

  let dispatch = useDispatch();
  const [newHabitName, setNewHabitName] = useState();
  const [newStartDate, setNewStartDate] = useState();
  const [newEndDate, setNewEndDate] = useState();
  const [newShapeID, setNewShapeID] = useState();
  const [newColorID, setNewColorID] = useState();

  const handleSubmit = () => {
    let newHabitObject = {
      habit_name: newHabitName,
      start_date: newStartDate,
      end_date: newEndDate,
      shape_id: newShapeID,
      color_id: newColorID,
    };

    dispatch({ type: "ADD_HABIT", payload: newHabitObject });
  };

  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);

  let history = useHistory;
  //history.push is not working
  const handleClick = () => {
    history.push("/overview");
  };

  //generate months and year from moment.js
  const months = moment.months();
  const currentMonth = months[1];
  const year = new Date().getFullYear();

  //this is the calendar that will hold all of the months with the name and dates of each
  let calendar = [
    /*{monthName: month, dates:[]}*/
  ];

  //tracks how many months have been added to the calendar year
  let monthsCompleted = 0;

  //function that generates all dates for a given month and then pushes that month info to the calendar array
  const getDate = (monthName, monthIndex) => {
    //object that will hold all the newly generate monthly info
    let monthObject = {
      monthName: monthName,
      monthDates: [],
    };

    //combine the year and month index so we can use moment.js to calculate how many days are in the month
    let yearAndMonth = year.toString() + "-" + (monthIndex + 1);
    let daysInCurrentMonth = moment(yearAndMonth, "YYYY-MM").daysInMonth();

    //calculate first and last date of the month
    const startDate = moment([year, monthIndex]).clone().startOf("month");
    const endDate = moment([year, monthIndex]).clone().endOf("month");

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
    calendar.push(monthObject);

    //increment tracker that we have completed 1 more month
    monthsCompleted++;

    //once we have completed 12 months, append the full calendar to the DOM with icons
    if (monthsCompleted === 1) {
      return (<>
      {habits.map((date) => (
        <table className="individual_tables">
          {console.log("this is the date[0].was_completed", date[0].was_completed)}
          <tr><td><div className="table_box"> {moment(date[0].date).format("DD")}</div></td></tr>
          {date.map((habit) => {
            {console.log("has habit_id", (habit.hasOwnProperty('habit_id')))}
            return <tr><td><div className="table_box">{habit.hasOwnProperty('habit_id')? "X" : "-"}</div></td></tr>
          })}
          
        </table>
      ))}
      </>)
      // return calendar.map((month) => (
      //   <table className="allDates" class="scrolling-wrapper-flexbox">
      //     <tr className="month_name">{month.monthName}</tr>
      //     <tr>
      //       <td className="dates">
      //         <div className="table_box">name</div>
      //       </td>
      //       {month.monthDates[0].map((day) => (
      //         <td className="dates">
      //           <div className="table_box">{day}</div>
      //         </td>
      //       ))}
      //     </tr>
      //     {habits.length !== 0 &&
      //       habits.map((date) => {
      //         return (
      //           <tr>
      //             <td className="dates">
      //               <div className="table_box">{date.habit_name}</div>
      //             </td>
      //             {month.monthDates[0].map((day) => (
      //               <td className="dates">
      //                 <div className="table_box">
      //                   <h2>X</h2>
      //                 </div>
      //               </td>
      //             ))}
      //           </tr>
      //         );
      //       })}
      //   </table>
      // ));
    }
  };

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>
      <button onClick={() => history.push("/overview")}>Click Me!</button>
      <LogOutButton className="btn" />

      <div>
        <h1>List of habits</h1>
        <h1>calendar</h1>
        <h2>{year}</h2>
        {/* {months.map((month, index) => (
        <span>{getDate(month, index)}</span>
      ))} */}
        <span>{getDate(currentMonth, 1)}</span>

        {habits.map((entry) => {
          return (
            <>
              <h4>{entry.habit_name}</h4>
              <h4>{entry.date}</h4>
              <h4>{entry.was_completed}</h4>
              <h4>{entry.color_id}</h4>
              <h4>{entry.shape_id}</h4>
              <h4>{entry.start_date}</h4>
              <h4>{entry.end_date}</h4>
            </>
          );
        })}
        {JSON.stringify(habits)}
      </div>
      <div>
        <h1>New habit form</h1>
        <input
          placeholder="habit name"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <input
          type="date"
          value={newStartDate}
          onChange={(e) => setNewStartDate(e.target.value)}
        />
        <input
          type="date"
          value={newEndDate}
          onChange={(e) => setNewEndDate(e.target.value)}
        />
        <input
          placeholder="library of shapes"
          value={newShapeID}
          onChange={(e) => setNewShapeID(e.target.value)}
        />
        <input
          placeholder="library of colors"
          value={newColorID}
          onChange={(e) => setNewColorID(e.target.value)}
        />
        <button onClick={() => handleSubmit()}>Submit</button>
      </div>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;

/*
[{"entry_id":56,
"habit_id":38,
"user_id":3,
"date":"2023-02-20T06:00:00.000Z",
"was_completed":false,
"habit_name":"walky",
-- "color_id":2,
--"shape_id":2,
"start_date":"2023-02-22T06:00:00.000Z",
"end_date":"2023-02-25T06:00:00.000Z",
--"is_tracked":true,
--"is_completed":false},
 */

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

let colorClass;
switch(color_id){
  case 'one':
    colorClass = "one";
    break;
  case 'two':
    colorClass = "two";
    break;
  case 'three':
    colorClass = "three";
    break;
  case 'four':
    colorClass = "four";
    break;
  case 'five':
    colorClass = "five";
    break;
  case 'six':
    colorClass = "six";
    break;
  case 'seven':
    colorClass = "seven";
    break;
  default:
    colorClass = "regular";
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
