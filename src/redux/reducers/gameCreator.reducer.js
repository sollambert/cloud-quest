/**
 * Reducer for storing all state needed for the GameCreator component
 */
const gameCreatorReducer = (state = {}, action) => {
    switch(action.type) {
        case "SET_EDITOR_INFO":
            return action.payload;
        default:
            return state;
    }
}

export default gameCreatorReducer;