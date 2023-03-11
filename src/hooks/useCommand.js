import { useSelector } from 'react-redux';
import ignored from '../modules/ignored';

const gameState = useSelector(store => store.gameState);

const useCommand = (message) => {
    const response = parseCommand(message);

    const updateHistory = (message, response) => {
        dispatch({
            type: 'ADD_HISTORY',
            payload: { message: message }
        })
        dispatch({
            type: 'ADD_HISTORY',
            payload: { message: response.data.result }
        })
        resolve();
    }
}

function parseCommand(message) {
    message = message.toLowerCase();
    let split = message.split(' ').filter(
        (element) => {
            if (!ignored.includes(element)) { return element }
        });
    let response = {};
    //console.log(split)
    switch (split[0]) {
        case 'go':
            response.type = "GO";
            if (split[2]) {
                split[1] = `${split[1]} ${split[2]}`;
                console.log(split[1]);
            }
            if (!split[1]) {
                response.result = `Go where?`
                return response;
            } if (gameState.room.name == split[1]) {
                response.result = `You are already there.`
                return response;
            } if (gameState.room.exits.includes(split[1])) {
                pool.query(`UPDATE player_data
                SET room = $2
                WHERE id=$1`, [1, split[1]])
                response.result = `You go to the ${split[1]}.`
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
            response.result = `You open the ${split[1]}`
            return response;
        case 'use':
            response.type = "USE";
            if (!split[1]) {
                response.result = `Use what?`
                return response;
            }
            if (split[2]) {
                response.result = `You use the ${split[1]} on the ${split.slice(2, split.length).join(' ')}.`
                return response;
            } else {
                response.result = `Use the ${split[1]} on what?`
                return response;
            }
        case 'exits':
            response.type = "EXITS";
            response.result = gameState.room.exits.join(', ')
            return response;
        case 'take':
            response.type = "TAKE";
            if (!split[1]) {
                response.result = `Take what?`
                return response;
            }
            for (let item of gameState.room.items) {
                //console.log(item)
                if (item == (split[1])) {
                    response.result = `You take the ${split[1]}`;
                    response.item = item;
                    return response;
                }
            }
            response.result = `There's no ${split[1]} for you to take.`
            return response;
        case 'look':
            response.type = "LOOK";
            //console.log(gameState.room.interactables)
            if (!split[1]) {
                response.result = gameState.room.description;
                return response;
            }
            if (split[1] == 'items') {
                if (gameState.room.items[0] == undefined) {
                    response.result = "You don't see anything particularly interesting to pick up."
                    return response;
                }
                response.result = gameState.room.items.join(', ');
                return response;
            }
            for (let object of gameState.room.interactables) {
                console.log(object)
                if (object[(split[1])]) {
                    response.result = object[(split[1])].description;
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