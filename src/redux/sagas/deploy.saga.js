import { takeLatest } from "redux-saga/effects"

function* deployCalculator() {
    yield console.log("DEPLOYING CALCULATOR YEEHAW");
}

function* deploySaga() {
    yield takeLatest("DEPLOY_CALCULATOR", deployCalculator);
}

export default deploySaga;