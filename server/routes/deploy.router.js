const express = require('express');
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();
const forbidden = new Error('User does not have ownership of game');
forbidden.code = 403;

router.get('/', rejectUnauthenticated, async (req, res) => {
    res.send({url: 'https://sleepy-inlet-11604.herokuapp.com/'});
})

module.exports = router;