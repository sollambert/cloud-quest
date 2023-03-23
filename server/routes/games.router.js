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

router.get('/', rejectUnauthenticated, async (req, res) => {
    const queryParams = req.query;
    const conditional = `
    ${queryParams.name ?
            `WHERE g.name LIKE '%${queryParams.author ? `${queryParams.name}%' AND u.username LIKE '%${queryParams.author}`
                : queryParams.name}%'`
            : queryParams.author ? `WHERE u.username LIKE '%${queryParams.author}%'` : ''}`;
    const query = `
    SELECT g.id, g.description, g.name, u.username as author FROM games g
    JOIN "user" u ON g.user_id = u.id
    ${conditional}
    ORDER by g.id LIMIT 10;`

    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        let dbRes = await connection.query(query)
        res.send(dbRes.rows);
        await connection.query('COMMIT');
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log(`Transaction Error - Rolling back transfer`, error);
        res.sendStatus(500);
    } finally {
        connection.release();
        res.end();
    }
})

/**
* GET route for getting intial gamestate
*/
router.get('/new/:id', rejectUnauthenticated, async (req, res) => {
    const gQuery = `
        SELECT g.id, g.name, g.start_location, g.inventory from games g
        WHERE g.id = $1;`
    const iQuery = `
        SELECT i.* from items i
        JOIN games g on g.id = i.game_id
        WHERE g.id = $1;`
    const rQuery = `
        SELECT r.* FROM rooms r
        JOIN games g ON g.id = r.game_id
        WHERE g.id = $1
        ORDER BY r.id;`
    const riQuery = `
        SELECT i.name, i.description, ri.room_id, i.id FROM items i
        JOIN rooms_items ri ON i.id = ri.item_id
        JOIN rooms r ON r.id = ri.room_id
        JOIN games g ON g.id = r.game_id
        WHERE g.id = $1;`

    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const gameResponse = await connection.query(gQuery, [req.params.id])
        const itemResponse = await connection.query(iQuery, [req.params.id]);
        const roomResponse = await connection.query(rQuery, [req.params.id])
        for (let index in roomResponse.rows) {
            roomResponse.rows[index].items = [];
        }
        const riResponse = await connection.query(riQuery, [req.params.id])
        for (item of riResponse.rows) {
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
            items: itemResponse.rows,
            rooms: roomResponse.rows
        };
        res.send(newGameState);
        await connection.query('COMMIT');
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log(`Transaction Error - Rolling back transfer`, error);
        res.sendStatus(500);
    } finally {
        connection.release();
        res.end();
    }
});

module.exports = router;