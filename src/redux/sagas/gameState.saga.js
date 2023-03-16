import { takeLatest, put, select } from "redux-saga/effects"

function* updateLocation(action) {
    yield put ({type: 'SET_CURRENT_ROOM', payload: action.payload.name});
    yield put ({type: 'ADD_HISTORY', payload: action.payload.description});
}

function* gameStateSaga() {
    yield takeLatest("UPDATE_LOCATION", updateLocation);
}

export default gameStateSaga;