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
    //console.log("all habits in fetch all habits saga", habits.data);
    yield put ({type: "SET_HABITS", payload: habits.data});

    } catch (error) {
        console.log('Error with fetchAllHabits:', error);
  }
}

function* addHabit(action){
   // console.log("addHabitSaga action", action);
    let month = moment(action.payload.start_date).format("MM");
    
    const startDate = moment(action.payload.start_date).startOf("month").format('YYYY-MM-DD');
    const endDate = moment(action.payload.start_date).endOf("month").format('YYYY-MM-DD');
    //console.log("start and end date", startDate, endDate ); 

    let allDates= enumerateDaysBetweenDates(startDate, endDate);

      function enumerateDaysBetweenDates (startDate, endDate){
            let date = [];
            while(moment(startDate) <= moment(endDate)){
               date.push(startDate);
               startDate = moment(startDate).add(1, 'days').format("YYYY-MM-DD");
            }
        return date;
        }
        console.log("this is alldates", allDates);

        let newObject = {
            color_id: action.payload.color_id,
            end_date: action.payload.end_date,
            habit_name: action.payload.habit_name,
            shape_id: action.payload.shape_id,
            start_date: action.payload.start_date,
            all_dates: allDates,
        }


    try {

    // add habit to DB
    yield axios.post('/api/habit/new_habit', newObject);
    yield put({type: "FETCH_HABITS"});
    }catch(error){
        console.log('Error with addingHabit:', error);
    }  
}

export default habitSaga;
