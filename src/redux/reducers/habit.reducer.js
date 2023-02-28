import moment from "moment";

const habitReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_HABITS":
      //receives all habit entries for the month and groups by date
      const thisMonthsEntries = action.payload;

      //confirm what month we are building out for
      let dateInCurrentMonth = moment(thisMonthsEntries[0].date).format(
        "YYYY-MM-DD"
      );

      //use moment.js calculate number of days in the month and the first date of month
      const startOfMonth = moment(dateInCurrentMonth)
        .startOf("month")
        .format("YYYY-MM-DD");
      let numOfDays = moment(startOfMonth).daysInMonth();
      let currentDate = startOfMonth;

      //holds the whole months worth of entries organized by day.
      let allDatesInMonth = [];

      //create a list of all the habit ids that will be used this month
      let habit_ids = [];
      for (let entry of thisMonthsEntries) {
        if (!habit_ids.includes(entry.habit_id)) {
          habit_ids.push(entry.habit_id);
        }
      }

      //for every day in the month, create an array that will hold all the different entries for that day
      for (let i = 0; i < numOfDays; i++) {
        const thisDaysEntries = [];
        // collect all entries for this day
        for (let entry of thisMonthsEntries) {
          if (
            moment(entry.date).format("YYYY-MM-DD") ==
            moment(currentDate).format("YYYY-MM-DD")
          ) {
            thisDaysEntries.push(entry);
          } else {
          }
        }

        currentDate = moment(currentDate).add(1, "days");

        //if there are no entries for this day, then just push an object with the current date
        if (thisDaysEntries.length === 0) {
          for (let habit_id of habit_ids) {
            thisDaysEntries.push({
              date: moment(currentDate).format("YYYY-MM-DD"),
            });
          }
        }

        //add this days entries to the whole list of entries for the month
        allDatesInMonth.push(thisDaysEntries);
      }

      return allDatesInMonth;

    default:
      return state;
  }
};

export default habitReducer;
