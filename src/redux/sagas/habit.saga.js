import React from "react";
import ReactDOM from "react-dom";
import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import moment from "moment";


function* habitSaga(action) {
    yield takeEvery("FETCH_HABITS", fetchAllHabits);
    yield takeEvery("ADD_HABIT", addHabit);
}

function* fetchAllHabits(action){
    //console.log("in fetch habit saga");
    try {
    // get all habits from DB
    const habits = yield axios.get("/api/habit")
    console.log("all habits in fetch all habits saga", habits.data);
    yield put ({type: "SET_HABITS", payload: habits.data});

    } catch (error) {
        console.log('Error with fetchAllHabits:', error);
  }
}

function* addHabit(action){
    console.log("addHabitSaga action", action);

    let month = action.payload.start_date;
    //console.log("in add habit saga");
    try {

    // add habit to DB
    yield axios.post('/api/habit/new_habit', action.payload);
    yield put({type: "FETCH_HABITS"});
    }catch(error){
        console.log('Error with addingHabit:', error);
    }  
}

export default habitSaga;
