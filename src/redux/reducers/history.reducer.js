const historyReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_HISTORY':
            return [...state, action.payload];
        case 'CLEAR_HISTORY':
            return [];
        default:
            return state;
    }
};

export default historyReducer;