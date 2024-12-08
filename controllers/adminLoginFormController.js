require("dotenv").config();
const { body, validationResult } = require("express-validator");
const parseValidationErrors = require("../utils/parseValidationErrors.js");

const validateAdminPassword = (userInput) => {
  if (userInput !== process.env.SITE_ADMIN_PASSWORD) {
    throw new Error("Wrong password.");
  }

  return true;
};

const validateFormFields = [
  body("adminPassword")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8 to 32 characters.")
    .custom(validateAdminPassword),
];

const getViewData = (fieldValues, errors) => ({
  title: "Admin Login",
  fieldValues,
  errors,
  mainView: "adminLogin",
  styles: "admin-login",
});

exports.adminGET = (req, res) => {
  res.render("root", getViewData());
};

exports.adminPOST = [
  validateFormFields,
  (req, res) => {
    const errors = validationResult(req);

    // if no validation error
    if (errors.isEmpty()) {
      const cookieExpiryDate = new Date(Date.now() + 86_400_000); // 86,400,000 milisecoconds = 24hrs

      res.cookie("isAdmin", true, {
        maxAge: cookieExpiryDate,
        secure: true,
        httpOnly: true,
        signed: true,
      });
      res.redirect("/success/login");
      return;
    }

    // if validation error
    const parsedErrors = parseValidationErrors(errors.array());
    const fieldValues = req.body;

    res.status(400).render("root", getViewData(fieldValues, parsedErrors));
  },
];
