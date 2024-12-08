const CustomAccessDeniedError = require("../errors/CustomAccessDeniedError.js");

exports.ALL = (req, res, next) => {
  const isAdmin = Boolean(req.signedCookies.isAdmin);

  if (!isAdmin) {
    throw new CustomAccessDeniedError(
      "You do not have permission to access this page.",
    );
  }
  next();
};
