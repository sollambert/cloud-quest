const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

router.get('/', rejectUnauthenticated, (req,res) => {
    const query = `
    SELECT g.id, g.name, u.username as author FROM games g
    JOIN "user" u ON g.user_id = u.id
    ORDER by g.id;`

    pool.query(query)
    .then((dbRes) => {
        res.send(dbRes.rows);
    })
    .catch((err) => {
        res.sendStatus(500);
        console.error(err);
    })
})

module.exports = router;