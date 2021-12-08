import { all } from 'redux-saga/effects';
import { watchAuth } from './auth/middlewares';
import { watchAdmin } from './api/admin/middlewares';
import { watchPA } from './api/pa/middlewares';

export default function* appMiddleware() {
  yield all([
    watchAuth(),
    watchAdmin(),
    watchPA()
  ]);
}
