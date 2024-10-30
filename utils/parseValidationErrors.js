// parses validation errors from express-validator
// maps all the error msg to its path
// {path: msg, anotherPath: itsMsg}

exports.parseValidationErrors = (errors = []) => {
  return errors.reduce((parsedError, currentError) => {
    return {
      ...parsedError,
      [currentError.path]: currentError.msg,
    };
  }, {});
};
