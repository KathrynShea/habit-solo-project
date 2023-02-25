import moment from "moment";

const habitReducer = (state = [], action) => {

    switch (action.type) {
        
        case 'SET_HABITS':
            const thisMonthsEntries = action.payload;
            //console.log("this thisMonthsEntries in reducer", thisMonthsEntries)
            let dateInCurrentMonth = moment(thisMonthsEntries[0].date).format('YYYY-MM-DD');
            //console.log("dateInCurrentMonth", dateInCurrentMonth)

            //function that organzies habit entries by date
            const startOfMonth = moment(dateInCurrentMonth).startOf('month').format('YYYY-MM-DD');
            // console.log("StartOfMonth", startOfMonth )
            let numOfDays = moment(startOfMonth).daysInMonth();
            // console.log("numOfDays is " , numOfDays);
            let currentDate = startOfMonth;
            // console.log("currentDate is", currentDate);
            let allDatesInMonth = [];

            //console.log('thisMonthsEntries', thisMonthsEntries);
            
            let habit_ids = [];
            for (let entry of thisMonthsEntries){
                if (!habit_ids.includes(entry.habit_id)){
                    habit_ids.push(entry.habit_id);
                }  
            }
            //  console.log("this is habit_ids", habit_ids);


            for(let i = 0; i< numOfDays; i++){

                const thisDaysEntries = [];
                // collect all entries for this day
                for(let entry of thisMonthsEntries){
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
            
            allDatesInMonth.push(thisDaysEntries); 
        }
        // console.log("this is allDatesInMonth", allDatesInMonth);

            return allDatesInMonth;
      
      default:
        return state;
    }
  };

  export default habitReducer;
