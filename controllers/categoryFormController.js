const { body, validationResult } = require("express-validator");
const { categories } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors.js");
const asyncHandler = require("express-async-handler");
const isValidUrl = require("../utils/isValidUrl.js");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");
const CustomBadRequestError = require("../errors/CustomBadRequestError.js");

const validateCategoryNameTaken = async (value) => {
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

const validateCategoryNameChain = () =>
  body("categoryName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Category name must be between 1 and 255 characters.");

const validateIconUrlChain = () =>
  body("categoryIconUrl")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Icon url must be between 1 and 255 characters.")
    .custom(validateIconUrl);

const validateNewCategoryForm = [
  validateCategoryNameChain().custom(validateCategoryNameTaken),
  validateIconUrlChain(),
];

const validateEditCategoryForm = [
  validateCategoryNameChain(),
  validateIconUrlChain(),
];

const getFieldValues = (id, name, iconUrl) => ({
  categoryId: id,
  categoryName: name,
  categoryIconUrl: iconUrl,
});

const getViewData = (title, fieldValues, errors, isEditMode = false) => ({
  title,
  fieldValues,
  errors,
  isEditMode,
  mainView: "categoryForm",
  styles: "add-category",
});

exports.newGET = asyncHandler((req, res) => {
  res.render("root", getViewData("Add New Category"));
});

exports.newPOST = [
  validateNewCategoryForm,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    // if no validation error
    if (errors.isEmpty()) {
      const { categoryName, categoryIconUrl } = req.body;

      await categories.add(categoryName, categoryIconUrl);
      res.redirect("/success/add/category");
      return;
    }

    // if validation error
    const parsedErrors = parseValidationErrors(errors.array());
    const fieldValues = req.body;

    res
      .status(400)
      .render(
        "root",
        getViewData("Add New Category", fieldValues, parsedErrors),
      );
  }),
];

exports.editGET = asyncHandler(async (req, res) => {
  const categoryId = Number(req.params.id);

  if (isNaN(categoryId)) {
    throw new CustomNotFoundError("Category not found.");
  }

  const category = await categories.getCategory(categoryId);

  if (!category) {
    throw new CustomNotFoundError("Category not found.");
  }

  const fieldValues = getFieldValues(
    category.id,
    category.name,
    category.icon_url,
  );

  res.render("root", getViewData("Edit Category", fieldValues, null, true));
});

exports.editPOST = [
  validateEditCategoryForm,
  asyncHandler(async (req, res) => {
    const categoryId = Number(req.params.id);

    if (isNaN(categoryId)) {
      throw new CustomBadRequestError("Invalid category ID.");
    }

    const category = await categories.getCategory(categoryId);

    if (!category) {
      throw new CustomNotFoundError("Category not found.");
    }

    const errors = validationResult(req);

    // if no validation error
    if (errors.isEmpty()) {
      const { categoryName, categoryIconUrl } = req.body;

      await categories.edit(categoryId, categoryName, categoryIconUrl);
      res.redirect("/success/edit/category");
      return;
    }

    // if validation error
    const parsedErrors = parseValidationErrors(errors.array());
    const fieldValues = getFieldValues(
      categoryId,
      req.body.categoryName,
      req.body.categoryIconUrl,
    );

    res
      .status(400)
      .render(
        "root",
        getViewData("Edit New Category", fieldValues, parsedErrors, true),
      );
  }),
];

exports.deletePOST = asyncHandler(async (req, res) => {
  const categoryId = Number(req.params.id);

  if (isNaN(categoryId)) {
    throw new CustomBadRequestError("Invalid category ID");
  }

  const category = await categories.getCategory(categoryId);

  if (!category) {
    throw new CustomNotFoundError("Category not found.");
  }

  await categories.delete(categoryId);
  res.redirect("/success/delete/category");
});
