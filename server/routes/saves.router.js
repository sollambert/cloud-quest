const express = require('express');
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

/**
 * GET route for save by id
 */
router.get('/load/:game_id/:id', rejectUnauthenticated, async (req, res) => {
    const query = `
    SELECT save FROM saves s
    JOIN games g ON g.id = s.game_id
    WHERE s.user_id = $1 AND s.id = $2 AND g.id = $3;
    `

    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        let dbRes = await connection.query(query, [req.user.id, req.params.id, req.params.game_id])
        res.send(dbRes.rows);
        await connection.query('COMMIT');
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log(`Transaction Error - Rolling back transfer`, error);
        res.sendStatus(500);
    } finally {
        connection.release;
        res.end();
    }
});

//get the save data for display on client
router.get('/data/:game_id', rejectUnauthenticated, async (req, res) => {
  const roomQuery = `
    SELECT s.id, timestamp FROM saves s
    JOIN games g ON g.id = s.game_id
    WHERE s.user_id = $1 AND g.id = $2
    ORDER BY s.id;
    `

    const connection = await pool.connect();
    try {
      await connection.query('BEGIN');
      let dbRes = await connection.query(roomQuery, [req.user.id, req.params.game_id])
      res.send(dbRes.rows);
      await connection.query('COMMIT');
    } catch (error) {
      await connection.query('ROLLBACK');
      console.log(`Transaction Error - Rolling back transfer`, error);
      res.sendStatus(500);
    } finally {
      connection.release;
      res.end();
    }
});

/**
 * POST route for adding a new save to database
 */
router.post('/:game_id', rejectUnauthenticated, async (req, res) => {
  const save = req.body;
  const timestamp = Date.now() / 1000;

  const query = `
  INSERT INTO saves (save, user_id, timestamp, game_id)
  VALUES($1, $2, to_timestamp($3), $4);
  `

  const connection = await pool.connect();
  try {
    await connection.query('BEGIN');
    await connection.query(query, [save, req.user.id, timestamp, req.params.game_id])
    await connection.query('COMMIT');
    res.sendStatus(201);
  } catch (error) {
    await connection.query('ROLLBACK');
    console.log(`Transaction Error - Rolling back transfer`, error);
    res.sendStatus(500);
  } finally {
    connection.release;
    res.end();
  }
});

/**
 * PUT route for replacing a save on database
 */
router.put('/:game_id/:id', rejectUnauthenticated, async (req, res) => {
  const save = req.body;
  const timestamp = Date.now() / 1000;

  const query = `
  UPDATE saves
  SET save = $1, timestamp = to_timestamp($2)
  WHERE id = $3 AND user_id = $4 AND game_id = $5;
  `

  const connection = await pool.connect();
  try {
    await connection.query('BEGIN');
    await connection.query(query, [save, timestamp, req.params.id, req.user.id, req.params.game_id])
    await connection.query('COMMIT');
    res.sendStatus(201);
  } catch (error) {
    await connection.query('ROLLBACK');
    console.log(`Transaction Error - Rolling back transfer`, error);
    res.sendStatus(500);
  } finally {
    connection.release;
    res.end();
  }
});

/**
 * Route for deleting save by ID
 */
router.delete('/:game_id/:id', rejectUnauthenticated, async (req, res) => {
  const query = `
  DELETE FROM saves
  WHERE user_id = $1 AND id = $2 AND game_id = $3;
  `

  const connection = await pool.connect();
  try {
    await connection.query('BEGIN');
    await connection.query(query, [req.user.id, req.params.id, req.params.game_id])
    await connection.query('COMMIT');
    res.sendStatus(203);
  } catch (error) {
    await connection.query('ROLLBACK');
    console.log(`Transaction Error - Rolling back transfer`, error);
    res.sendStatus(500);
  } finally {
    connection.release;
    res.end();
  }
})

module.exports = router;
