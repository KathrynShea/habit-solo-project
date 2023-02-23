import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function HabitAwards (){
    const dispatch = useDispatch();

    useEffect(() => {
        //on inital load of page, this will populate all habits into the habit reducer
        dispatch({ type: "FETCH_HABIT_BASICS" });
      }, []);

    const allHabitBasics = useSelector(store => store.habitBasicsReducer);
    console.log("this is all habits", allHabitBasics);;
    const completedHabits = allHabitBasics.filter((habit) => habit.is_completed);
    console.log("this is all of the completedHabits", completedHabits);

    return(<><p>we are in the habit awards page</p>
    <table>
        <tr>
            <th>habit name</th>
            <th>start date</th>
            <th>end date</th>
        </tr>
    {completedHabits.length != 0 && completedHabits.map((habit) =>{
        return (
        <tr>
            <td>{habit.habit_name}</td>
            <td>{habit.start_date}</td>
            <td>{habit.end_date}</td>
            
        </tr>
        )
    })}
    </table>
    
    
    </>)
}

export default HabitAwards;