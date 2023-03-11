const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route for save by id
 */
router.get('/:id', (req, res) => {
  const query = `
  SELECT save FROM saves
  WHERE user_id = $1 AND id = $2;
  `

  pool.query(query)
    .then((dbRes) => {
      res.send(dbRes[0]);
    })
    .catch((err) => {
      res.sendStatus(500);
    })
});

/**
* GET route for getting intial gamestate
*/
router.get('/new', (req, res) => {
  const roomQuery = `
    SELECT * FROM rooms
    ORDER BY id;
    `
  pool.query(roomQuery)
    .then((dbRes) => {
      const newGameState = {
        electricity: false,
        location: "car",
        inventory: [],
        rooms: dbRes.rows
      };
      res.send(newGameState);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    })
});

//get the save data for display on client
router.get('/data', (req, res) => {
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
router.post('/', (req, res) => {
  const save = req.body;
  const timestamp = Date.now();

  const query = `
  INSERT INTO saves (save, user_id, timestamp)
  VALUES($1, $2, $3);
  `

  pool.query(query, [save, req.user.id, timestamp]);
});

/**
 * Route for deleting save by ID
 */
router.delete('/:id', (req, res) => {
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
