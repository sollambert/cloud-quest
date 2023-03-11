const gameStateReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_GAME_STATE':
            return action.payload;
        case 'CLEAR_GAME_STATE':
            return {};
        default:
            return state;
    }
};

export default gameStateReducer;