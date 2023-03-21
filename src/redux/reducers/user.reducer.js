const userReducer = (state = {loading: true}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {...action.payload, loading: false};
    case 'UNSET_USER':
      return {loading: true};
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default userReducer;
