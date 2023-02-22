import axios from "axios";
import moment from "moment";



const habitReducer = (state = [], action) => {

    switch (action.type) {
      case 'ADD_HABIT':
        
        
        case 'SET_HABITS':
            const monthAndYear = (action.payload[0].date).slice(0, 7);
            //console.log("this is monthandYear", monthAndYear);

            //function that organzies habit entries by date
            const startOfMonth = moment(monthAndYear).startOf('month').format('YYYY-MM-DD');
            //console.log("startOfMonth is ", startOfMonth);
            let numOfDays = moment(monthAndYear,"YYYY-MM").daysInMonth(); 
            //console.log("numOfDays is " , numOfDays);
            let currentDate = startOfMonth;
            let allDatesInMonth = [];

            console.log('action.payload', action.payload);
            
            let habit_ids = [];
            for (let entry of action.payload){
                if (!habit_ids.includes(entry.habit_id)){
                    habit_ids.push(entry.habit_id);
                }  
            }
            console.log("this is habit_ids", habit_ids);

            for (let i = 1; i <= numOfDays; i++){

                
                let newArray = []; //for every habit we want an object added even if it doesnt exist for that day
                for(let x = 0; x < action.payload.length; x++){
                    if(moment(action.payload[x].date).format('YYYY-MM-DD') === (moment(currentDate).format('YYYY-MM-DD'))){
                        newArray.push(action.payload[x]);
                    } 
                }
                if (newArray.length === 0){
                    newArray.push({date: moment(currentDate).format("YYYY-MM-DD")},{},{});
                }
            
                //console.log('today is', moment(currentDate).format('YYYY-MM-DD'));
                //console.log("this is the newArray", newArray);
                allDatesInMonth.push(newArray);
            
                currentDate = moment(currentDate).add(1, 'days');
            }
            console.log("this is allDatesInMonthArray", allDatesInMonth);
            return allDatesInMonth;
      
      default:
        return state;
    }
  };
  

  export default habitReducer;

  /*

  onemonth = [{date:01, habit_name: walky},02,03,04,...]

  */
  