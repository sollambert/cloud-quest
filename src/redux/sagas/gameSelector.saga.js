import { takeEvery, put, select } from "redux-saga/effects";
import axios from 'axios';

const gameStateSelector = (state) => state.gameState;


/**
 * Worker saga to fetching info for game selector
 * @param {*} action redux action containing search terms
 */
function* fetchGames(action) {
    try {
        // console.log(action.payload);
        let response = yield axios.get('/api/games', { params: action.payload });
        yield put({ type: "SET_GAMES", payload: response.data });
        (action.callback ? yield action.callback() : '');
    } catch (error) {
        console.error(error);
    }
}

/**
 * Worker saga to select game and initialize game state
 * @param {*} action redux action containing game id as payload
 */
function* selectGame(action) {
    try {
        const gameState = yield select(gameStateSelector);
        gameState.game_id = action.payload;
        yield put({ type: 'SET_GAME_STATE', payload: gameState });
        yield put({ type: "INIT_GAME_STATE" });
    } catch (error) {
        console.error(error);
    }
}

/**
 * Worker saga to fetch game info for editor
 * @param {*} action redux action containing game id
 */
function* fetchGameEditDetails(action) {
    try {
        let response = yield axios.get(`/api/games/editor/${action.payload}`);
        yield put({ type: 'SET_EDITOR_INFO', payload: response.data });
    } catch (error) {
        console.error(error);
    }
}

//watcher saga
function* watcherSaga() {
    yield takeEvery("FETCH_GAMES", fetchGames);
    yield takeEvery("SELECT_GAME", selectGame);
    yield takeEvery("FETCH_GAME_EDIT_DETAILS", fetchGameEditDetails);
}

export default watcherSaga;
