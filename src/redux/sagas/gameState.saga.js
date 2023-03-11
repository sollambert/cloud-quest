import { put, select, takeLatest } from 'redux-saga/effects';
import gameState from '../reducers/gameState.reducer';
import axios from 'axios';

const gameStateSelector = (state) => state.gameState;

function* initializeGameState() {
    let response = yield axios.get('/saves/new');
    put({type: "SET_GAME_STATE", payload: response});
}

function* loadGame(action) {
    let response = yield axios.get(`/saves/${action.payload}`)
    put({type: "SET_GAME_STATE", payload: response})
}

function* saveGame() {
    const gameState = yield select(gameStateSelector);
    yield axios.post(`/saves`, gameState);
}

function* overwriteSave(action) {
    const gameState = yield select(gameStateSelector);
    yield axios.update(`/saves/${action.payload}`, gameState);
}

function* deleteSave(action) {
    yield axios.delete(`/saves/${action.payload}`);
}

function* rootSaga() {
    yield takeLatest("INIT_GAME_STATE", initializeGameState);
    yield takeLatest("LOAD_GAME", loadGame);
    yield takeLatest("SAVE_GAME", saveGame);
    yield takeLatest("OVERWRITE_SAVE", overwriteSave);
    yield takeLatest("DELETE_SAVE", deleteSave);
}