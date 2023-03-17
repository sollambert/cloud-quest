const express = require('express');
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

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

router.get('/edit/:id', rejectUnauthenticated, (req, res) => {

    const gameQuery = `
    SELECT g.name, g.start_location, g.inventory from games g
    WHERE g.id = $1 AND g.user_id = $2;`

    const roomQuery = `
    SELECT r.* FROM rooms r
    JOIN games g ON g.id = r.game_id
    WHERE g.id = $1 AND g.user_id = $2;`

    const itemRoomsQuery = `
    SELECT ri.id, ri.room_id, ri.item_id FROM items i
    JOIN rooms_items ri ON i.id = ri.item_id
    JOIN rooms r ON r.id = ri.room_id
    JOIN games g on g.id = r.game_id
    WHERE g.id = $1 AND g.user_id = $2;`

    const itemsQuery = `
    SELECT i.id, i.name, i.description FROM items i
    JOIN games g on g.id = i.game_id
    WHERE g.id = $1 AND g.user_id = $2;`

    let gameObject = {}

    pool.query(gameQuery, [req.params.id, req.user.id])
        .then(gameResult => {
            gameObject.gameInfo = gameResult.rows[0];
            pool.query(roomQuery, [req.params.id, req.user.id])
                .then((roomResult) => {
                    // console.log(roomResult.rows);
                    gameObject.rooms = roomResult.rows;
                    pool.query(itemsQuery, [req.params.id, req.user.id])
                        .then((itemsRes) => {
                            gameObject.items = itemsRes.rows;
                            pool.query(itemRoomsQuery, [req.params.id, req.user.id])
                                .then((itemsRoomsRes) => {
                                    gameObject.items.map((item) => {
                                        itemsRoomsRes.rows.map((roomItem) => {
                                            if (roomItem.item_id == item.id) {
                                                // console.log("room id", roomItem.room_id, "item id", item.id)
                                                item.room_id = roomItem.room_id;
                                                return roomItem;
                                            }
                                        })
                                        // console.log(item);
                                        return item;
                                    })
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

router.post('/item', rejectUnauthenticated, (req, res) => {
    const query = `
    INSERT INTO "items" (game_id, name, description)
    VALUES($1, $2, $3)
    RETURNING id;`
    const roomsItemsQuery = `
    INSERT INTO "rooms_items" (room_id, item_id)
    VALUES($1, $2);
    `
    pool.query(query, [req.body.id, req.body.name, req.body.description])
        .then((dbRes) => {
            const newId = dbRes.rows[0].id;
            if (req.body.room_id) {
                pool.query(roomsItemsQuery, [req.body.room_id, newId])
                .then((riRes) => {
                    res.sendStatus(201);
                })
                .catch((err) => {
                    res.sendStatus(500);
                    console.error(err);
                })
            } else {
                res.sendStatus(201);
            }
        })
        .catch((err) => {
            res.sendStatus(500);
            console.error(err);
        })
})

router.delete('/item/:game_id/:item_id', (req, res) => {
    const query = `
    DELETE FROM items
    WHERE id = $1 AND game_id = $2;
    `

    pool.query(query, [req.params.item_id, req.params.game_id])
    .then((dbRes) => {
        res.sendStatus(203);
    })
    .catch((err) => {
        console.error(err);
        res.sendStatus(500);
    })
})

module.exports = router;