const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
var moment = require("moment");

//GET all entries for month for all habits and send to saga
router.get("/:start_date/:length", (req, res) => {
  const start_date = req.params.start_date;
  const length = req.params.length;
  let endDate = moment(start_date).endOf("month").format("YYYY-MM-DD");

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
      // console.log("in the get route, results.rows", results.rows);
      res.send(results.rows);
    })
    .catch((error) => {
      console.log("Error making SELECT from habits", error);
      res.sendStatus(500);
    });
});

//GET all basic info for each habit and send to saga
router.get("/basics", (req, res) => {
  let user_id = req.user.id;
  let queryText = `SELECT * FROM "public.habits"
  WHERE "public.habits"."user_id"=$1
  ORDER BY "id"`;

  pool
    .query(queryText, [user_id])
    .then((results) => {
      res.send(results.rows);
    })
    .catch((error) => {
      console.log("Error making SELECT from habits", error);
      res.sendStatus(500);
    });
});

/**
 * POST route to add new habit. First add to the basic habits table, then add to the habit entries table
 */
router.post("/new_habit", async (req, res) => {
  const { habit_name, color_id, shape_id, start_date, end_date } = req.body;
  const all_dates = req.body.all_dates;

  // console.log("in post route, this is alldates", all_dates);

  let queryText = `INSERT INTO "public.habits" ("habit_name", "color_id", "shape_id", "start_date", "end_date", "user_id")
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING "id"`;
  try {
    const results = await pool.query(queryText, [
      habit_name,
      color_id,
      shape_id,
      start_date,
      end_date,
      req.user.id,
    ]);

    for await (const date of all_dates) {
      let newQueryText = `INSERT INTO "public.habit_entries"("habit_id", "date", "was_completed")
    VALUES ($1, $2, $3);`;
      await pool.query(newQueryText, [results.rows[0].id, date, false]);
    }
    res.sendStatus(201);
  } catch (error) {
    console.log("Error making INSERT for habit", error);
    res.sendStatus(500);
  }
});

//PUT Route to mark day as completed
router.put("/completed", (req, res) => {
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
  const queryText = `UPDATE "public.habits"
  SET "is_completed" = $1, "is_tracked"= false
  WHERE "public.habits"."user_id"= $2 AND "id" = $3;`;
  let is_completed = req.body.is_completed;
  let id = req.body.id;

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

  //first pull in old habit info from DB for this specific habit
  const firstQueryCheckText = `SELECT * FROM "public.habits"
    WHERE "public.habits"."user_id"=$1 AND "id"=$2;`;
  pool
    .query(firstQueryCheckText, [req.user.id, habit_id])
    .then((response) => {
      //compare the original start/end date with the new start/end date. If they match then we do not need to edit the entry dates for this habit.
      //just edit the basic info for the habit
      if (
        moment(response.rows[0].start_date).format("YYYY-MM-DD") ===
          moment(start_date).format("YYYY-MM-DD") &&
        moment(response.rows[0].end_date).format("YYYY-MM-DD") ===
          moment(end_date).format("YYYY-MM-DD")
      ) {
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
          .then((response) => {res.sendStatus(201)})
          .catch((err) => {
            console.log("error marking as complete", err);
            res.sendStatus(500);
          });
        //if the dates do not match, we will need to edit entry information for this habit
      } else {
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
          .then(function () {
            //then check if the end date has changed
            if (
              moment(response.rows[0].end_date).format("YYYY-MM-DD") !=
              moment(end_date).format("YYYY-MM-DD")
            ) {
              //if new end date is before the old end date, create dates between the two end dates and remove from DB
              if (
                moment(end_date).isBefore(moment(response.rows[0].end_date))
              ) {
                let datesToBeDeleted = [];
                let currentDate = moment(end_date).add(1, "day");
                let dayAfterCurrentEndDate = moment(
                  response.rows[0].end_date
                ).add(1, "day");
                while (
                  moment(currentDate).isBefore(moment(dayAfterCurrentEndDate))
                ) {
                  datesToBeDeleted.push({
                    date: moment(currentDate).format("YYYY-MM-DD"),
                  });
                  currentDate = moment(currentDate).add(1, "day");
                }
                datesToBeDeleted.map((date) => {
                  //deleting function
                  let newQueryText = `DELETE FROM "public.habit_entries"
              WHERE "habit_id" = $1 AND "date" = $2;`;
                  pool
                    .query(newQueryText, [habit_id, date.date])
                    .then((res) => {
                      //then update the basic info table with new end date
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
                //end of datesToBeDeleted.map
                //if new end date is after the old end date, create dates between the two end dates and add them to the DB
              } else if (
                moment(end_date).isAfter(moment(response.rows[0].end_date))
              ) {
                let datesToAdd = [];
                let currentDate = response.rows[0].end_date;
                let dayAfterNewEndDate = moment(end_date).add(1, "day");

                //creating dates
                while (
                  moment(currentDate).isBefore(moment(dayAfterNewEndDate))
                ) {
                  datesToAdd.push({
                    habit_id: habit_id,
                    date: moment(currentDate).format("YYYY-MM-DD"),
                    was_completed: false,
                  });
                  currentDate = moment(currentDate).add(1, "day");
                }
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
                        .query(updatehabitText, [
                          end_date,
                          req.user.id,
                          habit_id,
                        ])
                        .then()
                        .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));
                });
                //end of datesToAdd.map
              }
              //end of else if new end date is after OG
            }
            //end of if endDate as changed
            //check if the start date has changed
            if (
              moment(response.rows[0].start_date).format("YYYY-MM-DD") !=
              moment(start_date).format("YYYY-MM-DD")
            ) {
              //if new start date is before the old start date, create dates between the two start dates and add those to the DB
              if (
                moment(start_date).isBefore(moment(response.rows[0].start_date))
              ) {
                let datesToAdd = [];
                let currentDate = start_date;
                while (
                  moment(currentDate).isBefore(
                    moment(response.rows[0].start_date)
                  )
                ) {
                  datesToAdd.push({
                    habit_id: habit_id,
                    date: moment(currentDate).format("YYYY-MM-DD"),
                    was_completed: false,
                  });
                  currentDate = moment(currentDate).add(1, "day");
                }
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
                        .query(updatehabitText, [
                          start_date,
                          req.user.id,
                          habit_id,
                        ])
                        .then()
                        .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));
                  //end of pool.query to insert into entries table
                });
                //end of datesToAdd.map
              }
              //end of if new start date is before OG
              else if (
                moment(start_date).isAfter(moment(response.rows[0].start_date))
              ) {
                let datesToBeDeleted = [];
                let currentDate = moment(response.rows[0].start_date);
                let newStartDate = moment(start_date);

                while (moment(currentDate).isBefore(moment(newStartDate))) {
                  datesToBeDeleted.push({
                    date: moment(currentDate).format("YYYY-MM-DD"),
                  });
                  currentDate = moment(currentDate).add(1, "day");
                }
                //delete these dates in the entries table
                datesToBeDeleted.map((date) => {
                  let newQueryText = `DELETE FROM "public.habit_entries"
              WHERE "habit_id" = $1 AND "date" = $2;`;
                  pool
                    .query(newQueryText, [habit_id, date.date])
                    .then( (res) => {
                      //update start date in habits table
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
                //end of datesToBeDeleted.map
              }
              //end of else if the new start date is after the OG
            }
            //end of if start date has changed
            res.sendStatus(201);
          })
          .catch();
      }
    })
    .catch();
  //end of firstQuery
});

//DELETE Route to remove habit from habit table and entries table
router.delete("/delete/:id", (req, res) => {
  const queryText = `DELETE FROM "public.habit_entries"
  WHERE "habit_id" = $1;`;

  const habit_id = req.params.id;

  pool
    .query(queryText, [habit_id])
    .then((response) => {
      const newQueryText = `DELETE FROM "public.habits"
        WHERE "id"= $1;`;

      pool
        .query(newQueryText, [habit_id])
        .then((response) => {})
        .catch((err) => {
          console.log("error deleteing", err);
          res.sendStatus(500);
        });
      res.sendStatus(200);
    })
    .catch((err) => res.sendStatus(500));
});
module.exports = router;
