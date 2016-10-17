(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.reduxCreateApiActionCreator = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var requested = function requested(actionName, action) {
    return _extends({}, action, {
      type: actionName + "Requested",
      isRequest: true
    });
  };

  var responded = function responded(actionName, action) {
    return function (payload) {
      return _extends({}, action, {
        type: "" + actionName,
        payload: payload,
        isResponse: true
      });
    };
  };

  var failed = function failed(actionName, action) {
    return function (error) {
      return _extends({}, action, {
        type: actionName + "Failed",
        error: error.payload,
        message: error.message,
        isResponse: true,
        isError: true
      });
    };
  };

  exports.default = function (actionName, apiHandler) {
    var responseHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (v) {
      return v;
    };
    return function (action) {
      return function (dispatch) {
        dispatch(requested(actionName, action));
        return apiHandler(action).then(function (payload) {
          return dispatch(responded(actionName, action)(responseHandler(payload)));
        }).catch(function (error) {
          dispatch(failed(actionName, action)(error));
          throw error;
        });
      };
    };
  };
});
