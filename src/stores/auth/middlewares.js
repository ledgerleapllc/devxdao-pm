import { put, takeLatest, all } from 'redux-saga/effects';
import { post, put as putApi, get, ErrorHandler } from '@shared/core/services/saga';
import { saveApiResponseError } from '../common/actions';
import {
  removeToken,
  setToken,
} from '@shared/core/services/auth';
import {
  clearUser,
  setUser,
} from './actions';

export function* login({ payload, resolve, reject }) {
  try {
    const res = yield post(['ops/login'], payload);
    if (!res.user) throw new ErrorHandler(401, { message: res.message });
    setToken(res.user?.accessTokenAPI);
    yield put(
      setUser({
        ...res.user,
      })
    );
    resolve(res.user);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* logout({ resolve, reject }) {
  removeToken();
  yield put(
    clearUser()
  );
  resolve();
}

export function* getUserInfo({ resolve, reject }) {
  try {
    const res = yield get(['ops/me']);
    resolve(res.me);
    yield put(
      setUser({
        ...res.me,
      })
    );
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* changePassword({ payload, resolve, reject }) {
  try {
    const res = yield putApi(['ops/shared/change-password'], payload);
    if(!res.success) {
      throw new ErrorHandler(403, { message: res.message });
    }
    resolve(res);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* watchAuth() {
  yield all([takeLatest('LOGIN', login)]);
  yield all([takeLatest('CHANGE_PASSWORD', changePassword)]);
  yield all([takeLatest('LOGOUT', logout)]);
  yield all([takeLatest('GET_USER_INFO', getUserInfo)]);
}
