import { useParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";


function Edit (props) {
  const history = useHistory();

    useEffect(() => {
        dispatch({ type: "FETCH_HABITS" });
      }, []);
    const params = useParams();
    const allHabits = useSelector(store => store.habitReducer[0]);

   
    let thisHabitObject = allHabits?.find(entry => entry.habit_id === Number(params.id));
    //console.log("this is thisHabitObject", thisHabitObject?.habit_name);

    let habit_name = thisHabitObject?.habit_name;
    let start_date = thisHabitObject?.start_date;
    let end_date = thisHabitObject?.end_date;
    let shape_id = thisHabitObject?.shape_id;
    let color_id = thisHabitObject?.color_id;

    //console.log("habit_name is", habit_name);

    let dispatch = useDispatch();
  const [newHabitName, setNewHabitName] = useState(`${habit_name}`);
  const [newStartDate, setNewStartDate] = useState(`${start_date}`);
  const [newEndDate, setNewEndDate] = useState(`${end_date}`);
  const [newShapeID, setNewShapeID] = useState(`${shape_id}`);
  const [newColorID, setNewColorID] = useState(`${color_id}`);

  const handleSubmit = () => {
    
    let newHabitObject = {
      habit_name: newHabitName,
      start_date: newStartDate,
      end_date: newEndDate,
      shape_id: newShapeID,
      color_id: newColorID,
      habit_id: Number(params.id),
    };

    //console.log("in handle submit, this is the newHabit Object", newHabitObject);
    

    dispatch({ type:"EDIT_HABIT", payload: newHabitObject });
    history.push("/user");
  };

    return (<><p>we are in the edits page!</p>
    
    <div className="editHabitForm">
        <h1>Edit habit form</h1>
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
        <button>Pause Habit</button>
        <button>Delete Habit</button>
        <button onClick={() => handleSubmit()}>Submit</button>


      </div></>)
}

export default Edit;
