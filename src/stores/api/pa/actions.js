export const submitReview = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'SUBMIT_REVIEW',
  payload,
  resolve, 
  reject,
});

export const updateNotes = (id, payload, resolve = () => {}, reject = () => {}) => ({
  type: 'UPDATE_NOTES',
  id,
  payload,
  resolve, 
  reject,
});

export const getJobDetailForUser = (payload, resolve = () => {}, reject = () => {}) => ({
  type: 'GET_JOB_DETAIL_FOR_USER',
  payload,
  resolve, 
  reject,
});
