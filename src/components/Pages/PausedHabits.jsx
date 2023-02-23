import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function PausedHabits (){
    const dispatch = useDispatch();

    useEffect(() => {
        //on inital load of page, this will populate all habits into the habit reducer
        dispatch({ type: "FETCH_HABIT_BASICS" });
      }, []);

    const allHabits = useSelector(store => store.habitReducer);
    console.log("this is all habits", allHabits);
    //const pausedHabits = allHabits.filter(habit)


    //pull in all habits for this user
    //filter so we only have ones that are paused(not tracked)
    //map over the new list and display to dom
    return(<><p>we are in paused habits!</p></>)
}

export default PausedHabits;