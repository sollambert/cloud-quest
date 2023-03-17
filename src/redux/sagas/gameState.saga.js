import { takeLatest, put, select } from "redux-saga/effects"

function* updateLocation(action) {
    try {
        yield put({ type: 'SET_CURRENT_ROOM', payload: action.payload.name });
        yield put({ type: 'ADD_HISTORY', payload: action.payload.description });
    } catch (error) {
        console.error(error);
    }
}

function* gameStateSaga() {
    yield takeLatest("UPDATE_LOCATION", updateLocation);
}

export default gameStateSaga;