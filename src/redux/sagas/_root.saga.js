import { all } from 'redux-saga/effects';
import loginSaga from './login.saga';
import registrationSaga from './registration.saga';
import userSaga from './user.saga';
import commandSaga from './command.saga';
import savesSaga from './saves.saga';
import gameStateSaga from './gameState.saga';
import gameSelectorSaga from './gameSelector.saga';
import gameCreatorSaga from './gameCreator.saga';
import deploySaga from './deploy.saga';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),
    commandSaga(),
    savesSaga(),
    gameStateSaga(),
    gameSelectorSaga(),
    gameCreatorSaga(),
    deploySaga(),
  ]);
}
