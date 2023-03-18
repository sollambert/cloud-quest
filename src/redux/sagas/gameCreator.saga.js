import { put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";

function* addItem(action) {
    try {
        yield axios.post(`/api/games/editor/item/${action.payload.id}`, action.payload);
        yield put({type: "FETCH_GAME_EDIT_DETAILS", payload: action.payload.id});
        (action.callback ? yield action.callback() : '');
    } catch (error) {
        console.error(error);
    }
}

function* deleteItem(action) {
    try {
        yield axios.delete(`/api/games/editor/item/${action.payload.game_id}/${action.payload.item_id}`);
        yield put({type: "FETCH_GAME_EDIT_DETAILS", payload: action.payload.game_id});
    } catch (error) {
        console.error(error);
    }
}

function* saveRoom(action) {
    try {
        yield axios.put(`/api/games/editor/room/${action.payload.id}`, action.payload);
        yield put({type: "FETCH_GAME_EDIT_DETAILS", payload: action.payload.game_id});
    } catch (error) {
        console.error(error);
    }
}

function* saveGameInfo(action) {
    try {
        yield axios.put(`/api/games/editor/info/${action.payload.id}`, action.payload);
    } catch (error) {
        console.error(error);
    }
}

function* gameCreatorSaga() {
    yield takeLatest("ADD_ITEM_CREATOR", addItem);
    yield takeLatest("DELETE_ITEM_CREATOR", deleteItem);
    yield takeLatest("SAVE_GAME_INFO_CREATOR", saveGameInfo);
    yield takeLatest("SAVE_ROOM_CREATOR", saveRoom);
}

export default gameCreatorSaga;