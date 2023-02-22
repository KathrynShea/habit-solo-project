import { useState } from "react";
import { useDispatch } from "react-redux";

function Form() {

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
    console.log("in handle submit this is the newHabitObject", newHabitObject);

    dispatch({ type:"ADD_HABIT", payload: newHabitObject });
  };

    return (<><p>Hello!We are in the form page!</p>
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
      </div></>)
}

export default Form;