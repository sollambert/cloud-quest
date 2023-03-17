import { takeEvery, put, select } from "redux-saga/effects";
import axios from 'axios';

const gameStateSelector = (state) => state.gameState;

function* fetchGames(action) {
    // console.log(action.payload);
    let response = yield axios.get('/api/games', {params: action.payload});
    yield put({type: "SET_GAMES", payload: response.data});
    (action.callback ? yield action.callback() : '');
}

function* selectGame(action) {
    const gameState = yield select(gameStateSelector);
    gameState.game_id = action.payload;
    yield put({type: 'SET_GAME_STATE', payload: gameState});
    yield put({type: "INIT_GAME_STATE"});
}

function* fetchGameEditDetails(action) {
    let response = yield axios.get(`/api/games/edit/${action.payload}`);
    yield put({type: 'SET_CREATOR_INFO', payload: response.data});
}

function* watcherSaga() {
    yield takeEvery("FETCH_GAMES", fetchGames);
    yield takeEvery("SELECT_GAME", selectGame);
    yield takeEvery("FETCH_GAME_EDIT_DETAILS", fetchGameEditDetails);
}

export default watcherSaga;
