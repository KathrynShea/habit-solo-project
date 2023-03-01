import React from "react";
import ReactDOM from "react-dom";
import { put, takeLatest, takeEvery } from "redux-saga/effects";
import axios from "axios";
import moment from "moment";



function* habitSaga(action) {
  yield takeEvery("FETCH_HABIT_BASICS", fetchHabitBasics);
  yield takeEvery("FETCH_HABITS", fetchAllHabits);
  yield takeEvery("ADD_HABIT", addHabit);
  yield takeEvery("EDIT_HABIT", editHabit);
  yield takeEvery("CHANGE_COMPLETE", updateComplete);
  yield takeEvery("CHANGE_TRACKED", updateTracked);
  yield takeEvery("CHANGE_FINISHED", updateFinished);
  yield takeEvery("DELETE_HABIT", deleteHabit);
}

//used to add a new habit
function* addHabit(action) {
  let history = action.payload.history
  const startDate = moment(action.payload.start_date).format("YYYY-MM-DD");
  const endDate = moment(action.payload.end_date).format("YYYY-MM-DD");

  let allDates = enumerateDaysBetweenDates(startDate, endDate);
  //use given start and end dates to create a list of all the dates that this habit will be tracked
  function enumerateDaysBetweenDates(startDate, endDate) {
    let date = [];
    while (moment(startDate) <= moment(endDate)) {
      date.push(startDate);
      startDate = moment(startDate).add(1, "days").format("YYYY-MM-DD");
    }
    return date;
  }
  let newObject = {
    color_id: action.payload.color_id,
    end_date: action.payload.end_date,
    habit_name: action.payload.habit_name,
    shape_id: action.payload.shape_id,
    start_date: action.payload.start_date,
    all_dates: allDates,
  };
  try {
    //add habit to DB
    yield axios.post("/api/habit/new_habit", newObject);
    yield put({type: "FETCH_HABITS"}), put({type: "FETCH_HABIT_BASICS"});
    yield history.push('/user');
  } catch (error) {
    console.log("Error with addingHabit:", error);
  }
}

//used to remove habit from database
function* deleteHabit(action) {
  let history = action.payload.history
  let id = action.payload.id;
  try {
    yield axios.delete(`/api/habit/delete/${id}`);
    yield put({type: "FETCH_HABIT_BASICS"});
    yield history.push('/user');
  } catch (error) {
    console.log("error deleting habit in saga", error);
  }
}

//used to edit any of the original settings for a habit
function* editHabit(action) {
  try {
    yield axios.put("/api/habit/edit", action.payload);
    yield put({type: "FETCH_HABITS"}),  put({type: "FETCH_HABIT_BASICS"});
  } catch (error) {
    console.log("Error editing habit in saga");
  }
}

//Used to grab current months daily habit entry info(each date, if completed that day)
function* fetchAllHabits(action) {
  try {
    //this date determines what months info we will be grabing
    let startDate;

    //if no info about month is sent over, assume current month
    if (!action.payload) {
      startDate = moment().startOf("month").format("YYYY-MM-DD");
      //if month info is sent over, use that
    } else {
      startDate = action.payload;
    }

    // get this months habit entries from DB
    const habits = yield axios.get(`/api/habit/${startDate}/month`);
    // console.log("saga habits.data", habits.data)
    if (habits.data.length === 0){
      habits.data = [{date: startDate}];
    }
    yield put({ type: "SET_HABITS", payload: habits.data });
  } catch (error) {
    console.log("Error with fetchAllHabits:", error);
  }
}

//Used to grab current months basic habit info(habit name, id, start/end date, if tracked, if mastered)
function* fetchHabitBasics() {
  try {
    const habits = yield axios.get("/api/habit/basics");
    yield put({ type: "SET_HABIT_BASICS", payload: habits.data });
  } catch (error) {
    console.log("error with getting habit basics in saga", error);
  }
}

//used to mark a day as completed for a specific habit
function* updateComplete(action) {
  let startDate = action.payload.startDate;
  try {
    yield axios.put("/api/habit/completed", action.payload);
    yield put({ type: "FETCH_HABITS", payload: startDate });
  } catch (error) {
    console.log(`Error with updating completed saga`, error);
  }
}

//used to mark a habit as mastered
function* updateFinished(action) {
  let newObject = {
    is_completed: !action.payload.is_completed,
    id: action.payload.id,
  };
  try {
    yield axios.put("/api/habit/finished", newObject);
    yield put({type: "FETCH_HABITS"}), put({type: "FETCH_HABIT_BASICS"});
  } catch (error) {
    console.log("error with habit basics in saga", error);
  }
}

//used to mark a habit as paused/unpaused
function* updateTracked(action) {

  let history = action.payload.history;

  let newObject = {
    habit_id: action.payload.id,
    is_tracked: !action.payload.is_tracked,
  };
  try {
    yield axios.put("/api/habit/tracked", newObject);
    yield put({type: "FETCH_HABITS"}), put({type: "FETCH_HABIT_BASICS"});
    yield history.push("/user");
  } catch (error) {
    console.log("error with habit basics in saga", error);
  }
}

export default habitSaga;
