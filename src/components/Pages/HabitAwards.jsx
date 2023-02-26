import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import moment from "moment";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

    return(
        <Container>
        <div>
            <h1>completed habits</h1>
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
            <td>{moment(habit.start_date).format('YYYY-MM-DD')}</td>
            <td>{moment(habit.end_date).format('YYYY-MM-DD')}</td>
            
        </tr>
        )
    })}
    </table>
    </div>
    </Container>
    )
}

export default HabitAwards;