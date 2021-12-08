import { put, takeLatest, all } from 'redux-saga/effects';
import { post, get } from '@shared/core/services/saga';
import { saveApiResponseError } from '../../common/actions';

export function* submitReview({ payload, resolve, reject }) {
  try {
    const res = yield post([`ops/user/milestone/${payload.id}/submit-review`], payload);
    resolve(res);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* updateNotes({ id, payload, resolve, reject }) {
  try {
    const res = yield post([`ops/user/milestone/${id}/note`], payload);
    resolve(res);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* getJobDetailForUser({ payload, resolve, reject }) {
  try {
    const res = yield get([`ops/user/milestone/${payload.id}`]);
    resolve(res.milestone, res?.previous_check_list);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* watchPA() {
  yield all([takeLatest('UPDATE_NOTES', updateNotes)]);
  yield all([takeLatest('SUBMIT_REVIEW', submitReview)]);
  yield all([takeLatest('GET_JOB_DETAIL_FOR_USER', getJobDetailForUser)]);
}
