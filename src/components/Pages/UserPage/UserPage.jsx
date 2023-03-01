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
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';

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
  // console.log("habits", habits);

  //create local state to manage what month of habits the user is viewing
  const [monthView, setMonthView] = useState(moment().format("MM"));

  //generate current day, month, and year from moment.js
  const thisMonth = moment(monthView).format("MM");
  const currentMonthIndex = moment(thisMonth, "MM").month();
  const monthName = moment(thisMonth, "MM").format("MMMM");
  const thisYear = moment().format("YYYY");
  const currentYearAndMonth = moment(`${thisYear}-${monthView}`).format(
    "YYYY-MM"
  );

  //calculate first and last date of the month
  const startDate = moment([thisYear, currentMonthIndex]);

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
    console.log("id and is completed", id, is_completed);
    


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
    <Container className="habit_table">
      <Nav variant="tabs">
        <Nav.Item className="current_tab">
          <Nav.Link>
            <Link to="/user" className="nav_link">
              overview
            </Link>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link>
            <Link to="/paused" className="nav_link">
              paused
            </Link>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link>
            <Link to="/awards" className="nav_link">
              awards
            </Link>
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="listOfHabits">
        <Row>
          <Col>
            <h3 className="habits_for">Habits for</h3>
          </Col>
        </Row>

        <Row className="month_view_row">
          <Col className="month_view_center">
            {/* used to set month view */}
            <div
              onClick={() =>
                setMonthView(
                  moment(`${monthView}`).subtract(1, "months").format("MM")
                )
              }
              className="overview-month-option month_button"
              variant="light"
            >
              <FontAwesomeIcon icon="fa-solid fa-angle-left" />
            </div>

            <h3 className="overview-month-option month_name">{monthName}</h3>

            <div
              onClick={() =>
                setMonthView(
                  moment(`${monthView}`).add(1, "months").format("MM")
                )
              }
              className="overview-month-option month_button"
              variant="light"
            >
              <FontAwesomeIcon icon="fa-solid fa-angle-right" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="month_view_center">
            <h6>{thisYear}</h6>
          </Col>
        </Row>
        <Row className="row_with_table">
          <Col>
            <div className="all_habit_dates">
              {
                <Table borderless responsive size='sm' className="habits_table">
                  <tbody>
                    <tr className="habit_rows">
                      <td className="habit_data">
                        <FontAwesomeIcon
                          icon="fa-solid fa-trophy"
                          className="white"
                        />
                      </td>
                      {habitBasicsTracked.map((habit, index) => {
                        return (
                          <td key={index} className="habit_data">
                            {/* <OverlayTrigger
                          placement="left"
                          overlay={tooltip_mastered}
                        > */}
                            <div
                              className="table_box"
                              onClick={() =>
                                handleMastered(habit.id, habit.is_completed)
                              }
                            >
                              <FontAwesomeIcon
                                icon="fa-solid fa-trophy"
                                className="clickable dark"
                              />
                            </div>
                            {/* </OverlayTrigger> */}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="habit_rows names">
                      <td className="habit_data name">habit name</td>

                      {/* loop through the basic habit info for all the habits to generate a list of habits for the month */}
                      {habitBasicsTracked.map((habit, x) => {
                        return (
                          <td
                            onClick={() => history.push(`/edit/${habit.id}`)}
                            key={x}
                            className="habit_data text_clickable"
                          >
                            <div className="table_long_box">
                            {habit.habit_name}
                            </div>
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
                            <div className="table_box">
                              {moment(date[0].date).format("DD")}
                            </div>
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
                              moment(habits[i][index].date).format(
                                "YYYY-MM"
                              ) ===
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
                                case 15:
                                  shape = "fa-floppy-disk";
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
                                  case 8:
                                    colorClass = "eight";
                                    break;
                                  case 9:
                                    colorClass = "nine";
                                    break;
                                  case 10:
                                    colorClass = "ten";
                                    break;
                                  case 11:
                                    colorClass = "eleven";
                                    break;
                                  case 12:
                                    colorClass = "twelve";
                                    break;
                                  case 13:
                                    colorClass = "thirteen";
                                    break;
                                  case 14:
                                    colorClass = "fourteen";
                                    break;
                                  case 15:
                                    colorClass = "fifteen";
                                    break;
                                  default:
                                    colorClass = "regular";
                                }
                              }
                              //console.log("this is habit", habit);
                              return (
                                <td className="habit_data" key={j}>
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
                </Table>
              }
            </div>
          </Col>
        </Row>
        <Row className="add_button">
          <Col>
            <Button
              onClick={() => {
                history.push("/form");
              }}
              variant="light"
            >
              <FontAwesomeIcon icon="fa-solid fa-plus" />
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default UserPage;
