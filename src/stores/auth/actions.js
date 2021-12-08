export const login = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'LOGIN',
  payload,
  resolve,
  reject,
});

export const getUserInfo = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'GET_USER_INFO',
  payload,
  resolve,
  reject,
});

export const changePassword = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'CHANGE_PASSWORD',
  payload,
  resolve,
  reject,
});

export const logout = (resolve = () => {}, reject = () => {}) => ({
  type: 'LOGOUT',
  resolve,
  reject,
});

export const setUser = payload => ({
  type: 'SET_USER',
  payload,
});

export const updateUser = payload => ({
  type: 'UPDATE_USER',
  payload,
});

export const clearUser = () => ({
  type: 'CLEAR_USER',
});
