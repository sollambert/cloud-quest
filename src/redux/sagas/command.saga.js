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
    for (let message of response.messages) {
        yield put({ type: 'ADD_HISTORY', payload: message })
    }
    if (response.callback) { yield response.callback() }
}

function* parseCommand(message) {
    const room = gameState.rooms.filter((room) => {
        if (room.name == gameState.location) {
            return room
        }
    })[0];
    // console.log(room);
    message = message.toLowerCase();
    let split = message.split(' ').filter(
        (element) => {
            if (!ignored.includes(element)) { return element }
        });
    let response = {messages: []};
    let interactables = room.interactables.interactables;
    switch (split[0]) {
        case 'go':
            response.type = "GO";
            if (split[2]) {
                split[1] = `${split[1]} ${split[2]}`;
            }
            if (!split[1]) {
                response.messages.push(`Go where?`)
                return response;
            } if (room.name == split[1]) {
                response.messages.push(`You are already there.`)
                return response;
            } if (room.exits.exits.includes(split[1])) {
                response.messages.push(`You go to the ${split[1]}.`)
                response.callback = () => put({
                    type: "UPDATE_LOCATION",
                    payload: gameState.rooms.filter((room) => {
                        if (room.name == split[1]) {
                            return room
                        }
                    })[0]
                })
                return response;
            } else {
                response.messages.push(`You don't know how to get there.`)
                return response;
            }
        case 'open':
            response.type = "OPEN";
            if (!split[1]) {
                response.messages.push(`Open what?`)
                return response;
            }
            if (split[2]) {
                split[1] = `${split[1]} ${split[2]}`;
            }
            response.messages.push(`You can't open the ${split[1]} any further.`)
            for (let interactIndex in interactables) {
                if (interactables[interactIndex].open && interactables[interactIndex].name.includes(split[1])) {
                    response.messages.push(`You open the ${split[1]}.`)
                    response = handleOpen(interactIndex, room, response);
                }
            }
            return response;
        case 'use':
            response.type = "USE";
            if (!split[1]) {
                response.messages.push(`Use what?`)
                return response;
            }
            if (split[2]) {
                if (split[3]) {
                    split[2] = `${split[2]} ${split[3]}`;
                }
                for (let item of gameState.inventory) {
                    // console.log(item);
                    // console.log(item.name)
                    if (item.name == split[1]) {
                        for (let interactable of interactables) {
                            // console.log(interactable.use);
                            if (interactable.name.includes(split[2])) {
                                if (interactable.use?.[item.name]) {
                                    if (interactable.name.includes(split[2])) {
                                        // console.log(interactables);
                                        response.messages.push(`You use the ${split[1]} on the ${split[2]}.`)
                                        response = useItem(item, room, response);
                                        return response;
                                    }
                                    response.messages.push(`You don't know how to use the ${split[1]} on the ${split[2]}.`);
                                    return response;
                                }
                            }
                        }
                        response.messages.push(`There isn't a ${split[2]} here.`)
                        return response;
                    }
                }
                response.messages.push(`You don't have a ${split[1]}.`);
                return response;
            } else {
                response.messages.push(`Use the ${split[1]} on what?`)
                return response;
            }
        case 'move':
            response.type = "MOVE";
            if (!split[1]) {
                response.messages.push(`Move what?`)
                return response;
            }
            if (split[2]) {
                split[1] = `${split[1]} ${split[2]}`;
            }
            for (let index in interactables) {
                // console.log(interactables[index])
                if (interactables[index].name.includes(split[1])) {
                    response.messages.push(`You don't know how you can move the ${split[1]}`);
                    if (interactables[index]?.move) {
                        // console.log(interactables[index]?.move)
                        response.messages.push(`You move the ${split[1]}...`);
                        response = handleMove(index, room, response)
                        return response;
                    }
                }
            }
            response.messages.push(`You don't see a ${split[1]} here.`)
            return response;
        case 'exits':
            response.type = "EXITS";
            response.messages.push(room.exits.exits.join(', '))
            return response;
        case 'take':
            response.type = "TAKE";
            if (!split[1]) {
                response.messages.push(`Take what?`)
                return response;
            }
            for (let item of room.items) {
                //console.log(item)
                if (item.name == (split[1])) {
                    response = takeItem(item, room, response);
                    response.messages.push(`You take the ${split[1]}`);
                    return response;
                }
            }
            response.messages.push(`There's no ${split[1]} for you to take.`)
            return response;
        case 'look':
            response.type = "LOOK";
            if (split[2]) {
                split[1] = `${split[1]} ${split[2]}`;
            }
            if (!split[1]) {
                if (interactables.length > 0) {
                    response.messages.push(`You see the following points of interest: ` + interactables.map((object) => {
                        console.log(object)
                        return object.display_name;
                    }).join(', ') + ".");
                }
                if (room.items.length > 0) {
                    response.messages.push('You see the following items: ' + room.items.map((item) => {
                        return item.name;
                    }).join(', ') + ".");
                }
                if (response.messages.length == 0) {
                    response.messages.push('You don\'t see anything particularly interesting.');
                    return response;
                }
                return response;
            }
            if (split[1] == 'room') {
                // console.log(room.description)
                response.messages.push(room.description);
                return response;
            }
            if (split[1] == 'items') {
                if (room.items.length == 0) {
                    response.messages.push("You don't see anything particularly interesting to pick up.")
                    return response;
                } else {
                    response.messages.push(`You see the following in the room: ` + room.items.map((item) => {
                        return item.name;
                    }).join(', '));
                }
                return response;
            }
            for (let interactable of interactables) {
                if (interactable.name.includes(split[1])) {
                    response.messages.push(interactable.description);
                    return response;
                }
            }
            response.messages.push(`You don't see a ${split[1]} here.`)
            return response;
        default:
            response.messages.push('Sorry, I don\'t understand what you\'re trying to do.');
    }
    return response;
}

function handleMove(interactIndex, room, response) {
    let interactable = room.interactables.interactables[interactIndex]
    for (let roomIndex in gameState.rooms) {
        if (gameState.rooms[roomIndex].name == room.name) {
            if (interactable.move?.add_interaction) {
                for (let interaction of Object.keys(interactable.move.add_interaction)) {
                    // console.log('interact index', index, 'interaction', interaction);
                    gameState.rooms[roomIndex].interactables.interactables[index][interaction] = interactable.move.add_interaction[interaction];
                }
                if (interactable.move.new_description) {
                    gameState.rooms[roomIndex].interactables.interactables[index].description = interactable.move.new_description;
                }
                response.messages.push(interactable.move.message);
            }
            if (interactable.move?.shows_item) {
                gameState.rooms[roomIndex].items = [...interactable.move.shows_item.items, ...room.items]
                response.messages.push(interactable.move.shows_item.message);
                if (interactable.move.shows_item.new_description) {
                    gameState.rooms[roomIndex].interactables.interactables[interactIndex].description = interactable.move.shows_item.new_description;
                }
            }
        }
    }
    return response;
}

function useItem(item, room, response) {
    let roomIndex;
    let removeItem = true;
    for (roomIndex in gameState.rooms) {
        if (gameState.rooms[roomIndex].name == room.name) {
            // console.log(gameState.rooms[roomIndex].name);
            break;
        }
    }
    // console.log(room);
    for (let index in room.interactables.interactables) {
        let interactable = room.interactables.interactables[index];
        // console.log('INT:', interactable, 'USE:', interactable.use, 'ITEM:', item.name);
        if (interactable?.use?.[item.name]) {
            const interactionItem = interactable.use[item.name];
            if (interactionItem.condition) {
                // console.log('item conditions', interactionItem.condition);
                let conditionsMet = true;
                for (let condition of interactionItem.condition) {
                    // console.log("condition", condition);
                    if (gameState[condition] != true) {
                        // console.log('condition state', gameState[condition]);
                        response.messages.push(interactionItem.condition_message);
                        removeItem = false;
                        conditionsMet = false;
                        break;
                    }
                }
                if (!conditionsMet) {
                    break;
                }
            }
            // console.log(interactable.use[item.name]);
            response.messages.push(interactionItem.message);
            const effects = Object.keys(interactionItem.effect);
            // console.log(effects);
            for (let effect of effects) {
                // console.log("INT ITEM:", interactionItem, 'EFFECT:', effect);
                if (effect == "new_description") {
                    // console.log('old desc:', gameState.rooms[roomIndex].interactables.interactables[index].description,
                    // "new desc:", interactionItem.effect.new_description);
                    gameState.rooms[roomIndex].interactables.interactables[index].description = interactionItem.effect.new_description;
                } else if (effect == "new_exits") {
                    // console.log('old exits', gameState.rooms[roomIndex].exits.exits, 'new exits',interactionItem.effect.new_exits )
                    gameState.rooms[roomIndex].exits.exits = interactionItem.effect.new_exits;
                } else {
                    // console.log(gameState[effect], interactionItem.effect[effect])
                    gameState[effect] = interactionItem.effect[effect];
                }
            }
        }
    }

    if (removeItem) {
        gameState.inventory = gameState.inventory.filter((invItem) => {
            if (invItem.name != item.name) {
                // console.log(invItem.name, item.name);
                return invItem
            };
        })
    }
    response.callback = () => {
        // console.log(JSON.stringify(gameState));
        put({ type: 'SET_GAME_STATE', payload: gameState })
    };
    return response;
}

function handleOpen(interactIndex, room, response) {
    let interactable = room.interactables.interactables[interactIndex]
    for (let roomIndex in gameState.rooms) {
        if (gameState.rooms[roomIndex].name == room.name) {
            if (interactable.open?.shows_item) {
                gameState.rooms[roomIndex].items = [...interactable.open?.shows_item.items, ...room.items]
                response.messages.push(interactable.open.shows_item.message);
                if (interactable.open.shows_item.new_description) {
                    gameState.rooms[roomIndex].interactables.interactables[interactIndex].description = interactable.open.shows_item.new_description;
                }
            }
            if (interactable.open?.add_interaction) {
                for (let interaction of Object.keys(interactable.open.add_interaction)) {
                    // console.log('interact index', interactIndex, 'interaction', interaction);
                    gameState.rooms[roomIndex].interactables.interactables[interactIndex][interaction] = interactable.open.add_interaction[interaction];
                }
                if (interactable.open.new_description) {
                    gameState.rooms[roomIndex].interactables.interactables[interactIndex].description = interactable.open.new_description;
                }
                response.messages.push(interactable.open.message);
            }
            delete gameState.rooms[roomIndex].interactables.interactables[interactIndex].open;
        }
    }
    response.callback = () => {
        put({ type: 'SET_GAME_STATE', payload: gameState })
    };
    return response;
}

function takeItem(item, room, response) {
    for (let index in gameState.rooms) {
        if (gameState.rooms[index].name == room.name) {
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