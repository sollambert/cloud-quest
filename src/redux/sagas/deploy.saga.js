import { takeLatest, put } from "redux-saga/effects"
import axios from "axios";

function* deployCalculator() {
    yield console.log("DEPLOYING CALCULATOR YEEHAW");
    let response = yield axios.get('/api/deploy');
    yield put({type: "ADD_HISTORY", payload: `Application deployed to ${response.data.url}`});
}

function* deploySaga() {
    yield takeLatest("DEPLOY_CALCULATOR", deployCalculator);
}

export default deploySaga;