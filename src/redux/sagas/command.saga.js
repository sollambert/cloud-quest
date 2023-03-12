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
                break;
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
            response.result = `You open the ${split[1]}`
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
                        response.result = `You don't know how to use the ${split[1]} on the ${split[2]}.`
                        if (item.item_interactions.interactions.includes(split[2])) {
                            response.result = `There isn't a ${split[2]} here.`
                            for (let interactable of interactables) {
                                if (interactable.name == split[2]) {
                                    // console.log(interactables);
                                    response = useItem(split[1], response);
                                    response.result = `You use the ${split[1]} on the ${split[2]}.`
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
                        return object.name;
                    }).join(', ');
                }
                response.result = interactablesToString;
                return response;
            }
            if (split[1] == 'room') {
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
                if (interactable.name == split[1]) {
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

function useItem(item, response) {
    switch (item) {
        case "key":
            gameState.house_locked = false;
            for (let room of gameState.rooms) {
                if (room.room_name == "front door") {
                    console.log(room);
                    room.room_interactables.interactables = room.room_interactables.interactables.map((interactable) => {
                        if (interactable.name == "front door") {
                            return { ...interactable, description: "The front door to your old house. It's been unlocked." }
                        } else {
                            return interactable;
                        }
                    })
                    room.room_exits.exits.push("living room");
                }
            }
            break;
    }
    gameState.inventory = gameState.inventory.filter((invItem) => {
        if (invItem.item_name != item) { return invItem };
    })
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