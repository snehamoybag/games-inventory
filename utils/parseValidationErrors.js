// parses validation errors from express-validator
// maps all the error msg to its path
// {path: msg, anotherPath: itsMsg}
// if a path has multiple errors return only the first one

const parseValidationErrors = (errors = []) => {
  return errors.reduce((parsedErrors, currentError) => {
    return {
      [currentError.path]: currentError.msg,
      ...parsedErrors,
    };
  }, {});
};

module.exports = parseValidationErrors;
