import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import swal from 'sweetalert';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

function Form() {
  const history = useHistory();
  //allows us to use the imported fontawesome icons
  library.add(fas, far);
  let dispatch = useDispatch();

  //tracks newhabit input information
  const [newHabitName, setNewHabitName] = useState();
  const [newStartDate, setNewStartDate] = useState();
  const [newEndDate, setNewEndDate] = useState();
  const [newShapeID, setNewShapeID] = useState();
  const [newColorID, setNewColorID] = useState();

  // console.log("newShapeId is", newShapeID);
 console.log("newColorId is", newColorID);

  const handleSubmit = () => {

    if(!newHabitName || !newStartDate || !newEndDate){
      swal({
        title: "please complete all fields",
        icon: "error"});
    } else if(!newShapeID || !newColorID){
      swal({
        title: "please confirm you habicon by selecting an icon and color",
        icon: "error"});
    }else{
    let newHabitObject = {
      habit_name: newHabitName,
      start_date: newStartDate,
      end_date: newEndDate,
      shape_id: newShapeID,
      color_id: newColorID,
    };
    //console.log("in handle submit this is the newHabitObject", newHabitObject);

    dispatch({ type: "ADD_HABIT", payload: newHabitObject });
    history.push("/user");
  }
  };

  //conditional rendering depending on user shape and color selections
  let type = "fa-solid";
  let shape = "fa-sqaure";
  let colorClass = "regular";

  if (newShapeID || newColorID) {
    type = "fa-solid";

    switch (newShapeID) {
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

    switch (newColorID) {
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
  } else {
    type = "fa-solid";
    shape = "fa-square";
    colorClass = "regular";
  }

  return (
    <Container className="edit_page">
      <div className="newHabitForm">
        <Row>
          <Col>
          <Button onClick={() => history.push("/user")} variant="light">
          <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
        </Button>
          </Col>
        </Row>

        <h2>Add Habit</h2>
        <Row className="justify-content-md-center">
          <Col>
        <input
          placeholder="habit name"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        </Col>  
        </Row>
        <Row className="date_inputs">
          <Col>
        <input
          type="date"
          value={newStartDate}
          onChange={(e) => setNewStartDate(e.target.value)}
        />
        </Col>
        <Col>
        <input
          type="date"
          value={newEndDate}
          onChange={(e) => setNewEndDate(e.target.value)}
        />
        </Col>
        </Row>
        <Row className="center">
          <Col className="center">
        <div className="shapes">
          <table>
            <tr>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-square"
                    className="clickable"
                    onClick={() => setNewShapeID(1)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-circle"
                    className="clickable"
                    onClick={() => setNewShapeID(2)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-heart"
                    className="clickable"
                    onClick={() => setNewShapeID(3)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-star"
                    className="clickable"
                    onClick={() => setNewShapeID(4)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-lemon"
                    className="clickable"
                    onClick={() => setNewShapeID(5)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-sun"
                    className="clickable"
                    onClick={() => setNewShapeID(6)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-lightbulb"
                    className="clickable"
                    onClick={() => setNewShapeID(7)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-moon"
                    className="clickable"
                    onClick={() => setNewShapeID(8)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-hand-peace"
                    className="clickable"
                    onClick={() => setNewShapeID(9)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-gem"
                    className="clickable"
                    onClick={() => setNewShapeID(10)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-chess-queen"
                    className="clickable"
                    onClick={() => setNewShapeID(11)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-face-grin-beam"
                    className="clickable"
                    onClick={() => setNewShapeID(12)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-futbol"
                    className="clickable"
                    onClick={() => setNewShapeID(13)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-money-bill-1"
                    className="clickable"
                    onClick={() => setNewShapeID(14)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-regular fa-floppy-disk"
                    className="clickable"
                    onClick={() => setNewShapeID(15)}
                  />
                </div>
              </td>
            </tr>
            
          </table>
        </div>
        </Col>
        <Col className="center">
        <div className="colors">
          <table>
            <tr>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="one clickable"
                    onClick={() => setNewColorID(1)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="two clickable"
                    onClick={() => setNewColorID(2)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="three clickable"
                    onClick={() => setNewColorID(3)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="four clickable"
                    onClick={() => setNewColorID(4)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="five clickable"
                    onClick={() => setNewColorID(5)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="six clickable"
                    onClick={() => setNewColorID(6)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="seven clickable"
                    onClick={() => setNewColorID(7)}
                  />
                </div>
              </td>
            <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="eight clickable"
                    onClick={() => setNewColorID(8)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="nine clickable"
                    onClick={() => setNewColorID(9)}
                  />
                </div>
              </td>
              </tr>
              <tr>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="ten clickable"
                    onClick={() => setNewColorID(10)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="eleven clickable"
                    onClick={() => setNewColorID(11)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="twelve clickable"
                    onClick={() => setNewColorID(12)}
                  />
                </div>
              </td>
              </tr>
              <tr>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="thirteen clickable"
                    onClick={() => setNewColorID(13)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="fourteen clickable"
                    onClick={() => setNewColorID(14)}
                  />
                </div>
              </td>
              <td>
                <div className="table_box">
                  <FontAwesomeIcon
                    icon="fa-solid fa-circle"
                    className="fifteen clickable"
                    onClick={() => setNewColorID(15)}
                  />
                </div>
              </td>

              </tr>
          </table>
        </div>
        </Col>
        </Row>
        <Row>
          <Col>
        <div className="center">
          <FontAwesomeIcon
            icon={[type, shape]}
            className={`${colorClass} fa-10x`}
          />
        </div>
        </Col>
        </Row>

        <div className="submit_button_div">
        <Button onClick={() => handleSubmit()} variant="light" className="single_line_button">
          <FontAwesomeIcon icon="fa-solid fa-check" />
        </Button>
        </div>

      </div>
    </Container>
  );
}

export default Form;
