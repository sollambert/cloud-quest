const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

router.get('/', rejectUnauthenticated, (req,res) => {
    const queryParams = req.query;
    // console.log(queryParams);
    const conditional = `
    ${queryParams.name ?
        `WHERE g.name LIKE '%${queryParams.author ? `${queryParams.name}%' AND u.username LIKE '%${queryParams.author}`
            : queryParams.name}%'`
        : queryParams.author ? `WHERE u.username LIKE '%${queryParams.author}%'` : ''}`;
        // console.log(conditional);
    const query = `
    SELECT g.id, g.name, u.username as author FROM games g
    JOIN "user" u ON g.user_id = u.id
    ${conditional}
    ORDER by g.id LIMIT 10;`

    // console.log(query);

    pool.query(query)
    .then((dbRes) => {
        // console.log(dbRes.rows);
        res.send(dbRes.rows);
    })
    .catch((err) => {
        res.sendStatus(500);
        console.error(err);
    })
})

router.get('/edit/:id', rejectUnauthenticated, (req,res) => {

    const roomQuery = `
    SELECT r.* FROM rooms r
    JOIN games g ON g.id = r.game_id
    WHERE g.id = $1 AND g.user_id = $2;`

    const itemQuery = `
    SELECT i.id, i.name, i.description,
    ri.id, ri.room_id, ri.item_id FROM items i
    JOIN rooms_items ri ON i.id = ri.item_id
    JOIN rooms r ON r.id = ri.room_id
    JOIN games g on g.id = r.game_id
    WHERE g.id = $1 AND g.user_id = $2;`

    let gameObject = {}

    pool.query(roomQuery, [req.params.id, req.user.id])
    .then((roomResult) => {
        // console.log(roomResult.rows);
        gameObject.rooms = roomResult.rows;
        pool.query(itemQuery, [req.params.id, req.user.id])
        .then((itemResult) => {
            gameObject.items = itemResult.rows;
            res.send(gameObject);
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
})

module.exports = router;