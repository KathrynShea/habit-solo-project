import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import moment from "moment";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { useHistory } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

function HabitAwards() {
  const history = useHistory();
  const dispatch = useDispatch();
  //allows us to use the imported fontawesome icons
  library.add(fas, far);

  useEffect(() => {
    //on inital load of page, this will populate all habits into the habit reducer
    dispatch({ type: "FETCH_HABIT_BASICS" });
  }, []);

  const allHabitBasics = useSelector((store) => store.habitBasicsReducer);
  const completedHabits = allHabitBasics.filter((habit) => habit.is_completed);

  const handleDelete = (id) => {
    swal({
      title: "Are you sure?",
      text: "Deleting this habit will remove all information about this habit forever",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch({ type: "DELETE_HABIT", payload: { id: id } });
        swal({
          text: "habit has been deleted",
          icon: "success",
        });
      } else {
        swal("Habit has not been deleted");
      }
    });

    history.push("/awards");
  };

  return (
    <Container>
      <Nav variant="tabs">
        <Nav.Item>
          <Nav.Link>
            <Link to="/user" className="nav_link">
              overview
            </Link>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
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
        <h1>completed habits</h1>
        <div className="award">
          {completedHabits.length != 0 &&
            completedHabits.map((habit) => {
              let shape;
              switch (habit.shape_id) {
                case 1:
                  shape = "fa-square";
                  break;
                case 2:
                  shape = "fa-circle";
                  break;
                case 3:
                  shape = "fa-heart";
                  break;
                case 4:
                  shape = "fa-star";
                  break;
                case 5:
                  shape = "fa-lemon";
                  break;
                case 6:
                  shape = "fa-sun";
                  break;
                case 7:
                  shape = "fa-lightbulb";
                  break;
                case 8:
                  shape = "fa-moon";
                  break;
                case 9:
                  shape = "fa-hand-peace";
                  break;
                case 10:
                  shape = "fa-gem";
                  break;
                case 11:
                  shape = "fa-chess-queen";
                  break;
                case 12:
                  shape = "fa-face-grin-beam";
                  break;
                case 13:
                  shape = "fa-futbol";
                  break;
                case 14:
                  shape = "fa-money-bill-1";
                  break;
                case 15:
                  shape = "fa-floppy-disk";
                  break;
              }

              let colorClass;
              switch (habit.color_id) {
                case 1:
                  colorClass = "one";
                  break;
                case 2:
                  colorClass = "two";
                  break;
                case 3:
                  colorClass = "three";
                  break;
                case 4:
                  colorClass = "four";
                  break;
                case 5:
                  colorClass = "five";
                  break;
                case 6:
                  colorClass = "six";
                  break;
                case 7:
                  colorClass = "seven";
                  break;
                case 8:
                  colorClass = "eight";
                  break;
                case 9:
                  colorClass = "nine";
                  break;
                case 10:
                  colorClass = "ten";
                  break;
                case 11:
                  colorClass = "eleven";
                  break;
                case 12:
                  colorClass = "twelve";
                  break;
                case 13:
                  colorClass = "thirteen";
                  break;
                case 14:
                  colorClass = "fourteen";
                  break;
                case 15:
                  colorClass = "fifteen";
                  break;
                default:
                  colorClass = "regular";
              }
              return (
                <div key={habit.id}>
                  <FontAwesomeIcon
                    icon={`fa-solid ${shape}`}
                    className={`${colorClass} fa-10x`}
                  />
                  <h4 className="center">{habit.habit_name}</h4>
                  <h6 className="center">
                    Completed {moment(habit.end_date).format("MM/DD/YYYY")}
                  </h6>
                  {/* <OverlayTrigger placement="bottom" overlay={tooltip_delete}> */}
                  <h6 className="center">
                    <FontAwesomeIcon
                      icon="fa-regular fa-trash-can"
                      onClick={() => handleDelete(habit.id)}
                      className="clickable"
                    />
                  </h6>
                  {/* </OverlayTrigger> */}
                </div>
              );
            })}
        </div>
      </div>
    </Container>
  );
}

export default HabitAwards;
