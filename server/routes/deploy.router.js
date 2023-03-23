const express = require('express');
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();
const forbidden = new Error('User does not have ownership of game');
forbidden.code = 403;

router.post('/deploy', rejectUnauthenticated, async (req, res) => {

})

module.exports = router;