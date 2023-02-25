import React, { useEffect, useState } from "react";
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

  //allows us to use history to push to new pages
  let history = useHistory();

  //allows us to dispatch actions to saga
  const dispatch = useDispatch();

  //pulls in all habit information from redux
  const habits = useSelector((store) => store.habitReducer);
  console.log("this is habits", habits);
  
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


  //let habitsForCurrentMonth = habits.filter(dates =>  dates.filter(date => moment(`${date.date}`).isBefore(`${endDate}`, 'day') && moment(`${date.date}`).isAfter(`${startDate}`, 'day')));
  let habitsForCurrentMonth = [];
  habits.map((dates) => {
      dates.map((date) => {
        if (moment(date.date).isBefore(endDate) && moment(date.date).isAfter(startDate)){
          habitsForCurrentMonth.push(date);
        }
      })})
  console.log("habitsForCurrentMonths", habitsForCurrentMonth);


      //keeps adding a day to the monthDates array to match the number of days in current month, then maps over
    //all of the days and updates to the numbers match what the number of the date should be
    while (day.isBefore(endDate, "day")) {
      monthObject.monthDates.push(
        Array(daysInCurrentMonth)
          .fill(0)
          .map(() => day.add(1, "day").clone().format("DD"))
      );
    }
     console.log("monthObject", monthObject);

  const handleClick = (entry_id, was_completed) => {
    const newObject = {
      entry_id: entry_id,
      was_completed: !was_completed,
    };
    //sends to saga to ask to update the completed status for this specific day
    dispatch({ type: "CHANGE_COMPLETE", payload: newObject });
  };

  useEffect(() => {
    //on inital load of page, this will populate all habits into the habit reducer
    dispatch({ type: "FETCH_HABITS" });
    dispatch({ type: "FETCH_HABIT_BASICS" });
  }, []);

  return (
    <div className="listOfHabits">
      {allMonths.length != 0 &&
        allMonths.map((month) => {
          return (
            <button
              onClick={() => {
                setMonthView(moment().month(`${month}`).format("MM"));
                
              }}
              key={month}
            >
              {month} {thisYear}
            </button>
          );
        })}
      <h3>Habits for {monthName}</h3>
      <h5>{thisYear}</h5>

      <div className="all_habit_dates">{
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
              {console.log("monthObject.monthDates[0]", monthObject.monthDates[0])}
              {monthObject.monthDates[0].map((date, i) => {
                return(
                  <tr key={date}>
                    <td>{date}</td>
                    {console.log("habitBasicsTracked", habitBasicsTracked)}
                    {habitBasicsTracked.map((habit) => {
                      {console.log("habitsForCurrentMonth", habitsForCurrentMonth)}
                      // {habitsForCurrentMonth.map(entry => {
                        // if(entry.habit_id === habit.id){
                            

                        //}}
                      
                      //}
                      
                      // console.log("habitsForCurrentMonth", habitsForCurrentMonth)
                      // console.log("habitsForCurrentMonth[i]",moment(habitsForCurrentMonth[i].date).format('YYYY-MM-DD'));
                    })}
                  </tr>
                )
              })}


            </tbody>
        </table>



      }</div>
      <button
        onClick={() => {
          history.push("/form");
        }}
      >
        <FontAwesomeIcon icon="fa-solid fa-plus" />
      </button>
    </div>
  );
}

export default UserPage;
