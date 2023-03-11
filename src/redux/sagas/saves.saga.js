import { put, select, takeLatest } from 'redux-saga/effects';
import gameState from '../reducers/gameState.reducer';
import axios from 'axios';

const gameStateSelector = (state) => state.gameState;

function* initializeGameState() {
    let response = yield axios.get('/api/saves/new');
    // console.log(response.data);
    yield put({type: "SET_GAME_STATE", payload: response.data});
    yield put({type: 'ADD_HISTORY', payload: {message: response.data.rooms[0].room_description}})
}

function* loadGame(action) {
    let response = yield axios.get(`/api//saves/${action.payload}`)
    put({type: "SET_GAME_STATE", payload: response})
}

function* saveGame() {
    const gameState = yield select(gameStateSelector);
    yield axios.post(`/api//saves`, gameState);
}

function* overwriteSave(action) {
    const gameState = yield select(gameStateSelector);
    yield axios.update(`/api//saves/${action.payload}`, gameState);
}

function* deleteSave(action) {
    yield axios.delete(`/api//saves/${action.payload}`);
}

function* savesSaga() {
    yield takeLatest("INIT_GAME_STATE", initializeGameState);
    yield takeLatest("LOAD_GAME", loadGame);
    yield takeLatest("SAVE_GAME", saveGame);
    yield takeLatest("OVERWRITE_SAVE", overwriteSave);
    yield takeLatest("DELETE_SAVE", deleteSave);
}

export default savesSaga;