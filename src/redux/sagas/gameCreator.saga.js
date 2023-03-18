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

function* updateItem(action) {
    try {
        yield axios.put(`/api/games/editor/item/${action.payload.game_id}/${action.payload.id}`, action.payload);
        yield put({type: "FETCH_GAME_EDIT_DETAILS", payload: action.payload.game_id});
        yield action.callback();
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

function* addRoom(action) {
    try {
        yield axios.post(`/api/games/editor/room`, action.payload);
        yield put({type: "FETCH_GAME_EDIT_DETAILS", payload: action.payload.game_id});
        yield action.callback();
    } catch (error) {
        console.error(error);
    }
}

function* deleteRoom(action) {
    try {
        yield axios.delete(`/api/games/editor/room/${action.payload.game_id}/${action.payload.id}`);
        yield put({type: "FETCH_GAME_EDIT_DETAILS", payload: action.payload.game_id});
        yield action.callback();
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
    yield takeLatest("ADD_ITEM_EDITOR", addItem);
    yield takeLatest("DELETE_ITEM_EDITOR", deleteItem);
    yield takeLatest("UPDATE_ITEM_EDITOR", updateItem);
    yield takeLatest("SAVE_GAME_INFO_EDITOR", saveGameInfo);
    yield takeLatest("SAVE_ROOM_EDITOR", saveRoom);
    yield takeLatest("SAVE_NEW_ROOM_EDITOR", addRoom);
    yield takeLatest("DELETE_ROOM_EDITOR", deleteRoom);
}

export default gameCreatorSaga;