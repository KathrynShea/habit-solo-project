import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";


function PausedHabits (){
  const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        //on inital load of page, this will populate all habits into the habit reducer
        dispatch({ type: "FETCH_HABIT_BASICS" });
      }, []);

    const allHabitBasics = useSelector(store => store.habitBasicsReducer);
    console.log("this is all habits", allHabitBasics);;
    const pausedHabits = allHabitBasics.filter((habit) => habit.is_tracked === false);
    console.log("this is all of the pausedHabits", pausedHabits);


    const handlePause = (id, is_tracked) => {
      console.log("in handle pause");
  
      let newObject = {
        id: id,
        is_tracked: is_tracked,
      }
      console.log("this is the newobject", newObject);
      dispatch ({type: "CHANGE_TRACKED", payload: newObject})
      history.push("/user");
    }
    return(
      <div>
        <h1>paused habits</h1>
    
    <table>
        <tr>
            <th>habit name</th>
            <th>start date</th>
            <th>end date</th>
            <th></th>
        </tr>
    {pausedHabits.length != 0 && pausedHabits.map((habit) =>{
        return (
        <tr>
            <td>{habit.habit_name}</td>
            <td>{moment(habit.start_date).format('YYYY-MM-DD')}</td>
            <td>{moment(habit.end_date).format('YYYY-MM-DD')}</td>
            <td><button onClick={() => handlePause(habit.id, habit.is_tracked)}>unpause</button></td>
            
        </tr>
        )
    })}
    </table>
    </div>
    
    )
}

export default PausedHabits;