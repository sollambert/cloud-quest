const express = require('express');
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();
const editorRouter = require('./editor.router');
const forbidden = new Error('User does not have ownership of game');
forbidden.code = 403;

router.use('/editor', editorRouter);

router.get('/', rejectUnauthenticated, (req, res) => {
    const queryParams = req.query;
    const conditional = `
    ${queryParams.name ?
            `WHERE g.name LIKE '%${queryParams.author ? `${queryParams.name}%' AND u.username LIKE '%${queryParams.author}`
                : queryParams.name}%'`
            : queryParams.author ? `WHERE u.username LIKE '%${queryParams.author}%'` : ''}`;
    const query = `
    SELECT g.id, g.name, u.username as author FROM games g
    JOIN "user" u ON g.user_id = u.id
    ${conditional}
    ORDER by g.id LIMIT 10;`

    pool.query(query)
        .then((dbRes) => {
            res.send(dbRes.rows);
        })
        .catch((err) => {
            res.sendStatus(500);
            console.error(err);
        })
})

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
        ORDER BY r.id;`
    const itemQuery = `
        SELECT i.name, i.description, ri.room_id, r.id FROM items i
        JOIN rooms_items ri ON i.id = ri.item_id
        JOIN rooms r ON r.id = ri.room_id
        JOIN games g ON g.id = r.game_id
        WHERE g.id = $1;`

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

module.exports = router;