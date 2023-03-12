const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

/**
 * GET route for save by id
 */
router.get('/load/:id', rejectUnauthenticated, (req, res) => {
  const query = `
  SELECT save FROM saves
  WHERE user_id = $1 AND id = $2;
  `

  pool.query(query, [req.user.id, req.params.id])
    .then((dbRes) => {
      res.send(dbRes.rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    })
});

/**
* GET route for getting intial gamestate
*/
router.get('/new', rejectUnauthenticated, (req, res) => {
  const roomQuery = `
    SELECT * FROM rooms
    ORDER BY id;
    `
  pool.query(roomQuery)
    .then((dbRes) => {
      for (let index in dbRes.rows) {
        dbRes.rows[index].items = [];
      }
      const itemQuery = `
      SELECT i.item_name, i.item_description, i.item_interactions, ri.room_id FROM items i
      JOIN rooms_items ri ON i.id = ri.item_id
      JOIN rooms r ON r.id = ri.room_id;
      `

      pool.query(itemQuery)
      .then((itemRes) => {
        for (item of itemRes.rows) {
            dbRes.rows[item.room_id - 1].items = [...dbRes.rows[item.room_id - 1].items, item];
            // console.log(dbRes.rows[item.room_id - 1]);
        }
        const newGameState = {
          electricity: false,
          house_locked: true,
          location: "car",
          inventory: [
            // {
            //   item_name: "key",
            //   item_description: "Maybe this will get me in the front door.",
            //   item_interactions: "front door"
            // }
          ],
          rooms: dbRes.rows
        };
        res.send(newGameState);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      })
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    })
});

//get the save data for display on client
router.get('/data', rejectUnauthenticated, (req, res) => {
  const roomQuery = `
    SELECT id, timestamp FROM saves
    WHERE user_id = $1
    ORDER BY id;
    `
  pool.query(roomQuery, [req.user.id])
    .then((dbRes) => {
      res.send(dbRes.rows);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    })
});

/**
 * POST route for adding a new save to database
 */
router.post('/', rejectUnauthenticated, (req, res) => {
  const save = req.body;
  const timestamp = Date.now() / 1000;

  const query = `
  INSERT INTO saves (save, user_id, timestamp)
  VALUES($1, $2, to_timestamp($3));
  `

  pool.query(query, [save, req.user.id, timestamp])
  .then((dbRes) => {
    res.sendStatus(201);
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

/**
 * PUT route for replacing a save on database
 */
router.put('/:id', rejectUnauthenticated, (req, res) => {
  const save = req.body;
  const timestamp = Date.now() / 1000;

  const query = `
  UPDATE saves
  SET save = $1, timestamp = to_timestamp($2)
  WHERE id = $3 AND user_id = $4;
  `

  pool.query(query, [save, timestamp, req.params.id, req.user.id])
  .then((dbRes) => {
    res.sendStatus(201);
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

/**
 * Route for deleting save by ID
 */
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  const query = `
  DELETE FROM saves
  WHERE user_id = $1 AND id = $2;
  `
  pool.query(query, [req.user.id, req.params.id])
  .then((dbRes) => {
    res.sendStatus(203);
  })
  .catch((err) => {
    res.sendStatus(500);
  })
})

module.exports = router;
