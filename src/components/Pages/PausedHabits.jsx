import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import moment from "moment";


function PausedHabits (){
    const dispatch = useDispatch();

    useEffect(() => {
        //on inital load of page, this will populate all habits into the habit reducer
        dispatch({ type: "FETCH_HABIT_BASICS" });
      }, []);

    const allHabitBasics = useSelector(store => store.habitBasicsReducer);
    console.log("this is all habits", allHabitBasics);;
    const pausedHabits = allHabitBasics.filter((habit) => habit.is_tracked === false);
    console.log("this is all of the pausedHabits", pausedHabits);


    //pull in all habits for this user
    //filter so we only have ones that are paused(not tracked)
    //map over the new list and display to dom
    return(<><p>we are in paused habits!</p>
    
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
            <td><button>unpause</button></td>
            
        </tr>
        )
    })}
    </table>
    
    </>)
}

export default PausedHabits;