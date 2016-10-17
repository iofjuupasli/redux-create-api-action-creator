const requested = (actionName, action) => ({
  ...action,
  type: `${actionName}Requested`,
  isRequest: true,
});

const responded = (actionName, action) => payload => ({
  ...action,
  type: `${actionName}`,
  payload,
  isResponse: true,
});

const failed = (actionName, action) => error => ({
  ...action,
  type: `${actionName}Failed`,
  error: error.payload,
  message: error.message,
  isResponse: true,
  isError: true,
});

export default (actionName, apiHandler, responseHandler = v => v) => action => (dispatch) => {
  dispatch(requested(actionName, action));
  return apiHandler(action)
    .then(payload => dispatch(responded(actionName, action)(responseHandler(payload))))
    .catch((error) => {
      dispatch(failed(actionName, action)(error));
      throw error;
    });
};
