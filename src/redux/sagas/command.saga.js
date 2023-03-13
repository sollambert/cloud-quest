import { select, put, takeLatest } from 'redux-saga/effects';
import ignored from '../../modules/ignored';

const gameStateSelector = (state) => state.gameState;
let gameState;

function* useCommand(action) {
    gameState = yield select(gameStateSelector);
    // console.log(gameState);
    const response = yield parseCommand(action.payload);
    // console.log(response);
    yield put({ type: 'ADD_HISTORY', payload: action.payload })
    yield put({ type: 'ADD_HISTORY', payload: response.result })
    yield put({ type: 'ADD_HISTORY', payload: response.message })
    if (response.callback) { yield response.callback() }
}

function* parseCommand(message) {
    const room = gameState.rooms.filter((room) => {
        if (room.room_name == gameState.location) {
            return room
        }
    })[0];
    // console.log(room);
    message = message.toLowerCase();
    let split = message.split(' ').filter(
        (element) => {
            if (!ignored.includes(element)) { return element }
        });
    let response = {};
    switch (split[0]) {
        case 'go':
            response.type = "GO";
            if (split[2]) {
                split[1] = `${split[1]} ${split[2]}`;
            }
            if (!split[1]) {
                response.result = `Go where?`
                return response;
            } if (room.room_name == split[1]) {
                response.result = `You are already there.`
                return response;
            } if (room.room_exits.exits.includes(split[1])) {
                response.result = `You go to the ${split[1]}.`
                response.callback = () => put({
                    type: "UPDATE_LOCATION",
                    payload: gameState.rooms.filter((room) => {
                        if (room.room_name == split[1]) {
                            return room
                        }
                    })[0]
                })
                return response;
            } else {
                response.result = `You don't know how to get there.`
                return response;
            }
        case 'open':
            response.type = "OPEN";
            if (!split[1]) {
                response.result = `Open what?`
                return response;
            }
            if (split[2]) {
                split[1] = `${split[1]} ${split[2]}`;
            }
            let interactables = room.room_interactables.interactables;
            response.result = `You can't open the ${split[1]} any further.`
            for (let interactIndex in interactables) {
                if (interactables[interactIndex].open && interactables[interactIndex].name.includes(split[1])) {
                    response.result = `You open the ${split[1]}.`
                    response = handleOpen(interactIndex, room, response);
                }
            }
            return response;
        case 'use':
            response.type = "USE";
            if (!split[1]) {
                response.result = `Use what?`
                return response;
            }
            if (split[2]) {
                if (split[3]) {
                    split[2] = `${split[2]} ${split[3]}`;
                }
                response.result = `You don't have a ${split[1]}.`;
                for (let item of gameState.inventory) {
                    // console.log(item);
                    // console.log(item.item_name)
                    let interactables = room.room_interactables.interactables;
                    if (item.item_name == split[1]) {
                        response.result = `There isn't a ${split[2]} here.`
                        for (let interactable of interactables) {
                            console.log(interactable.use);
                            if (interactable.name.includes(split[2])) {
                                if (interactable.use?.[item.item_name]) {
                                    response.result = `You don't know how to use the ${split[1]} on the ${split[2]}.`
                                    if (interactable.name.includes(split[2])) {
                                        // console.log(interactables);
                                        response = useItem(item, room, response);
                                        response.result = `You use the ${split[1]} on the ${split[2]}.`
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                return response;
            } else {
                response.result = `Use the ${split[1]} on what?`
                return response;
            }
        case 'exits':
            response.type = "EXITS";
            response.result = room.room_exits.exits.join(', ')
            return response;
        case 'take':
            response.type = "TAKE";
            if (!split[1]) {
                response.result = `Take what?`
                return response;
            }
            for (let item of room.items) {
                //console.log(item)
                if (item.item_name == (split[1])) {
                    response = takeItem(item, room, response);
                    response.result = `You take the ${split[1]}`;
                    return response;
                }
            }
            response.result = `There's no ${split[1]} for you to take.`
            return response;
        case 'look':
            response.type = "LOOK";
            if (split[2]) {
                split[1] = `${split[1]} ${split[2]}`;
            }
            if (!split[1]) {
                let interactablesToString = 'You don\'t see anything particularly interesting.'
                let interactables = room.room_interactables.interactables;
                if (interactables.length > 0) {
                    interactablesToString = `You see the following points of interest: ` + interactables.map((object) => {
                        console.log(object)
                        return object.display_name;
                    }).join(', ');
                }
                response.result = interactablesToString;
                return response;
            }
            if (split[1] == 'room') {
                // console.log(room.room_description)
                response.result = room.room_description;
                return response;
            }
            if (split[1] == 'items') {
                if (room.items.length == 0) {
                    response.result = "You don't see anything particularly interesting to pick up."
                    return response;
                } else {
                    response.result = `You see the following in the room: ` + room.items.map((item) => {
                        return item.item_name;
                    }).join(', ');
                }
                return response;
            }
            for (let interactable of room.room_interactables.interactables) {
                if (interactable.name.includes(split[1])) {
                    response.result = interactable.description;
                    return response;
                }
            }
            response.result = `You don't see a ${split[1]} here.`
            return response;
        default:
            response.result = 'Sorry, I don\'t understand what you\'re trying to do.'
    }
    return response;
}

function useItem(item, room, response) {
    let roomIndex;
    for (roomIndex in gameState.rooms) {
        if (gameState.rooms[roomIndex].room_name == room.room_name) {
            // console.log(gameState.rooms[roomIndex].room_name);
            break;
        }
    }
    // console.log(room);
    for (let index in room.room_interactables.interactables) {
        let interactable = room.room_interactables.interactables[index];
        console.log('INT:', interactable, 'USE:', interactable.use, 'ITEM:', item.item_name);
        if (interactable?.use?.[item.item_name]) {
            console.log(interactable.use[item.item_name]);
            const interactionItem = interactable.use[item.item_name];
            response.message = interactionItem.message;
            const effects = Object.keys(interactionItem.effect);
            console.log(effects);
            for (let effect of effects) {
                console.log("INT ITEM:", interactionItem, 'EFFECT:', effect);
                if (effect == "new_description") {
                    // console.log('old desc:', gameState.rooms[roomIndex].room_interactables.interactables[index].description,
                    // "new desc:", interactionItem.effect.new_description);
                    gameState.rooms[roomIndex].room_interactables.interactables[index].description = interactionItem.effect.new_description;
                } else if (effect == "new_exits") {
                    // console.log('old exits', gameState.rooms[roomIndex].room_exits.exits, 'new exits',interactionItem.effect.new_exits )
                    gameState.rooms[roomIndex].room_exits.exits = interactionItem.effect.new_exits;
                } else {
                    console.log(gameState[effect], interactionItem.effect[effect])
                    gameState[effect] = interactionItem.effect[effect];
                }
            }
        }
    }

    gameState.inventory = gameState.inventory.filter((invItem) => {
        if (invItem.item_name != item.item_name) {
            // console.log(invItem.item_name, item.name);
            return invItem
        };
    })
    response.callback = () => {
        // console.log(JSON.stringify(gameState));
        put({ type: 'SET_GAME_STATE', payload: gameState })
    };
    return response;
}

function handleOpen(interactIndex, room, response) {
    let interactable = room.room_interactables.interactables[interactIndex]
    for (let roomIndex in gameState.rooms) {
        if (gameState.rooms[roomIndex].room_name == room.room_name) {
            if (interactable.open?.shows_item) {
                gameState.rooms[roomIndex].items = [...interactable.open?.shows_item.items, ...room.items]
                response.message = interactable.open.shows_item.message;
                if (interactable.open.shows_item.new_description) {
                    gameState.rooms[roomIndex].room_interactables.interactables[interactIndex].description = interactable.open.shows_item.new_description;
                }
            }
            delete gameState.rooms[roomIndex].room_interactables.interactables[interactIndex].open;
        }
    }
    response.callback = () => {
        put({ type: 'SET_GAME_STATE', payload: gameState })
    };
    return response;
}

function takeItem(item, room, response) {
    for (let index in gameState.rooms) {
        if (gameState.rooms[index].room_name == room.room_name) {
            room.items = room.items.filter((roomItem) => {
                if (roomItem != item) {
                    return roomItem;
                }
            });
            gameState.rooms[index] = room;
        }
    }
    gameState.inventory.push(item);
    response.callback = () => {
        put({ type: 'SET_GAME_STATE', payload: gameState })
    };
    return response;
}

function* commandSaga() {
    yield takeLatest("PARSE_COMMAND", useCommand);
}

export default commandSaga;