import { put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";

function* addItem(action) {
    yield axios.post('/api/games/item', action.payload);
    yield put({type: "FETCH_GAME_EDIT_DETAILS", payload: action.payload.id});
    (action.callback ? yield action.callback() : '');
}

function* deleteItem(action) {
    yield axios.delete(`/api/games/item/${action.payload.game_id}/${action.payload.item_id}`);
    yield put({type: "FETCH_GAME_EDIT_DETAILS", payload: action.payload.game_id});
}

function* gameCreatorSaga() {
    yield takeLatest("ADD_ITEM_CREATOR", addItem);
    yield takeLatest("DELETE_ITEM_CREATOR", deleteItem);
}

export default gameCreatorSaga;