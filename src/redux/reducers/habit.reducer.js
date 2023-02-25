import moment from "moment";

const habitReducer = (state = [], action) => {

    switch (action.type) {
      case 'ADD_NEW_HABIT':
        //console.log("inside add habit reducer");

        
        case 'SET_HABITS':
            const thisYearsEntries = action.payload;

            //function that organzies habit entries by date
            const startOfYear = moment().startOf('year').format('YYYY-MM-DD');
            let numOfDays = 365
            //console.log("numOfDays is " , numOfDays);
            let currentDate = startOfYear;
            // console.log("currentDate is", currentDate);
            let allDatesInYear = [];

            //console.log('thisYearsEntries', thisYearsEntries);
            
            let habit_ids = [];
            for (let entry of thisYearsEntries){
                if (!habit_ids.includes(entry.habit_id)){
                    habit_ids.push(entry.habit_id);
                }  
            }
            // console.log("this is habit_ids", habit_ids);


            for(let i = 0; i< numOfDays; i++){

                const thisDaysEntries = [];
                // collect all entries for this day
                for(let entry of thisYearsEntries){
                    //console.log("entry.date", moment(entry.date).format('YYYY-MM-DD'));
                    //console.log("current.date", moment(currentDate).format('YYYY-MM-DD'));
                    //console.log(moment(entry.date).format('YYYY-MM-DD') === moment(currentDate).format('YYYY-MM-DD'))
                    if((moment(entry.date).format('YYYY-MM-DD')) == (moment(currentDate).format('YYYY-MM-DD'))){
                        thisDaysEntries.push(entry);
                    }else{}
                }
                
                 currentDate = moment(currentDate).add(1, 'days');
                 //console.log("thisDaysEntries", thisDaysEntries);
            
                //  {console.log("this is thisDaysEntries", thisDaysEntries)}
            if(thisDaysEntries.length === 0){
                
                for (let habit_id of habit_ids){
                    thisDaysEntries.push({date: moment(currentDate).format('YYYY-MM-DD')})
                }
            }
            
            allDatesInYear.push(thisDaysEntries); 
        }
        //console.log("this is allDatesInYear", allDatesInYear);

            return allDatesInYear;
      
      default:
        return state;
    }
  };

  export default habitReducer;
