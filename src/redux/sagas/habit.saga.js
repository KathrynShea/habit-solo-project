import React from "react";
import ReactDOM from "react-dom";
import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import moment from "moment";


function* habitSaga(action) {
    yield takeEvery("FETCH_HABIT_BASICS", fetchHabitBasics);
    yield takeEvery("FETCH_HABITS", fetchAllHabits);
    yield takeEvery("ADD_HABIT", addHabit);
    yield takeEvery("EDIT_HABIT", editHabit);
    yield takeEvery("CHANGE_COMPLETE", updateComplete);
    yield takeEvery("CHANGE_TRACKED", updateTracked);
    yield takeEvery("CHANGE_FINISHED", updateFinished);
    
}

function* updateTracked(action){
    let newObject = { 
        habit_id: action.payload.id,
        is_tracked: !action.payload.is_tracked,
    }
    try{
       yield axios.put("/api/habit/tracked", newObject);
        yield put({type: "FETCH_HABITS"}); 

    }catch (error){
        console.log("error with habit basics in saga", error);
    }
}

function* updateFinished(action){
    let newObject = {
        entry_id: action.payload.entry_id,
        was_completed: !action.payload.was_completed
    }
    try{
       yield axios.put("/api/habit/completed", newObject);
        yield put({type: "FETCH_HABITS"}); 
    }catch (error){
        console.log("error with habit basics in saga", error);
    }
}


function* fetchHabitBasics(){
    //console.log("in habit basics saga");
    try{
       const habits =  yield axios.get("/api/habit/basics");
        //console.log("got my habits back into saga this is habits.data", habits.data)
        yield put({type: "SET_HABIT_BASICS", payload: habits.data});

    }catch (error){
        console.log("error with getting habit basics in saga", error);
    }
}
function* updateComplete(action){
    //console.log("in update complete saga this is action.payload", action.payload);
    try{
        yield axios.put("/api/habit/completed", action.payload);
        yield put({type: "FETCH_HABITS"}); 

    }
    catch (error){
        console.log(`Error with updating completed saga`, error);
    }
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

function* editHabit(action){
    //console.log("in editHabit function", action);
    try{
        yield axios.put("/api/habit/edit", action.payload);
        yield put({type: "FETCH_HABITS"});

    }catch (error){
        console.log('Error editing habit in saga');
    }

}

function* addHabit(action){
   // console.log("addHabitSaga action", action);
    
    const startDate = moment(action.payload.start_date).format('YYYY-MM-DD');
    const endDate = moment(action.payload.end_date).format('YYYY-MM-DD');
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
        //console.log("this is alldates", allDates);

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
