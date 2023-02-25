const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
var moment = require("moment");

//GET all entries for all habits
router.get("/:start_date/:length", (req, res) => {
  const start_date = req.params.start_date;
  const length = req.params.length;
  let endDate = moment(start_date).endOf('month').format('YYYY-MM-DD');
  
  //console.log("in habit GET request router");
  let user_id = req.user.id;
  let queryText = `SELECT "public.habit_entries"."id" AS "entry_id", "habit_id","user_id", "date", "was_completed", "habit_name", "color_id", "shape_id", "start_date","end_date", "is_tracked", "is_completed" FROM "public.habit_entries"
  FULL JOIN "public.habits" ON "public.habits"."id" = "habit_id"
  WHERE "public.habits"."user_id"=$1 and "is_tracked" = true and "date"
  BETWEEN $2 AND $3
  ORDER BY "habit_id"
  ;`
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
 * POST route template
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

//PUT Route to mark as day as completed
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

//PUT Route to mark as habit as finished
router.put("/finished", (req, res) => {
  console.log("In router for finished");
  const queryText = `UPDATE "public.habits"
  SET "is_completed" = $1, "is_tracked"= false
  WHERE "public.habits"."user_id"= $2 AND "id" = $3;`;
  let is_completed = req.body.is_completed;
  let id = req.body.id;
  console.log("this is is_completed and id".is_completed, id);

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
  console.log("In router for habit edits this is the req.body", req.body);

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
  pool.query(firstQueryCheckText, [req.user.id, habit_id]).then((response) => {
    console.log("this is the response.rows", response.rows);
    if (
      moment(response.rows[0].start_date).format("YYYY-MM-DD") ===
        moment(start_date).format("YYYY-MM-DD") &&
      moment(response.rows[0].end_date).format("YYYY-MM-DD") ===
        moment(end_date).format("YYYY-MM-DD")
    ) {
      console.log("go ahead without updating dates");
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
    } else if (
      moment(response.rows[0].start_date).format("YYYY-MM-DD") ===
        moment(start_date).format("YYYY-MM-DD") &&
      moment(response.rows[0].end_date).format("YYYY-MM-DD") !=
        moment(end_date).format("YYYY-MM-DD")
    ) {
      console.log("you need to update the end date");
      // {
          
      //   // update the habit entries table
      //   for (let i = moment(start_date); i <= moment(end_date); i++) {}
      //   //add in new updated entries
      //   const newQueryText = ``;
      //   pool.query(newQueryText, [all_dates]).then(res).catch(err);
      // }
    } else if (
      moment(response.rows[0].start_date).format("YYYY-MM-DD") !=
        moment(start_date).format("YYYY-MM-DD") &&
      moment(response.rows[0].end_date).format("YYYY-MM-DD") ===
        moment(end_date).format("YYYY-MM-DD")
    ) {
      console.log("you need to update the start date");
    }
    res.sendStatus(201);
  });
  
});

//DELETE Route to remove habit from habit table and entries table
router.delete("/delete/:id", (req, res) => {
  console.log("in router to delete habits");
  const queryText = `DELETE FROM "public.habit_entries"
  WHERE "habit_id" = $1;`;
  console.log("this is req.body", req.body);

  const habit_id = req.params.id;
  console.log("this is the habit_id", habit_id);

  pool
    .query(queryText, [habit_id])
    .then((response) => {
      console.log("first delete worked, now in second delete");
      const newQueryText = `DELETE FROM "public.habits"
        WHERE "id"= $1;`;

      pool
        .query(newQueryText, [habit_id])
        .then((response) => {
          console.log("both deletes worked!");
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
