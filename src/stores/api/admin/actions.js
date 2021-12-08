export const addPA = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'ADD_PA',
  payload,
  resolve, 
  reject,
});

export const getUsers = (payload, user, resolve = () => {}, reject = () => {}) => ({
  type: 'GET_USERS',
  payload,
  user,
  resolve, 
  reject,
});


export const getPAs = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'GET_PAS',
  payload,
  resolve, 
  reject,
});

export const getJobs = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'GET_JOBS',
  payload,
  resolve, 
  reject,
});

export const getJobDetailForAdmin = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'GET_JOB_DETAIL_FOR_ADMIN',
  payload,
  resolve, 
  reject,
});

export const assignPA = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'ASSIGN_PA',
  payload,
  resolve, 
  reject,
});

export const getAssignedJobs1 = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'GET_ASSIGNED_JOBS_1',
  payload,
  resolve, 
  reject,
});

export const getAssignedJobs2 = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'GET_ASSIGNED_JOBS_2',
  payload,
  resolve, 
  reject,
});

export const revokePA = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'REVOKE_PA',
  payload,
  resolve, 
  reject,
});

export const activatePA = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'ACTIVATE_PA',
  payload,
  resolve, 
  reject,
});

export const resetPassword = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'RESET_PASSWORD',
  payload,
  resolve, 
  reject,
});

export const unassignPA = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'UNASSIGN_PA',
  payload,
  resolve, 
  reject,
});