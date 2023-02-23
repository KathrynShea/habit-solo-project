import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

function Form() {
  const history = useHistory();
  //allows us to use the imported fontawesome icons
  library.add(fas, far);

  let dispatch = useDispatch();
  const [newHabitName, setNewHabitName] = useState();
  const [newStartDate, setNewStartDate] = useState();
  const [newEndDate, setNewEndDate] = useState();
  const [newShapeID, setNewShapeID] = useState();
  const [newColorID, setNewColorID] = useState();

  console.log("newShapeId is", newShapeID);
  console.log("newColorId is", newColorID);

  const handleSubmit = () => {
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
  };
  let type;
  let shape;
  let colorClass;

  if (newShapeID && newColorID) {
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
      default:
        colorClass = "regular";
    }
  } else {
    type = "fa-solid";
    shape = "fa-square";
    colorClass = "regular";
  }

  return (
    <div className="newHabitForm">
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

      <p>choose a shape</p>
      <table className="shapes">
        <tr>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-square"
              onClick={() => setNewShapeID(1)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-circle"
              onClick={() => setNewShapeID(2)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-heart"
              onClick={() => setNewShapeID(3)}
            />
          </td>
        </tr>
        <tr>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-star"
              onClick={() => setNewShapeID(4)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-lemon"
              onClick={() => setNewShapeID(5)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-sun"
              onClick={() => setNewShapeID(6)}
            />
          </td>
        </tr>
        <tr>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-lightbulb"
              onClick={() => setNewShapeID(7)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-moon"
              onClick={() => setNewShapeID(8)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-hand-peace"
              onClick={() => setNewShapeID(9)}
            />
          </td>
        </tr>
        <tr>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-gem"
              onClick={() => setNewShapeID(10)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-chess-queen"
              onClick={() => setNewShapeID(11)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-face-grin-beam"
              onClick={() => setNewShapeID(12)}
            />
          </td>
        </tr>
        <tr>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-futbol"
              onClick={() => setNewShapeID(13)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-regular fa-money-bill-1"
              onClick={() => setNewShapeID(14)}
            />
          </td>
        </tr>
      </table>
      <p>choose a color</p>
      <table className="colors">
        <tr>
          <td>
            <FontAwesomeIcon
              icon="fa-solid fa-circle"
              className="one"
              onClick={() => setNewColorID(1)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-solid fa-circle"
              className="two"
              onClick={() => setNewColorID(2)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-solid fa-circle"
              className="three"
              onClick={() => setNewColorID(3)}
            />
          </td>
        </tr>
        <tr>
          <td>
            <FontAwesomeIcon
              icon="fa-solid fa-circle"
              className="four"
              onClick={() => setNewColorID(4)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-solid fa-circle"
              className="five"
              onClick={() => setNewColorID(5)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon="fa-solid fa-circle"
              className="six"
              onClick={() => setNewColorID(6)}
            />
          </td>
        </tr>
        <tr>
          <td>
            <FontAwesomeIcon
              icon="fa-solid fa-circle"
              className="seven"
              onClick={() => setNewColorID(7)}
            />
          </td>
        </tr>
      </table>

      <div className="iconPreview">
        <FontAwesomeIcon icon={[type, shape]} className={colorClass} />
      </div>

      <button onClick={() => handleSubmit()}>Submit</button>
      <button onClick={() => history.push("/user")}>back to overview</button>
    </div>
  );
}

export default Form;
