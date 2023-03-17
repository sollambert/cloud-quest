const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

/**
 * GET route for save by id
 */
router.get('/load/:game_id/:id', rejectUnauthenticated, (req, res) => {
  const query = `
  SELECT save FROM saves s
  JOIN games g ON g.id = s.game_id
  WHERE s.user_id = $1 AND s.id = $2 AND g.id = $3;
  `

  pool.query(query, [req.user.id, req.params.id, req.params.game_id])
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
router.get('/new/:id', rejectUnauthenticated, (req, res) => {
  const gameQuery = `
  SELECT g.id, g.name, g.start_location, g.inventory from games g
  WHERE g.id = $1;`

  const roomQuery = `
    SELECT r.* FROM rooms r
    JOIN games g ON g.id = r.game_id
    WHERE g.id = $1
    ORDER BY r.id;
    `;
  const itemQuery = `
    SELECT i.name, i.description, ri.room_id, r.id FROM items i
    JOIN rooms_items ri ON i.id = ri.item_id
    JOIN rooms r ON r.id = ri.room_id
    JOIN games g ON g.id = r.game_id
    WHERE g.id = $1;
    `

  pool.query(gameQuery, [req.params.id])
    .then((gameResponse) => {
      pool.query(roomQuery, [req.params.id])
        .then((roomResponse) => {
          for (let index in roomResponse.rows) {
            roomResponse.rows[index].items = [];
          }
          pool.query(itemQuery, [req.params.id])
            .then((itemResponse) => {
              for (item of itemResponse.rows) {
                roomResponse.rows.map((room) => {
                  if (room.id == item.room_id) {
                    room.items.push(item);
                    return room;
                  }
                });
              }
              let gameInfo = gameResponse.rows[0]
              const newGameState = {
                game_id: gameInfo.id,
                location: gameInfo.start_location,
                inventory: gameInfo.inventory,
                rooms: roomResponse.rows
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
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    })
});

//get the save data for display on client
router.get('/data/:game_id', rejectUnauthenticated, (req, res) => {
  const roomQuery = `
    SELECT s.id, timestamp FROM saves s
    JOIN games g ON g.id = s.game_id
    WHERE s.user_id = $1 AND g.id = $2
    ORDER BY s.id;
    `
  pool.query(roomQuery, [req.user.id, req.params.game_id])
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
router.post('/:game_id', rejectUnauthenticated, (req, res) => {
  const save = req.body;
  const timestamp = Date.now() / 1000;

  const query = `
  INSERT INTO saves (save, user_id, timestamp, game_id)
  VALUES($1, $2, to_timestamp($3), $4);
  `

  pool.query(query, [save, req.user.id, timestamp, req.params.game_id])
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
router.put('/:game_id/:id', rejectUnauthenticated, (req, res) => {
  const save = req.body;
  const timestamp = Date.now() / 1000;

  const query = `
  UPDATE saves
  SET save = $1, timestamp = to_timestamp($2)
  WHERE id = $3 AND user_id = $4 AND game_id = $5;
  `

  pool.query(query, [save, timestamp, req.params.id, req.user.id, req.params.game_id])
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
router.delete('/:game_id/:id', rejectUnauthenticated, (req, res) => {
  const query = `
  DELETE FROM saves
  WHERE user_id = $1 AND id = $2 AND game_id = $3;
  `
  pool.query(query, [req.user.id, req.params.id, req.params.game_id])
    .then((dbRes) => {
      res.sendStatus(203);
    })
    .catch((err) => {
      res.sendStatus(500);
    })
})

module.exports = router;
