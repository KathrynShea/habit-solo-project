import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';

//For moment.js
import moment from "moment";

//For Bootstrap
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from "react-bootstrap/Nav";
import Table from 'react-bootstrap/Table';

//For tooltips
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

//For fontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";



function PausedHabits (){
  const history = useHistory();
    const dispatch = useDispatch();

     //allows us to use the imported fontawesome icons
  library.add(fas, far);

    useEffect(() => {
        //on inital load of page, this will populate all habits into the habit reducer
        dispatch({ type: "FETCH_HABIT_BASICS" });
      }, []);

    const allHabitBasics = useSelector(store => store.habitBasicsReducer);
    // console.log("this is all habits", allHabitBasics);;
    const pausedHabits = allHabitBasics.filter((habit) => habit.is_tracked === false && habit.is_completed === false);
    // console.log("this is all of the pausedHabits", pausedHabits);


    const handlePause = (id, is_tracked) => {
      // console.log("in handle pause");
  
      let newObject = {
        id: id,
        is_tracked: is_tracked,
        history: history
      }
      // console.log("this is the newobject", newObject);
      dispatch ({type: "CHANGE_TRACKED", payload: newObject})
      
    }

    const tooltip_unpause = (
      <Tooltip id="tooltip">
        <strong>Play habit.</strong> Habit will be moved back to overview page.
      </Tooltip>
    );
    return(
      <Container>
        <Nav variant="tabs">
        <Nav.Item>
          <Nav.Link>
            <Link to="/user" className="nav_link">
              overview
            </Link>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item className="current_tab" >
          <Nav.Link>
            <Link to="/paused" className="nav_link">
              paused
            </Link>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link>
            <Link to="/awards" className="nav_link">
              awards
            </Link>
          </Nav.Link>
        </Nav.Item>
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
            <td><OverlayTrigger placement="bottom" overlay={tooltip_unpause}><Button onClick={() => handlePause(habit.id, habit.is_tracked)} variant="light"><FontAwesomeIcon icon="fa-solid fa-play" /></Button></OverlayTrigger></td>
            
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