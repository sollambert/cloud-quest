const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

router.get('/', rejectUnauthenticated, (req,res) => {
    const queryParams = req.query;
    console.log(queryParams);
    const conditional = `
    ${queryParams.name ?
        `WHERE g.name LIKE '${queryParams.author ? `${queryParams.name}' AND u.username LIKE '${queryParams.author}`
            : queryParams.name}'`
        : queryParams.author ? `WHERE u.username LIKE '${queryParams.author}'` : ''}`;
        console.log(conditional);
    const query = `
    SELECT g.id, g.name, u.username as author FROM games g
    JOIN "user" u ON g.user_id = u.id
    ${conditional}
    ORDER by g.id;`

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

module.exports = router;