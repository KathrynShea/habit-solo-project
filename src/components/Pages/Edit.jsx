import { useParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function Edit(props) {
  const history = useHistory();
  let dispatch = useDispatch();
  const params = useParams();

  const [newHabitName, setNewHabitName] = useState();
  const [newStartDate, setNewStartDate] = useState();
  const [newEndDate, setNewEndDate] = useState();
  const [newShapeID, setNewShapeID] = useState();
  const [newColorID, setNewColorID] = useState();



  //move into state and move param into state as well
  const allHabits = useSelector((store) => store.habitReducer);
  console.log("this is allHabits", allHabits);
  const allHabitBasics = useSelector((store) => store.habitBasicsReducer);
  console.log("this is allHabitBasics", allHabitBasics);
  const thisHabitBasics = allHabitBasics.filter(
    (habit) => habit.id === Number(params.id)
  );



  let thisHabitObject = allHabits?.find(
    (entry) => entry.habit_id === Number(params.id)
  );
  console.log("this is thisHabitObject", thisHabitObject);

  useEffect(() => {

    // update state with default habit values when thisHabitBasics
    setNewHabitName(thisHabitBasics[0]?.habit_name)
    setNewStartDate(thisHabitBasics[0]?.start_date)
    setNewEndDate(thisHabitBasics[0]?.end_date)
    setNewShapeID(thisHabitBasics[0]?.shape_id)
    setNewColorID(thisHabitBasics[0]?.color_id)

  }, [thisHabitBasics]);

  //console.log("habit_name is", habit_name);

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

    dispatch({ type: "EDIT_HABIT", payload: newHabitObject });
    history.push("/user");
  };

  const handlePause = () => {
    console.log("in handle pause");

    let newObject = {
      id: thisHabitBasics[0].id,
      is_tracked: thisHabitBasics[0].is_tracked,
    }
    console.log("this is the newobject", newObject);
    dispatch ({type: "CHANGE_TRACKED", payload: newObject})
  }

  useEffect(() => {
    dispatch({ type: "FETCH_HABITS" });
    dispatch({ type: "FETCH_HABIT_BASICS" });
  }, []);

  console.log("this is habitbasics", thisHabitBasics)

  return (
    <>
      <p>we are in the edits page!</p>

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
        <button onClick={() => handlePause()}>Pause Habit</button>
        <button>Delete Habit</button>
        <button onClick={() => handleSubmit()}>Submit</button>
        <button onClick={() => history.push("/user")}>back to overview</button>
      </div>
    </>
  );
}

export default Edit;
