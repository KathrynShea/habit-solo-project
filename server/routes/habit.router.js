const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
var moment = require("moment");

//GET all entries for month for all habits
router.get("/:start_date/:length", (req, res) => {
  const start_date = req.params.start_date;
  const length = req.params.length;
  let endDate = moment(start_date).endOf("month").format("YYYY-MM-DD");
  // console.log('this is the enddate in router', endDate)
  //console.log("in get router here is the start date and length", start_date, length);

  //console.log("in habit GET request router");
  let user_id = req.user.id;
  let queryText = `SELECT "public.habit_entries"."id" AS "entry_id", "habit_id","user_id", "date", "was_completed", "habit_name", "color_id", "shape_id", "start_date","end_date", "is_tracked", "is_completed" FROM "public.habit_entries"
  FULL JOIN "public.habits" ON "public.habits"."id" = "habit_id"
  WHERE "public.habits"."user_id"=$1 and "is_tracked" = true and "date"
  BETWEEN $2 AND $3
  ORDER BY "habit_id"
  ;`;
  pool
    .query(queryText, [user_id, start_date, endDate])
    .then((results) => {
      //console.log("this is results.rows", results.rows);
      res.send(results.rows);
    })
    .catch((error) => {
      console.log("Error making SELECT from habits", error);
      res.sendStatus(500);
    });
});

//GET all basic info for each habit
router.get("/basics", (req, res) => {
  //console.log("in habit GET request router");
  let user_id = req.user.id;
  let queryText = `SELECT * FROM "public.habits"
  WHERE "public.habits"."user_id"=$1
  ORDER BY "id"`;

  pool
    .query(queryText, [user_id])
    .then((results) => {
      //console.log("this is results.rows", results.rows);
      res.send(results.rows);
    })
    .catch((error) => {
      console.log("Error making SELECT from habits", error);
      res.sendStatus(500);
    });
});

/**
 * POST route to add new habit
 */
router.post("/new_habit", (req, res) => {
  //console.log("in new_habit POST request router", req.body);
  // POST route code here
  const { habit_name, color_id, shape_id, start_date, end_date } = req.body;
  const all_dates = req.body.all_dates;
  //console.log("this is habit_name", habit_name);
  // console.log("this is all_dates", all_dates);
  let queryText = `INSERT INTO "public.habits" ("habit_name", "color_id", "shape_id", "start_date", "end_date", "user_id")
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING "id"`;

  pool
    .query(queryText, [
      habit_name,
      color_id,
      shape_id,
      start_date,
      end_date,
      req.user.id,
    ])
    .then((results) => {
      //console.log("these are the results.rows[0].id", results.rows[0].id);

      const updateDates = all_dates.map((date) => {
        let newQueryText = `INSERT INTO "public.habit_entries"("habit_id", "date", "was_completed")
    VALUES ($1, $2, $3);`;
        return pool
          .query(newQueryText, [results.rows[0].id, date, false])
          .then()
          .catch((err) => {
            console.log("error updating dates", err);
          });
      });

      res.sendStatus(201);
    })
    .catch((error) => {
      console.log("Error making INSERT for habit", error);
      res.sendStatus(500);
    });
});

//PUT Route to mark day as completed
router.put("/completed", (req, res) => {
  //console.log("In router for completed");
  const queryText = `UPDATE "public.habit_entries"
        SET "was_completed" = $1
        WHERE "public.habit_entries"."id" = $2;`;
  let entry_id = req.body.entry_id;
  let was_completed = req.body.was_completed;

  pool
    .query(queryText, [was_completed, entry_id])
    .then((response) => res.sendStatus(201))
    .catch((err) => {
      console.log("error marking as complete", err);
      res.sendStatus(500);
    });
});

//PUT Route to mark a habit as finished
router.put("/finished", (req, res) => {
  //console.log("In router for finished");
  const queryText = `UPDATE "public.habits"
  SET "is_completed" = $1, "is_tracked"= false
  WHERE "public.habits"."user_id"= $2 AND "id" = $3;`;
  let is_completed = req.body.is_completed;
  let id = req.body.id;
  //console.log("this is is_completed and id".is_completed, id);

  pool
    .query(queryText, [is_completed, req.user.id, id])
    .then((response) => res.sendStatus(201))
    .catch((err) => {
      console.log("error marking as complete", err);
      res.sendStatus(500);
    });
});
//PUT Route to mark habit as tracked
router.put("/tracked", (req, res) => {
  // console.log("In router for completed");
  const queryText = `UPDATE "public.habits"
  SET "is_tracked" = $1
  WHERE "public.habits"."user_id"=$2 AND "id" = $3;`;
  let habit_id = req.body.habit_id;
  let is_tracked = req.body.is_tracked;

  pool
    .query(queryText, [is_tracked, req.user.id, habit_id])
    .then((response) => res.sendStatus(201))
    .catch((err) => {
      console.log("error marking as tracked", err);
      res.sendStatus(500);
    });
});

//PUT Route to update habits after edits
router.put("/edit", (req, res) => {
  const {
    habit_name,
    color_id,
    shape_id,
    start_date,
    end_date,
    is_tracked,
    is_completed,
    habit_id,
  } = req.body;
  const all_dates = req.body.all_dates;

  const firstQueryCheckText = `SELECT * FROM "public.habits"
    WHERE "public.habits"."user_id"=$1 AND "id"=$2;`;
  //first pull in old habit info from DB for this specific habit
  pool.query(firstQueryCheckText, [req.user.id, habit_id]).then((response) => {
    //console.log("this is the response.rows", response.rows);
    //compare the original start/end date with the new start/end date. If they match then we do not need to edit the entry dates for this habit.
    //just edit the basic info for the habit
    if (
      moment(response.rows[0].start_date).format("YYYY-MM-DD") ===
        moment(start_date).format("YYYY-MM-DD") &&
      moment(response.rows[0].end_date).format("YYYY-MM-DD") ===
        moment(end_date).format("YYYY-MM-DD")
    ) {
      //console.log("go ahead without updating dates");
      const queryText = `UPDATE "public.habits"
    SET "habit_name" = $1, "color_id" = $2, "shape_id" = $3, "start_date" = $4, "end_date" = $5, "is_tracked" = true, "is_completed" = false
    WHERE "user_id" = $6 AND "id" = $7;`;
      pool
        .query(queryText, [
          habit_name,
          color_id,
          shape_id,
          start_date,
          end_date,
          req.user.id,
          habit_id,
        ])
        .then((response) => console.log("it worked!"))
        .catch((err) => {
          console.log("error marking as complete", err);
          res.sendStatus(500);
        });
      //if the dates do not match, we will need to edit entry information for this habit
    } else {
      console.log("dates need to be edited");
      // first update all other basic info
      const queryText = `UPDATE "public.habits"
    SET "habit_name" = $1, "color_id" = $2, "shape_id" = $3, "is_tracked" = true, "is_completed" = false
    WHERE "user_id" = $4 AND "id" = $5;`;
      pool
        .query(queryText, [
          habit_name,
          color_id,
          shape_id,
          req.user.id,
          habit_id,
        ])
        .then()
        .catch((err) => {
          res.sendStatus(500);
        });

      //then check if the end date has changed
      if (
        moment(response.rows[0].end_date).format("YYYY-MM-DD") !=
        moment(end_date).format("YYYY-MM-DD")
      ) {
        console.log("you need to update the end date");
        //if new end date is before the old end date, create dates between the two end dates and remove from DB
        if (moment(end_date).isBefore(moment(response.rows[0].end_date))) {
          // console.log("You need to delete the entries between these two dates");

          let datesToBeDeleted = [];
          let currentDate = moment(end_date).add(1, "day");
          let dayAfterCurrentEndDate = moment(response.rows[0].end_date).add(
            1,
            "day"
          );
          // console.log("currentDate and dayAfterCurrentEndDate", currentDate);
          while (moment(currentDate).isBefore(moment(dayAfterCurrentEndDate))) {
            datesToBeDeleted.push({
              date: moment(currentDate).format("YYYY-MM-DD"),
            });
            currentDate = moment(currentDate).add(1, "day");
          }
          // console.log("datesToBeDeleted", datesToBeDeleted);
          datesToBeDeleted.map((date) => {
            let newQueryText = `DELETE FROM "public.habit_entries"
              WHERE "habit_id" = $1 AND "date" = $2;`;
            pool
              .query(newQueryText, [habit_id, date.date])
              .then((res) => {
                let updateHabitEndDateQueryText = `UPDATE "public.habits"
              SET "end_date" = $1
              WHERE "user_id" = $2 AND "id" = $3;`;
                pool
                  .query(updateHabitEndDateQueryText, [
                    end_date,
                    req.user.id,
                    habit_id,
                  ])
                  .then()
                  .catch();
              })
              .catch();
          });
          //if new end date is after the old end date, create dates between the two end dates and add them to the DB
        } else if (
          moment(end_date).isAfter(moment(response.rows[0].end_date))
        ) {
          // console.log("You need to add the dates between these two dates");
          
          let datesToAdd = [];
          let currentDate = response.rows[0].end_date;
          let dayAfterNewEndDate = moment(end_date).add(1,'day');
          while (moment(currentDate).isBefore(moment(dayAfterNewEndDate))) {
            datesToAdd.push({
              habit_id: habit_id,
              date: moment(currentDate).format("YYYY-MM-DD"),
              was_completed: false,
            });
            currentDate = moment(currentDate).add(1, "day");
          }
          // console.log("these are datesToAdd", datesToAdd);
          //adding new dates to the entries table
          datesToAdd.map((date) => {
            let newQueryText = `INSERT INTO "public.habit_entries"("habit_id", "date", "was_completed")
    VALUES ($1, $2, $3);`;
            pool
              .query(newQueryText, [
                date.habit_id,
                date.date,
                date.was_completed,
              ])
              .then((res) => {
                /*update habit end date in the main habit table*/
                let updatehabitText = `UPDATE "public.habits"
            SET "end_date" = $1
            WHERE "user_id" = $2 AND "id" = $3;`;
                pool
                  .query(updatehabitText, [end_date, req.user.id, habit_id])
                  .then(console.log("itworked"))
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          });
        }
      }
      //check if the start date has changed
      if (
        moment(response.rows[0].start_date).format("YYYY-MM-DD") !=
        moment(start_date).format("YYYY-MM-DD")
      ) {
        // console.log("you need to update the start date");
        //if new start date is before the old start date, create dates between the two start dates and add those to the DB
        if (moment(start_date).isBefore(moment(response.rows[0].start_date))) {
          // console.log("you need to add new dates to the beginning");
          let datesToAdd = [];
          let currentDate = start_date;
          while (
            moment(currentDate).isBefore(moment(response.rows[0].start_date))
          ) {
            datesToAdd.push({
              habit_id: habit_id,
              date: moment(currentDate).format("YYYY-MM-DD"),
              was_completed: false,
            });
            currentDate = moment(currentDate).add(1, "day");
          }
          // console.log("these are datesToAdd", datesToAdd);
          //adding new dates to the entries table
          datesToAdd.map((date) => {
            let newQueryText = `INSERT INTO "public.habit_entries"("habit_id", "date", "was_completed")
    VALUES ($1, $2, $3);`;
            pool
              .query(newQueryText, [
                date.habit_id,
                date.date,
                date.was_completed,
              ])
              .then((res) => {
                /*update habit start date in the habit table*/
                let updatehabitText = `UPDATE "public.habits"
            SET "start_date" = $1
            WHERE "user_id" = $2 AND "id" = $3;`;
                pool
                  .query(updatehabitText, [start_date, req.user.id, habit_id])
                  .then(/*console.log("itworked")*/)
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          });

          //if new start date is after the original start date, genereate the dates between those two dates and remove them from the DB
        } else if (
          moment(start_date).isAfter(moment(response.rows[0].start_date))
        ) {
          // console.log("you need to delete entires between these two dates");
          let datesToBeDeleted = [];
          let currentDate = moment(response.rows[0].start_date);
          let newStartDate = moment(start_date);

          while (moment(currentDate).isBefore(moment(newStartDate))) {
            datesToBeDeleted.push({
              date: moment(currentDate).format("YYYY-MM-DD"),
            });
            currentDate = moment(currentDate).add(1, "day");
          }
          //console.log("datesToBeDeleted", datesToBeDeleted);
          datesToBeDeleted.map((date) => {
            let newQueryText = `DELETE FROM "public.habit_entries"
              WHERE "habit_id" = $1 AND "date" = $2;`;
            pool
              .query(newQueryText, [habit_id, date.date])
              .then((res) => {
                let updateHabitEndDateQueryText = `UPDATE "public.habits"
              SET "start_date" = $1
              WHERE "user_id" = $2 AND "id" = $3;`;
                pool
                  .query(updateHabitEndDateQueryText, [
                    start_date,
                    req.user.id,
                    habit_id,
                  ])
                  .then()
                  .catch();
              })
              .catch();
          });
        }
      }
    }
    res.sendStatus(201);
  });
});

//DELETE Route to remove habit from habit table and entries table
router.delete("/delete/:id", (req, res) => {
  // console.log("in router to delete habits");
  const queryText = `DELETE FROM "public.habit_entries"
  WHERE "habit_id" = $1;`;
  // console.log("this is req.body", req.body);

  const habit_id = req.params.id;
  // console.log("this is the habit_id", habit_id);

  pool
    .query(queryText, [habit_id])
    .then((response) => {
      // console.log("first delete worked, now in second delete");
      const newQueryText = `DELETE FROM "public.habits"
        WHERE "id"= $1;`;

      pool
        .query(newQueryText, [habit_id])
        .then((response) => {
          // console.log("both deletes worked!");
        })
        .catch((err) => {
          console.log("error deleteing", err);
          res.sendStatus(500);
        });
      res.sendStatus(200);
    })
    .catch((err) => res.sendStatus(500));
});
module.exports = router;
