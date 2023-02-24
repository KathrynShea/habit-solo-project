import moment from "moment";

const habitReducer = (state = [], action) => {

    switch (action.type) {
      case 'ADD_NEW_HABIT':
        //console.log("inside add habit reducer");

        
        case 'SET_HABITS':
            const thisMonthsEntries = action.payload;
            const monthAndYear = moment(thisMonthsEntries[0].date).format('YYYY-MM');
            //console.log("this is monthandYear", monthAndYear);

            //function that organzies habit entries by date
            const startOfMonth = moment(monthAndYear).startOf('month').format('YYYY-MM-DD');
            //console.log("startOfMonth is ", startOfMonth);
            let numOfDays = moment(monthAndYear,"YYYY-MM").daysInMonth(); 
            //console.log("numOfDays is " , numOfDays);
            let currentDate = startOfMonth;
            let allDatesInMonth = [];

            //console.log('thisMonthsEntries', thisMonthsEntries);
            
            let habit_ids = [];
            for (let entry of thisMonthsEntries){
                if (!habit_ids.includes(entry.habit_id)){
                    habit_ids.push(entry.habit_id);
                }  
            }
            //console.log("this is habit_ids", habit_ids);


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
            

            if(thisDaysEntries.length === 0){
                for (let habit_id of habit_ids){
                    thisDaysEntries.push({date: moment(currentDate).format("YYYY-MM-DD")})
                }
            }
            //console.log("updated thisDaysEntries", thisDaysEntries);

            allDatesInMonth.push(thisDaysEntries); 
        }



            //     const thisDaysArray = []
            //     for(let i = 0; i <= habit_ids.length -1; i++){

            //         for(let entry of thisDaysEntries){
            //             if(habit_ids[i] === entry.habit_id){
            //                 thisDaysArray.push(entry);
            //             }
            //         }

            //         thisDaysArray.push({});
            //     }

            //     allDatesInMonth.push(thisDaysArray);
            // }

            //console.log('month array', allDatesInMonth);








            // for (let i = 1; i <= numOfDays; i++){
            //     let thisDaysEntries = []; //for every habit we want an object added even if it doesnt exist for that day
            //     for(let x = 0; x < thisMonthsEntries.length; x++){
            //         if(moment(thisMonthsEntries[x].date).format('YYYY-MM-DD') === (moment(currentDate).format('YYYY-MM-DD'))){
            //             for(let habit of habit_ids){
            //                 if(habit === thisMonthsEntries[x].habit_id){
            //                     thisDaysEntries.push(thisMonthsEntries[x]);
            //                 } else{
            //                     thisDaysEntries.push({date: moment(currentDate).format("YYYY-MM-DD")});
            //                 }
            //             }
            //         } else{
            //             for(let habit of habit_ids){
            //                 thisDaysEntries.push({date: moment(currentDate).format("YYYY-MM-DD")});
            //             }
            //         }
            //     }
            
                //console.log('today is', moment(currentDate).format('YYYY-MM-DD'));
                //console.log("this is the thisDaysEntries", thisDaysEntries);
                // allDatesInMonth.push(thisDaysEntries);
            
                // currentDate = moment(currentDate).add(1, 'days');


            // }
            //console.log("this is allDatesInMonthArray", allDatesInMonth);
            return allDatesInMonth;
      
      default:
        return state;
    }
  };

  export default habitReducer;

  /*

  onemonth = [{date:01, habit_name: walky},02,03,04,...]

  */
  