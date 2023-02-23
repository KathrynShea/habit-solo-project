const habitBasicsReducer = (state = [], action) =>{
    switch (action.type){
        case "SET_HABIT_BASICS":
            return action.payload
        default:
            return state;
    }

}

export default habitBasicsReducer;
