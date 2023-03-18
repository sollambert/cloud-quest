import { takeLatest, put, select } from "redux-saga/effects"
import axios from "axios";

const gameStateSelector = (state) => state.gameState;

function* initializeGameState() {
    try {
        const gameState = yield select(gameStateSelector);
        let response = yield axios.get(`/api/games/new/${gameState.game_id}`);
        yield put({ type: "SET_GAME_STATE", payload: response.data });
        yield put({ type: "CLEAR_HISTORY" });
        yield put({ type: "CLEAR_SAVE_DATA" });
        yield put({ type: 'ADD_HISTORY', payload: response.data.rooms[0].description })
    } catch (error) {
        console.error(error);
    }
}

function* updateLocation(action) {
    try {
        yield put({ type: 'SET_CURRENT_ROOM', payload: action.payload.name });
        yield put({ type: 'ADD_HISTORY', payload: action.payload.description });
    } catch (error) {
        console.error(error);
    }
}

function* gameStateSaga() {
    yield takeLatest("INIT_GAME_STATE", initializeGameState);
    yield takeLatest("UPDATE_LOCATION", updateLocation);
}

export default gameStateSaga;