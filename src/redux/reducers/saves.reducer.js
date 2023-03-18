/**
 * Reducer for storing save information for player
 */
const savesReducer = (state = [], action) => {
    switch(action.type) {
        case "SET_SAVE_DATA":
            return action.payload;
        case "CLEAR_SAVE_DATA":
            return [];
        default:
            return state;
    }
}

export default savesReducer;