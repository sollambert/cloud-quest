const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
  // GET route code here
});

/**
* GET route template
*/
router.get('/new', (req, res) => {
    const roomQuery = `
    SELECT * FROM rooms;
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

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
