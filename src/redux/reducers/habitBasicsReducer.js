const habitBasicsReducer = (state = [], action) =>{
    switch (action.type){
        //receives basic info for each habit and saves in redux
        case "SET_HABIT_BASICS":
            return action.payload
        default:
            return state;
    }

}

export default habitBasicsReducer;
