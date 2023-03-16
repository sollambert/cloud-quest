import { put, select, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

const gameStateSelector = (state) => state.gameState;

function* initializeGameState() {
    let response = yield axios.get('/api/saves/new/1');
    yield put({ type: "SET_GAME_STATE", payload: response.data });
    yield put({ type: 'ADD_HISTORY', payload: response.data.rooms[0].description })
}

function* getSaveData() {
    const gameState = yield select(gameStateSelector);
    let response = yield axios.get(`/api/saves/data/${gameState.game_id}`);
    yield put({ type: "SET_SAVE_DATA", payload: response.data });
}

function* loadGame(action) {
    const gameState = yield select(gameStateSelector);
    let response = yield axios.get(`/api/saves/load/${gameState.game_id}/${action.payload}`);
    console.log(response.data)
    let roomDescription = '';
    for (let room of response.data.save.rooms) {
        if (room.name == response.data.save.location) {
            roomDescription = room.description;
        }
    }
    yield put({ type: "SET_GAME_STATE", payload: response.data.save });
    yield put({type: "CLEAR_HISTORY"});
    yield put({
        type: 'ADD_HISTORY',
        payload: roomDescription
    })
}

function* saveGame() {
    const gameState = yield select(gameStateSelector);
    yield axios.post(`/api/saves/${gameState.game_id}`, gameState);
    yield put({ type: "GET_SAVE_DATA" });
}

function* overwriteSave(action) {
    const gameState = yield select(gameStateSelector);
    yield axios.put(`/api/saves/${gameState.game_id}/${action.payload}`, gameState);
    yield put({ type: "GET_SAVE_DATA" });
}

function* deleteSave(action) {
    const gameState = yield select(gameStateSelector);
    yield axios.delete(`/api/saves/${gameState.game_id}/${action.payload}`);
    yield put({ type: "GET_SAVE_DATA" });
}

function* savesSaga() {
    yield takeLatest("INIT_GAME_STATE", initializeGameState);
    yield takeLatest("GET_SAVE_DATA", getSaveData);
    yield takeLatest("LOAD_SAVE", loadGame);
    yield takeLatest("SAVE_GAME", saveGame);
    yield takeLatest("OVERWRITE_SAVE", overwriteSave);
    yield takeLatest("DELETE_SAVE", deleteSave);
}

export default savesSaga;