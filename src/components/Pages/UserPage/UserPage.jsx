// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
// import "../../App.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fas } from "@fortawesome/free-solid-svg-icons";
// import { far } from "@fortawesome/free-regular-svg-icons";
// import moment from "moment";

// function UserPage() {
//   //allows us to use the imported fontawesome icons
//   library.add(fas, far);

//   //allows us to use history to push to new pages
//   let history = useHistory();

//   //allows us to dispatch actions to saga
//   const dispatch = useDispatch();

//   useEffect(() => {
//     //on inital load of page, this will populate all habits into the habit reducer
//     dispatch({ type: "FETCH_HABITS" });
//     dispatch({ type: "FETCH_HABIT_BASICS" });
//   }, []);

  const handleClick = (entry_id, was_completed) => {
    //console.log("you clicked the shape. the entry id is", entry_id);
    const newObject = {
      entry_id: entry_id,
      was_completed: !was_completed,
    };
    dispatch({ type: "CHANGE_COMPLETE", payload: newObject });
    //handle update request to mark that entry_id as completed
  };

  // const habits = useSelector((store) => store.habitReducer);
  // const habitBasics = useSelector((store) => store.habitBasicsReducer);
  // const habitBasicsTracked = habitBasics.filter(
  //   (habit) => habit.is_tracked === true
  // );
  
  // // this component doesn't do much to start, just renders some user reducer info to the DOM
  // const user = useSelector((store) => store.user);

  // //generate current day, month, and year from moment.js
  // const thisMonth = moment().format("MM");
  // const thisYear = moment().format("YYYY");
  // const monthName = moment(thisMonth, "MM").format("MMMM");
  // const currentMonthIndex = moment().month();

  // //tracks how many months have been added to the calendar year
  // let monthsCompleted = 0;

  const getHabits = (i) => {
    {habitBasicsTracked.map((habit) => {
      habits.length != 0 && console.log("habits[i]", habits[i]);
      let index = habits[i].findIndex((p) => p.habit_id === habit.id);
      //console.log("index", index);
     // console.log("habits[i][index]", habits[i][index])

      if (index < 0) {
        //append empty <tr><td><div></div></td></tr>
        return (
          <tr>
            <td>
              <div className="table_box"></div>
            </td>
          </tr>
        )
        
      }else{
        //append tr><td><div> with the info at that index</div></td></tr>
        //console.log("habits[i][index]", habits[i][index])
        let focus = habits[i][index];
        //console.log("this is the focus object", focus);
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
        return(
          <tr>
            <td>
              <div key={focus.entry_id} className="table_box">
                <FontAwesomeIcon
                  icon={[type, shape]}
                  className={colorClass}
                  onClick={() =>
                    handleClick(focus.entry_id, focus.is_completed)
                  }
                />
              </div>
            </td>
          </tr>
        )
      }
    })}
  }

  const loopOverHabits = (monthObject) =>{
    //console.log("monthObject.monthDates.length", monthObject.monthDates[0].length)
    for(let i = 0; i < (monthObject.monthDates[0].length); i++){
      return(
      <table className="individual_tables">
        <tbody>
        <tr>
          <td>
            <div className="table_box">
              {" "}
              {/* {console.log("this is monthObject.monthDates[0][i] ",monthObject.monthDates[0][i])} */}
              {moment(monthObject.monthDates[0][i]).format("DD")}
            </div>
          </td>
        </tr>
        {getHabits(i)}
        </tbody>
        </table>)
      }
  }

  //function that generates all dates for a given month and then pushes that month info to the calendar array
  const getDate = (monthName, currentMonthIndex) => {
    //object that will hold all the newly generate monthly info
  //   let monthObject = {
  //     monthName: monthName,
  //     monthDates: [],
  //   };

  //   //combine the year and month index so we can use moment.js to calculate how many days are in the month
  //   let yearAndMonth = thisYear.toString() + "-" + (currentMonthIndex + 1);
  //  // console.log("yearAndMonth", yearAndMonth);
  //   let daysInCurrentMonth = moment(yearAndMonth, "YYYY-MM").daysInMonth();
  //   //console.log("daysInCurrentMonth", daysInCurrentMonth);

  //   //calculate first and last date of the month
  //   const startDate = moment([thisYear, currentMonthIndex])
  //     .clone()
  //     .startOf("month");
  //   const endDate = moment([thisYear, currentMonthIndex])
  //     .clone()
  //     .endOf("month");

  //     //console.log("startDate endDate", moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'));

  //   //find day
  //   const day = startDate.clone().subtract(1, "day");
  //   //console.log("day", moment(day).format('YYYY-MM-DD'));

  //   //keeps adding a day to the monthDates array to match the number of days in current month, then maps over
  //   //all of the days and updates to the numbers match what the number of the date should be
  //   while (day.isBefore(endDate, "day")) {
  //     monthObject.monthDates.push(
  //       Array(daysInCurrentMonth)
  //         .fill(0)
  //         .map(() => day.add(1, "day").clone().format("DD"))
  //     );
  //   }
    //add fully populated month object to the calendar
    //calendar.push(monthObject);

    //increment tracker that we have completed 1 more month
    monthsCompleted++;
  
    //once we have completed 12 months, append the full calendar to the DOM with icons
    if (monthsCompleted === 1) {
      // return (
      //   <div>
      //     {/* the habit names will be displayed in single column table. Map through the first date to get all habit names for the month  */}
      //     <table className="individual_tables">
      //       <tbody>
      //       <tr>
      //         <td>name</td>
      //       </tr>

      //       {habitBasicsTracked.map((habit) => {
      //         return(
      //           <tr>
      //             <td
      //               onClick={() => history.push(`/edit/${habit.id}`)}
      //               key={habit.id}
      //             >
      //               {habit.habit_name}
      //             </td>
      //           </tr>
      //         )
            
      //       })}
      //       </tbody>  
      //     </table>
          {/* this maps over every single day of the month */}
          {loopOverHabits(monthObject)}

         // </div>);
    //}
          
        
          {/* {habits.length != 0 && habits.map((date) => (
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
              {/* {habitBasicsTracked.map((habit) => {
                //console.log("current habit id", habit.id)

                //console.log(date);
                let index = date.findIndex((p) => p.habit_id === habit.id);
                //console.log("this is index", index);

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
                  //console.log("this is the focus object", focus);
                  let type;
                  focus.was_completed
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
                  if (!focus.was_completed) {
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
                  return (
                    <tr>
                      <td>
                        <div key={focus.entry_id} className="table_box">
                          <FontAwesomeIcon
                            icon={[type, shape]}
                            className={colorClass}
                            onClick={() =>
                              handleClick(focus.entry_id, focus.was_completed)
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                }
              })}
            </table>
          ))} 
        </div>
      );
    }
  */}

}; 

  // return (
  //   <div className="container">
  //     <h2>Welcome, {user.username}!</h2>

  //     <div className="list_of_habits">
  //       <h3>Habits for {monthName}</h3>
  //       <h5>{thisYear}</h5>

  //       <div className="all_habit_dates">
  //         {getDate(monthName, currentMonthIndex)}
  //       </div>
  //       <button
  //         onClick={() => {
  //           history.push("/form");
  //         }}
  //       >
  //         <FontAwesomeIcon icon="fa-solid fa-plus" />
  //       </button>
  //     </div>
  //   </div>
  // );
}

export default UserPage;
