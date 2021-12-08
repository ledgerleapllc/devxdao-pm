import { put, takeLatest, all, delay, debounce } from 'redux-saga/effects';
import { get, post, ErrorHandler } from '@shared/core/services/saga';
import { saveApiResponseError } from '../../common/actions';
import qs from 'qs';

export function* addPA({ payload, resolve, reject }) {
  try {
    const res = yield post([`ops/admin/users/create-pa-user`], payload);
    if (!res.success) throw new ErrorHandler(400, { message: res.message }); 
    resolve(res);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* getUsers({ payload, user, resolve, reject }) {
  try {
    const query = qs.stringify(payload, { skipNulls: true });
    let res;
    if (user.is_super_admin) {
      res = yield get([`ops/admin/users?${query}`]);
    } else {
      res = yield get([`ops/user/all?${query}`]);
    }
    yield delay(500); // => this need for scroll loadmore.
    resolve(res.users, !res.finished);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* getPAs({ payload, resolve, reject }) {
  try {
    const query = qs.stringify({ limit: 9999, ...payload }, { skipNulls: true });
    const res = yield get([`ops/admin/users-pa?${query}`]);
    const temp = res.users.map(x => ({
      label: x.email,
      value: x.id
    }))
    resolve(temp);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* getJobDetailForAdmin({ payload, resolve, reject }) {
  try {
    const res = yield get([`ops/admin/milestone/${payload.id}`]);
    resolve(res.milestone, res?.previous_check_list);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* getJobs({ payload, resolve, reject }) {
  try {
    const query = qs.stringify(payload, { skipNulls: true });
    const res = yield get([`ops/admin/milestone-job?${query}`]);
    yield delay(500); // => this need for scroll loadmore.
    resolve(res.milestones, !res.finished);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* getAssignedJobs({ payload, resolve, reject }) {
  try {
    const { role, ...params } = payload;
    const query = qs.stringify(params, { skipNulls: true });
    let path;
    if (role === 'program assistant') {
      path = 'ops/user/milestone-job';
    } else {
      path = 'ops/admin/milestone-assigned';
    }
    const res = yield get([`${path}?${query}`]);
    yield delay(500); // => this need for scroll loadmore.
    resolve(res.milestones, !res.finished);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* revokePA({ payload, resolve, reject }) {
  try {
    const res = yield post([`ops/admin/users/${payload.id}/revoke`]);
    resolve(res);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* activatePA({ payload, resolve, reject }) {
  try {
    const res = yield post([`ops/admin/users/${payload.id}/undo-revoke`]);
    resolve(res);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* resetPassword({ payload, resolve, reject }) {
  try {
    const res = yield post([`ops/admin/users/${payload.id}/reset-password`], payload);
    resolve(res);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* assignPA({ payload, resolve, reject }) {
  try {
    const res = yield post([`ops/admin/milestone/${payload.id}/assign`], payload);
    resolve(res);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* unassignPA({ payload, resolve, reject }) {
  try {
    const res = yield post([`ops/admin/milestone/${payload.id}/unassign`]);
    resolve(res);
  } catch (error) {
    reject(error);
    yield put(saveApiResponseError(error));
  }
}

export function* watchAdmin() {
  yield all([takeLatest('ADD_PA', addPA)]);
  yield all([takeLatest('GET_JOB_DETAIL_FOR_ADMIN', getJobDetailForAdmin)]);
  yield all([takeLatest('ASSIGN_PA', assignPA)]);
  yield all([takeLatest('GET_PAS', getPAs)]);
  yield all([debounce(1000, 'GET_USERS', getUsers)]);
  yield all([debounce(1000, 'GET_JOBS', getJobs)]);
  yield all([debounce(1000, 'GET_ASSIGNED_JOBS_1', getAssignedJobs)]);
  yield all([debounce(1000, 'GET_ASSIGNED_JOBS_2', getAssignedJobs)]);
  yield all([takeLatest('REVOKE_PA', revokePA)]);
  yield all([takeLatest('RESET_PASSWORD', resetPassword)]);
  yield all([takeLatest('ACTIVATE_PA', activatePA)]);
  yield all([takeLatest('UNASSIGN_PA', unassignPA)]);
}
