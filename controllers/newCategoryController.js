const { body, validationResult } = require("express-validator");
const { categories } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors.js");
const asyncHandler = require("express-async-handler");
const isValidUrl = require("../utils/isValidUrl.js");

const validateCategoryName = async (value) => {
  if (await categories.isNameTaken(value)) {
    return Promise.reject("Category already exists, please enter a new one.");
  }
};

const validateIconUrl = (url) => {
  // since icon url is optional,
  //we want to ignore testing url when it is empty/not provied by the user
  if (!url) return true;

  if (!isValidUrl(url)) {
    throw new Error("Invalid icon url");
  }

  return true;
};

const validateFormFields = [
  body("categoryName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Category name must be between 1 and 255 characters.")
    .custom(validateCategoryName),

  body("categoryIconUrl")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Icon url must be between 1 and 255 characters.")
    .custom(validateIconUrl),
];

const viewData = {
  title: "Add New Category",
  mainView: "addCategory",
  styles: "add-category",
};

exports.GET = asyncHandler((req, res) => {
  res.render("root", viewData);
});

exports.POST = [
  validateFormFields,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const parsedErrors = parseValidationErrors(errors.array());

      res.status(400).render("root", { ...viewData, errors: parsedErrors });
      return;
    }

    const { categoryName, categoryIconUrl } = req.body;

    await categories.add(categoryName, categoryIconUrl);
    res.redirect("/");
  }),
];
