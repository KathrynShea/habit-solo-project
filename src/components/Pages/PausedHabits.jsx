import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Nav from "react-bootstrap/Nav";
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';



function PausedHabits (){
  const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        //on inital load of page, this will populate all habits into the habit reducer
        dispatch({ type: "FETCH_HABIT_BASICS" });
      }, []);

    const allHabitBasics = useSelector(store => store.habitBasicsReducer);
    console.log("this is all habits", allHabitBasics);;
    const pausedHabits = allHabitBasics.filter((habit) => habit.is_tracked === false && habit.is_completed === false);
    console.log("this is all of the pausedHabits", pausedHabits);


    const handlePause = (id, is_tracked) => {
      console.log("in handle pause");
  
      let newObject = {
        id: id,
        is_tracked: is_tracked,
        history: history
      }
      console.log("this is the newobject", newObject);
      dispatch ({type: "CHANGE_TRACKED", payload: newObject})
      
    }
    return(
      <Container>
        <Nav variant="tabs">

<Nav.Link>
<Nav.Item>
  <Link to="/user" className="nav_link">overview</Link>
</Nav.Item>
</Nav.Link>

<Nav.Link>
  <Nav.Item>
    <Link to="/paused" className="nav_link">paused</Link>
  </Nav.Item>
</Nav.Link>

<Nav.Link>
<Nav.Item>
  <Link to="/awards" className="nav_link">awards</Link>
</Nav.Item>
</Nav.Link>
</Nav>

      <div>
        <h1>paused habits</h1>
    
    <Table   hover size="sm">
      <thead>
        <tr>
            <th className="paused_table_head">habit name</th>
            <th className="paused_table_head">start date</th>
            <th className="paused_table_head">end date</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
    {pausedHabits.length != 0 && pausedHabits.map((habit) =>{
        return (
        <tr>
            <td>{habit.habit_name}</td>
            <td>{moment(habit.start_date).format('MM/DD/YYYY')}</td>
            <td>{moment(habit.end_date).format('MM/DD/YYYY')}</td>
            <td><Button onClick={() => handlePause(habit.id, habit.is_tracked)} variant="light">unpause</Button></td>
            
        </tr>
        
        )
    })}
    </tbody>
    </Table>
    </div>
    </Container>
    
    )
}

export default PausedHabits;