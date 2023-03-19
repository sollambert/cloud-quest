const express = require('express');
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();
const forbidden = new Error('User does not have ownership of game');
forbidden.code = 403;


const ownershipQuery = `
SELECT g.name FROM games g
WHERE g.id = $1 AND g.user_id = $2;`;

const roomOwnershipQuery = `
SELECT * FROM games g
JOIN rooms r ON r.game_id = g.id
WHERE g.id = $1 AND r.game_id = $1 AND r.id = $2 AND g.user_id = $3;`;

router.post('/create', rejectUnauthenticated, async (req, res) => {

    const newGame = `INSERT INTO games ("name", "start_location","user_id","inventory")
        VALUES ('new-game', '', $1, '[]')
        RETURNING id;`

    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const gRes = await connection.query(newGame, [req.user.id]);
        await connection.query('COMMIT');
        res.send(gRes.rows[0]);
    } catch (error) {
        if (error.code == 403) {
            res.sendStatus(403)
        } else {
            await connection.query('ROLLBACK');
            console.log(`Transaction Error - Rolling back transfer`, error);
            res.sendStatus(500);
        }
    } finally {
        connection.release();
        res.end();
    }

})

router.get('/:id', rejectUnauthenticated, async (req, res) => {

    const gameQuery = `
    SELECT g.id, g.name, g.start_location, g.inventory from games g
    WHERE g.id = $1 AND g.user_id = $2;`

    const roomQuery = `
    SELECT r.* FROM rooms r
    JOIN games g ON g.id = r.game_id
    WHERE g.id = $1 AND g.user_id = $2
    ORDER BY r.id;`

    const itemRoomsQuery = `
    SELECT ri.id, ri.room_id, ri.item_id FROM items i
    JOIN rooms_items ri ON i.id = ri.item_id
    JOIN rooms r ON r.id = ri.room_id
    JOIN games g on g.id = r.game_id
    WHERE g.id = $1 AND g.user_id = $2;`

    const itemsQuery = `
    SELECT i.id, i.name, i.description FROM items i
    JOIN games g on g.id = i.game_id
    WHERE g.id = $1 AND g.user_id = $2
    ORDER BY i.id;`

    const connection = await pool.connect();

    try {
        await connection.query('BEGIN');

        let gameObject = {}
        const gameRes = await connection.query(gameQuery, [req.params.id, req.user.id])
        gameObject.gameInfo = gameRes.rows[0];
        const roomRes = await connection.query(roomQuery, [req.params.id, req.user.id])
        gameObject.rooms = roomRes.rows;
        const itemRes = await connection.query(itemsQuery, [req.params.id, req.user.id])
        gameObject.items = itemRes.rows;
        const itemRoomsRes = await connection.query(itemRoomsQuery, [req.params.id, req.user.id])
        gameObject.items.map((item) => {
            itemRoomsRes.rows.map((roomItem) => {
                if (roomItem.item_id == item.id) {
                    item.room_id = roomItem.room_id;
                    return roomItem;
                }
            })
            return item;
        })
        await connection.query('COMMIT');
        res.send(gameObject);
    } catch (error) {
        if (error.code == 403) {
            res.sendStatus(403)
        } else {
            await connection.query('ROLLBACK');
            console.log(`Transaction Error - Rolling back transfer`, error);
            res.sendStatus(500);
        }
    } finally {
        connection.release();
        res.end();
    }
})

router.put('/info/:game_id', rejectUnauthenticated, async (req, res) => {

    const updateQuery = `
    UPDATE games
    SET name = $1, start_location = $2, inventory = $3
    WHERE user_id = $4 AND id = $5;`

    const connection = await pool.connect();

    try {
        await connection.query('BEGIN');
        const ownership = await connection.query(ownershipQuery, [req.params.game_id, req.user.id]);
        if (ownership.rows == 0) {
            throw forbidden;
        } else {
            await connection.query(updateQuery, [req.body.name, req.body.start_location, `[${req.body.inventory}]`, req.user.id, req.params.game_id]);
        }
        await connection.query('COMMIT');
        res.sendStatus(201);
    } catch (error) {
        if (error.code == 403) {
            res.sendStatus(403)
        } else {
            await connection.query('ROLLBACK');
            console.log(`Transaction Error - Rolling back transfer`, error);
            res.sendStatus(500);
        }
    } finally {
        connection.release();
        res.end();
    }
})

router.post('/item/:game_id', rejectUnauthenticated, async (req, res) => {
    const itemQuery = `
    INSERT INTO "items" (game_id, name, description)
    VALUES($1, $2, $3)
    RETURNING id;`

    const roomsItemsQuery = `
    INSERT INTO "rooms_items" (room_id, item_id)
    VALUES($1, $2);`

    const connection = await pool.connect();

    try {
        await connection.query('BEGIN');
        const ownerRes = await connection.query(ownershipQuery,
            [req.params.game_id, req.user.id])
        if (ownerRes.rows.length == 0) {
            throw forbidden;
        }
        if (req.body.room_id) {
            let roomOwnerRes = await connection.query(roomOwnershipQuery,
                [req.params.game_id, req.body.room_id, req.user.id]);
            if (roomOwnerRes.rows.length == 0) {
                throw forbidden;
            } else {
                const itemRes = await connection.query(itemQuery,
                    [req.params.game_id, req.body.name, req.body.description]);
                const newId = itemRes.rows[0].id
                await connection.query(roomsItemsQuery, [req.body.room_id, newId]);
            }
        } else {
            await connection.query(itemQuery,
                [req.params.game_id, req.body.name, req.body.description]);
        }
        await connection.query('COMMIT');
        res.sendStatus(201);
    } catch (error) {
        if (error.code == 403) {
            res.sendStatus(403)
        } else {
            await connection.query('ROLLBACK');
            console.log(`Transaction Error - Rolling back transfer`, error);
            res.sendStatus(500);
        }
    } finally {
        connection.release();
        res.end();
    }
})

router.put('/item/:game_id/:item_id', async (req, res) => {
    const ownershipQuery = `
    SELECT * FROM games g
    JOIN items i on i.game_id = g.id
    WHERE g.id = $1 AND i.game_id = $1 AND i.id = $2 AND g.user_id = $3;`

    const updateQuery = `
    UPDATE items
    SET name = $1, description = $2
    WHERE id = $3;
    `
    const checkRoomsItemsQuery = `
    SELECT ri.id FROM rooms_items ri
    JOIN items i ON i.id = ri.item_id
    WHERE ri.item_id = $1;`

    const roomsItemsQuery = `
    INSERT INTO "rooms_items" (room_id, item_id)
    VALUES($1, $2);`

    const roomsItemsUpdateQuery = `
    UPDATE rooms_items
    SET room_id = $1, item_id = $2
    WHERE id = $3;`

    const deleteRIQuery = `
    DELETE FROM rooms_items
    WHERE item_id = $1;`

    const connection = await pool.connect();
    try {
        await connection.query('BEGIN')
        const ownership = await connection.query(ownershipQuery, [req.params.game_id, req.params.item_id, req.user.id]);
        if (ownership.rows.length == 0) {
            throw (forbidden);
        }
        await connection.query(updateQuery, [req.body.name, req.body.description, req.params.item_id])
        if (req.body.room_id) {
            const roomOwnership = await connection.query(roomOwnershipQuery, [req.params.game_id, req.body.room_id, req.user.id]);
            if (roomOwnership.rows.length == 0) {
                throw (forbidden);
            }
            const riResult = await connection.query(checkRoomsItemsQuery, [req.params.item_id])
            if (riResult.rows.length == 0) {
                await connection.query(roomsItemsQuery, [req.body.room_id, req.params.item_id])
            } else {
                await connection.query(roomsItemsUpdateQuery,
                    [
                        req.body.room_id,
                        req.params.item_id,
                        riResult.rows[0].id
                    ])
            }
        } else {
            const riResult = await connection.query(checkRoomsItemsQuery, [req.params.item_id])
            if (riResult.rows.length != 0) {
                await connection.query(deleteRIQuery, [req.params.item_id]);
            }
        }
        await connection.query('COMMIT');
        res.sendStatus(203);
    } catch (error) {
        if (error.code == 403) {
            res.sendStatus(403)
        } else {
            await connection.query('ROLLBACK');
            console.log(`Transaction Error - Rolling back transfer`, error);
            res.sendStatus(500);
        }
    } finally {
        connection.release();
        res.end();
    }
})

router.delete('/item/:game_id/:item_id', async (req, res) => {
    const ownershipQuery = `
    SELECT * FROM games g
    JOIN items i on i.game_id = g.id
    WHERE g.id = $1 AND i.game_id = $1 AND i.id = $2 AND g.user_id = $3;`

    const deleteQuery = `
    DELETE FROM items i
    WHERE id = $1;
    `

    const connection = await pool.connect();
    try {
        await connection.query('BEGIN')
        const ownership = await connection.query(ownershipQuery, [req.params.game_id, req.params.item_id, req.user.id]);
        if (ownership.rows.length == 0) {
            throw (forbidden);
        }
        await connection.query(deleteQuery, [req.params.item_id])
        await connection.query('COMMIT');
        res.sendStatus(203);
    } catch (error) {
        if (error.code == 403) {
            res.sendStatus(403)
        } else {
            await connection.query('ROLLBACK');
            console.log(`Transaction Error - Rolling back transfer`, error);
            res.sendStatus(500);
        }
    } finally {
        connection.release();
        res.end();
    }
})

router.post('/room', async (req, res) => {
    const insertQuery = `
    INSERT INTO rooms (game_id, name, image, description, exits, interactables)
    VALUES($1, $2, $3, $4, $5, $6);`

    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const ownership = await connection.query(ownershipQuery, [req.body.game_id, req.user.id]);

        if (ownership.rows.length == 0) {
            throw forbidden;
        } else {
            await connection.query(insertQuery,
                [
                    req.body.game_id,
                    req.body.name,
                    req.body.image,
                    req.body.description,
                    JSON.stringify(req.body.exits),
                    JSON.stringify(req.body.interactables)
                ])
        }
        await connection.query('COMMIT');
        res.sendStatus(201);
    } catch (error) {
        if (error.code == 403) {
            res.sendStatus(403)
        } else {
            await connection.query('ROLLBACK');
            console.log(`Transaction Error - Rolling back transfer`, error);
            res.sendStatus(500);
        }
    } finally {
        connection.release();
        res.end();
    }
})

router.put('/room/:roomId', async (req, res) => {
    const updateQuery = `
    UPDATE rooms
    SET game_id = $1, name = $2, image = $3, description = $4, exits = $5, interactables = $6
    WHERE id = $7;`;

    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const roomOwnership = await connection.query(roomOwnershipQuery,
            [req.body.game_id, req.body.id, req.user.id]);
        if (roomOwnership.rows.length == 0) {
            throw forbidden;
        } else {
            await connection.query(updateQuery,
                [
                    req.body.game_id,
                    req.body.name,
                    req.body.image,
                    req.body.description,
                    JSON.stringify(req.body.exits),
                    JSON.stringify(req.body.interactables),
                    req.body.id
                ])
        }
        await connection.query('COMMIT');
        res.sendStatus(201);
    } catch (error) {
        if (error.code == 403) {
            res.sendStatus(403)
        } else {
            await connection.query('ROLLBACK');
            console.log(`Transaction Error - Rolling back transfer`, error);
            res.sendStatus(500);
        }
    } finally {
        connection.release();
        res.end();
    }
})

router.delete('/room/:game_id/:room_id', async (req, res) => {
    const ownershipQuery = `
    SELECT * FROM games g
    JOIN rooms r on r.game_id = g.id
    WHERE g.id = $1 AND r.game_id = $1 AND r.id = $2 AND g.user_id = $3;`

    const deleteQuery = `
    DELETE FROM rooms r
    WHERE id = $1;
    `

    const connection = await pool.connect();
    try {
        await connection.query('BEGIN')
        const ownership = await connection.query(ownershipQuery, [req.params.game_id, req.params.room_id, req.user.id]);
        if (ownership.rows.length == 0) {
            throw (forbidden);
        }
        await connection.query(deleteQuery, [req.params.room_id])
        await connection.query('COMMIT');
        res.sendStatus(203);
    } catch (error) {
        if (error.code == 403) {
            res.sendStatus(403)
        } else {
            await connection.query('ROLLBACK');
            console.log(`Transaction Error - Rolling back transfer`, error);
            res.sendStatus(500);
        }
    } finally {
        connection.release();
        res.end();
    }
})

module.exports = router;