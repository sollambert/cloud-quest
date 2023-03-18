/**
 * reducer for storing all games fetched from database
 */
function gamesReducer(state = [], action) {
    switch (action.type) {
        case "SET_GAMES":
            return action.payload;
        case "CLEAR_GAMES":
            return [];
        default:
            return state;
    }
}

export default gamesReducer;