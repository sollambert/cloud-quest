const gameStateReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_GAME_ID':
            return {...state, game_id: action.payload};
        case 'SET_GAME_STATE':
            return action.payload;
        case 'SET_CURRENT_ROOM':
            return {...state, location: action.payload};
        case 'CLEAR_GAME_STATE':
            return {};
        default:
            return state;
    }
};

export default gameStateReducer;