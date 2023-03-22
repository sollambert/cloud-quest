import { select, put, takeLatest } from 'redux-saga/effects';
import ignored from '../../modules/ignored';

const gameStateSelector = (state) => state.gameState;
let gameState;

//starting function for command parsing saga
function* useCommand(action) {
    try {
        gameState = yield select(gameStateSelector);
        const response = yield parseCommand(action.payload);
        yield put({ type: 'ADD_HISTORY', payload: action.payload })
        for (let message of response.messages) {
            yield put({ type: 'ADD_HISTORY', payload: message })
        }
        if (response.callback) { yield response.callback() }
    } catch (error) {
        console.error(error);
    }
}

//function that parses user command and executes appropriate game logic based on user's command
function* parseCommand(message) {
    const room = gameState.rooms.filter((room) => {
        if (room.name == gameState.location) {
            return room
        }
    })[0];
    message = message.toLowerCase();
    let split = message.split(' ').filter(
        (element) => {
            if (!ignored.includes(element)) { return element }
        });
    let response = { messages: [] };
    let interactables = room.interactables;
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
            } if (room.exits.includes(split[1])) {
                response.messages.push(`You go to the ${split[1]}.`)
                response.callback = function* () {
                    yield put({
                        type: "UPDATE_LOCATION",
                        payload: gameState.rooms.filter((room) => {
                            if (room.name == split[1]) {
                                return room
                            }
                        })[0]
                    })
                }
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
            let opened = false;
            for (let interactIndex in interactables) {
                if (interactables[interactIndex].open && interactables[interactIndex].name.includes(split[1])) {
                    response.messages.push(`You open the ${split[1]}.`)
                    opened = true;
                    response = handleOpen(interactIndex, room, response);
                }
            }
            if (!opened) {
                response.messages.push(`You can't open the ${split[1]} any further.`)
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
                for (let item of gameState.items) {
                    if (item.name == split[1] && gameState.inventory.includes(item.id)) {
                        for (let index in interactables) {
                            if (interactables[index].name.includes(split[2])) {
                                if (interactables[index].use?.[item.id]) {
                                    response.messages.push(`You use the ${split[1]} on the ${split[2]}.`)
                                    response = useItem(index, item.id, room, response);
                                    return response;
                                }
                                response.messages.push(`You don't know how to use the ${split[1]} on the ${split[2]}.`);
                                return response;
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
            let exists = false;
            let moved = false;
            for (let index in interactables) {
                if (interactables[index].name.includes(split[1])) {
                    if (interactables[index]?.move) {
                        // console.log(interactables[index]?.move)
                        response.messages.push(`You move the ${split[1]}...`);
                        moved = true;
                        response = handleMove(index, room, response)
                        return response;
                    }
                    exists = true;
                }
            }
            if (!moved) {
                response.messages.push(`You don't know how you can move the ${split[1]}`);
            }
            if (!exists) {
                response.messages.push(`You don't see a ${split[1]} here.`)
            }
            return response;
        case 'exits':
            response.type = "EXITS";
            response.messages.push(room.exits.join(', '))
            return response;
        case 'take':
            response.type = "TAKE";
            if (!split[1]) {
                response.messages.push(`Take what?`)
                return response;
            }
            if (split[2]) {
                split[1] = `${split[1]} ${split[2]}`;
            }
            for (let item of room.items) {
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

//function to prepare handleinteraction for processing "use" commands
function useItem(interactIndex, itemId, room, response) {
    let interactable = room.interactables[interactIndex]
    for (let roomIndex in gameState.rooms) {
        if (gameState.rooms[roomIndex].name == room.name) {
            response.removeItem = true;
            response = handleInteraction(roomIndex, room, interactIndex, interactable, response, "use", itemId);
        }
    }

    if (response.removeItem) {
        gameState.inventory = gameState.inventory.filter((invId) => {
            if (invId != itemId) {
                return invId
            };
        })
    }
    return response;
}

//function to prepare handleInteraction for processing "move" commands
function handleMove(interactIndex, room, response) {
    let interactable = room.interactables[interactIndex]
    for (let roomIndex in gameState.rooms) {
        if (gameState.rooms[roomIndex].name == room.name) {
            response = handleInteraction(roomIndex, room, interactIndex, interactable, response, "move");
        }
    }
    return response;
}

//function to prepate handleInteraction for processing "open" commands
function handleOpen(interactIndex, room, response) {
    let interactable = room.interactables[interactIndex]
    for (let roomIndex in gameState.rooms) {
        if (gameState.rooms[roomIndex].name == room.name) {
            response = handleInteraction(roomIndex, room, interactIndex, interactable, response, "open");
        }
    }
    return response;
}

/**
 * main function for handling user interaction and logic resulting of various scripted keys within interactable
 * @param {*} roomIndex index of room in rooms array
 * @param {*} room room object to be modified by the various keys within the action user has performed
 * @param {*} interactIndex index of interactable in the interactables array
 * @param {*} interactable interactable the user has chosed to interact with
 * @param {*} response response object to be modified and returned to command saga
 * @param {*} key the name of the command user inputted ie "use","move","open"
 * @param {*} itemId optional argument only used for the "use" command.
 * @returns 
 */
function handleInteraction(roomIndex, room, interactIndex, interactable, response, key, itemId) {
    console.log(interactable, key);
    //if key is use, change key to item ID and move current location in object to the location of said itemid in interactables object
    if (key == "use") {
        interactable = interactable[key];
        key = itemId;
    }
    //checks if condition key exists within interactable. should be populated with an object containing gamestate variables to check
    if (interactable[key]?.condition) {
        let conditionsMet = true;
        for (let condition of Object.keys(interactable[key]?.condition)) {
            console.log(gameState[condition], interactable[key]?.condition[condition])
            if (gameState[condition] != interactable[key]?.condition[condition]) {
                response.messages.push(interactable[key]?.condition_message);
                conditionsMet = false;
                response.removeItem = false;
                break;
            }
        }
        if (!conditionsMet) {
            return response;
        }
    }
    //new description to give interactable after interaction has been handled
    if (interactable[key]?.new_description) {
        gameState.rooms[roomIndex].interactables[interactIndex].description = interactable[key].new_description;
    }
    //new exits for room that user is in. will overwrite old exits
    if (interactable[key]?.new_exits) {
        gameState.rooms[roomIndex].exits = interactable[key].new_exits;
    }
    //sets various gamestate variables for global state. must be and object, the keys of which designate which variables to update with their corresponding value
    if (interactable[key]?.set_var) {
        for (let state of Object.keys(interactable[key]?.set_var)) {
            gameState[state] = interactable[key].set_var[state];
        }
    }
    //adds a specific interaction to current interactable. can be used to chain logic by adding new interactions
    if (interactable[key]?.add_interaction) {
        for (let interaction of Object.keys(interactable[key].add_interaction)) {
            gameState.rooms[roomIndex].interactables[interactIndex][interaction] = interactable[key].add_interaction[interaction];
        }
    }
    //adds the array of item ids within the shows_item key to the current room
    if (interactable[key]?.shows_item) {
        let items = gameState.items.filter((item) => {
            if (interactable[key]?.shows_item.includes(`${item.id}`)) {
                console.log(item);
                return item;
            }
        })
        gameState.rooms[roomIndex].items = [...items, ...room.items]
    }
    //adds message key to response message array that will be displayed upon saga completion on user's chat history
    response.messages.push(interactable[key].message);
    //if interaction does not have key "persistent" = true, interaction will be removed from current interactable after it has concluded.
    if (interactable[key]?.persistent != true) {
        delete gameState.rooms[roomIndex].interactables[interactIndex][key];
    }
    //callback for saga to set current gamestate to modified gamestate object
    response.callback = function* () {
        yield put({ type: 'SET_GAME_STATE', payload: gameState })
    };
    //deploy calculator application
    if (interactable[key]?.deploy == "calculator") {
        response.callback = function* () {
            yield put({ type: "DEPLOY_CALCULATOR" });
            yield put({ type: 'SET_GAME_STATE', payload: gameState })
        }
    }
    return response;
}

//adds taken item to user inventory and removes from room inventory
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
    gameState.inventory.push(item.id);
    response.callback = function* () {
        yield put({ type: 'SET_GAME_STATE', payload: gameState })
    };
    return response;
}

//watcher saga
function* commandSaga() {
    yield takeLatest("PARSE_COMMAND", useCommand);
}

export default commandSaga;