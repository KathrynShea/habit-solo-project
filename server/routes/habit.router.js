const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

/**
 * GET route template
 */
router.get("/", (req, res) => {
  //console.log("in habit GET request router");
  // GET route code here
  let user_id = req.user.id;
  let queryText = `SELECT "public.habit_entries"."id" AS "entry_id", "habit_id","user_id", "date", "was_completed", "habit_name", "color_id", "shape_id", "start_date","end_date", "is_tracked", "is_completed" FROM "public.habit_entries"
  FULL JOIN "public.habits" ON "public.habits"."id" = "habit_id"
  WHERE "public.habits"."user_id"=$1
  ORDER BY "habit_id";`;

  pool
    .query(queryText, [user_id])
    .then((results) => {
      console.log("this is results.rows", results.rows);
      res.send(results.rows)})
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
  console.log("this is habit_name", habit_name);
  console.log("this is all_dates", all_dates);
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


//PUT Route to mark as completed
router.put('/completed', (req, res) => {
    //console.log("In router for completed");
    const queryText = 
    `UPDATE "public.habit_entries"
        SET "was_completed" = TRUE
        WHERE "public.habit_entries"."id" = $1;`;
    let entry_id = req.body.entry_id;

    pool.query( queryText, [entry_id])
      .then((response) => res.sendStatus(201))
      .catch((err) =>{
        console.log("error marking as complete", err);
        res.sendStatus(500)
      });
});

//PUT Route to update after edits
router.put('/edit', (req, res) => {
    console.log("In router for habit edits");

    const queryText = `UPDATE "public.habits"
    SET "habit_name" = $1, "color_id" = $2, "shape_id" = $3, "start_date" = $4, "end_date" = $5, "is_tracked" = $6, "is_completed" = $7
    WHERE "user_id" = $8 AND "id" = $9;`;

    const { habit_name, color_id, shape_id, start_date, end_date, is_tracked, is_completed, habit_id } = req.body;
    const all_dates = req.body.all_dates;

    pool.query( queryText, [habit_name, color_id, shape_id, start_date, end_date, is_tracked, is_completed, req.user.id, habit_id])
      .then((response) => {
        res.sendStatus(200);
        // // update the habit entries table
        // //delete all old entries
        // //add in new updated entries
        // const newQueryText = ``;
        // pool.query( newQueryText, [all_dates]).then((res)).catch((err));
      })
      .catch((err) =>{
        console.log("error marking as complete", err);
        res.sendStatus(500)
      });
});
  

//DELETE Route
router.delete('/delete', (req, res) => {
  //console.log("in router to delete habits");
  const queryText = `DELETE FROM "public.habit_entries"
  WHERE "habit_id" = $1;`

  const habit_id = req.body.habit_id

  pool.query(queryText, [habit_id])
    .then((response) => {
      console.log("first delete worked, now in second delete");
        const newQueryText = `DELETE FROM "public.habits"
        WHERE "id"= $1;`;

        pool.query(newQueryText, [habit_id]).then((response) => {
          console.log("both deletes worked!")
          res.sendStatus(200)
        }).catch((err) => {
          console.log("error deleteing", err);
          res.sendStatus(500)
        });
    }
    )
    .catch((err) => res.sendStatus(500))
});
module.exports = router;
