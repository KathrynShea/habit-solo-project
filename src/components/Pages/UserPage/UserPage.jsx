import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

function UserPage() {
  //allows us to use the imported fontawesome icons
  library.add(fas, far);

  //allows us to use history to push to new pages
  let history = useHistory();

  //allows us to dispatch actions to saga
  const dispatch = useDispatch();

  //pulls in monthly habit entry information from redux(each days entry and whether it was completed)
  const habits = useSelector((store) => store.habitReducer);

  //pull in monthly habit basic info(name, is mastered, is tracked, etc)
  const habitBasics = useSelector((store) => store.habitBasicsReducer);
  //only need to show habits that are currently being tracked
  const habitBasicsTracked = habitBasics.filter(
    (habit) => habit.is_tracked === true
  );
  console.log("habits", habits);

  //create local state to manage what month of habits the user is viewing
  const [monthView, setMonthView] = useState(moment().format("MM"));

  // this is the tracks the current month and entries in it
  // let monthObject = {
  //   monthName: monthView,
  //   monthDates: [],
  // };
  //generate current day, month, and year from moment.js
  const thisMonth = moment(monthView).format("MM");
  const currentMonthIndex = moment(thisMonth, "MM").month();
  const monthName = moment(thisMonth, "MM").format("MMMM");
  const thisYear = moment().format("YYYY");
  const currentYearAndMonth = moment(`${thisYear}-${monthView}`).format(
    "YYYY-MM"
  );
  // let daysInCurrentMonth = moment(currentYearAndMonth, "YYYY-MM").daysInMonth();
  //calculate first and last date of the month
  const startDate = moment([thisYear, currentMonthIndex]);
  // .clone()
  // .startOf("month");
  // const endDate = moment([thisYear, currentMonthIndex]).clone().endOf("month");

  const handleClick = (entry_id, was_completed) => {
    const newObject = {
      entry_id: entry_id,
      was_completed: !was_completed,
      startDate: moment(startDate).format("YYYY-MM-DD"),
    };
    //sends to saga to ask to update the completed status for this specific day
    dispatch({ type: "CHANGE_COMPLETE", payload: newObject });
  };

  const handleMastered = (id, is_completed) => {
    console.log("in handle mastered");
    console.log("id and is completed", id, is_completed)

    let newObject = {
      id: id,
      is_completed: is_completed,
    };
    console.log("this is the newobject", newObject);
    dispatch({ type: "CHANGE_FINISHED", payload: newObject });

    history.push("/user");
  };

  const tooltip_mastered = (
    <Tooltip id="tooltip">
      <strong>Mark habit as completed</strong>Habit will be moved to awards page
    </Tooltip>
  );

  useEffect(() => {
    //on inital load of page, this will populate all habits into the habit reducer
    //dispatch({ type: "FETCH_HABITS", payload: moment(startDate).format("YYYY-MM-DD") });
    dispatch({ type: "FETCH_HABIT_BASICS" });
  }, []);

  useEffect(() => {
    //on inital load of page, this will populate all habits into the habit reducer
    dispatch({
      type: "FETCH_HABITS",
      payload: moment(startDate).format("YYYY-MM-DD"),
    });
  }, [monthView]);

  return (
    <Container>
      <div className="listOfHabits">
        <h3>Habits for</h3>
        {/* used to set month view */}
        <span>
          <Button
            onClick={() =>
              setMonthView(
                moment(`${monthView}`).subtract(1, "months").format("MM")
              )
            }
            className="overview-month-option"
            variant="light"
          >
            <FontAwesomeIcon icon="fa-solid fa-angle-left" />
          </Button>
          <h3 className="overview-month-option">{monthName}</h3>
          <Button
            onClick={() =>
              setMonthView(moment(`${monthView}`).add(1, "months").format("MM"))
            }
            className="overview-month-option"
            variant="light"
          >
            <FontAwesomeIcon icon="fa-solid fa-angle-right" />
          </Button>
        </span>

        <h5>{thisYear}</h5>

        <div className="all_habit_dates">
          {
            <table className="individual_tables">
              <tbody>
                <tr className="habit_rows">
                  <td className="habit_data">m</td>
                  {habitBasicsTracked.map((habit, index) => {
                    return (
                      <td key={index} className="habit_data">
                        
                        {/* <OverlayTrigger
                          placement="left"
                          overlay={tooltip_mastered}
                        > */}
                        <div className="table_box" onClick={() => handleMastered(habit.id, habit.is_completed)}> 
                            <FontAwesomeIcon icon="fa-solid fa-face-laugh-beam" className="clickable one" />
                        </div>
                        {/* </OverlayTrigger> */}
                      </td>
                    );
                  })}
                </tr>

                <tr className="habit_rows names">
                  <td className="habit_data">habit name</td>

                  {/* loop through the basic habit info for all the habits to generate a list of habits for the month */}
                  {habitBasicsTracked.map((habit, index) => {
                    return (
                      <td
                        onClick={() => history.push(`/edit/${habit.id}`)}
                        key={index}
                        className="habit_data text_clickable"
                      >
                        {habit.habit_name}
                      </td>
                    );
                  })}
                </tr>
                {/* loop through this months object to use its date */}
                {habits.map((date, i) => {
                  //console.log("this is date[0].date", moment(date[0].date).format("DD"))
                  return (
                    <tr className="habit_rows" key={i}>
                      <td className="habit_data">
                        {moment(date[0].date).format("DD")}
                      </td>
                      {/* while in a single date, loop through all of the habit ids listed in  basic information
                      to ensure that habits are listed in the same order everytime. */}
                      {habitBasicsTracked.map((habit, j) => {
                        // try to match the habitBasics ID that should come next with a habit id in the monthly habits array from redux
                        let index = habits[i]?.findIndex((p) => {
                          return p.habit_id === habit.id;
                        });
                        // if there is no matching id, then create and empty box for that spefic habit on that specifc date
                        if (index < 0 || index === undefined) {
                          return (
                            <td className="habit_data" key={`invalid-${j}`}>
                              <div className="table_box"></div>
                            </td>
                          );
                          // if you can find a matching id, check to see if the dates match the current date that we are in
                        } else if (
                          index >= 0 &&
                          moment(habits[i][index].date).format("YYYY-MM") ===
                            moment(currentYearAndMonth).format("YYYY-MM")
                        ) {
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
                            <td className="habit_data" key={`habit-${j}`}>
                              <div className="table_box">
                                <FontAwesomeIcon
                                  icon={[type, shape]}
                                  className={`${colorClass} clickable`}
                                  onClick={() =>
                                    handleClick(
                                      currentObject.entry_id,
                                      currentObject.was_completed
                                    )
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
          }
        </div>
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
