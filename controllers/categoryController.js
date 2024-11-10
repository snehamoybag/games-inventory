const { body, validationResult } = require("express-validator");
const { categories } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors");
const asyncHandler = require("express-async-handler");
const CustomBadRequestError = require("../errors/CustomBadRequestError.js");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");

const validateFormFields = [
  body("categoryName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Category name must be between 1 and 255 characters."),

  body("categoryIconUrl")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Icon url must be between 1 and 255 characters."),
];

const getViewData = async (category = {}) => ({
  title: "Edit Category",
  mainView: "addCategory",
  fieldValues: category,
});

exports.GET = asyncHandler((req, res) => {
  res.send(`Category ID: ${req.params.id}`);
});

exports.deletePOST = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const category = await categories.getCategory(categoryId);

  if (!category) {
    throw new CustomBadRequestError(`Invalid category ID: ${categoryId}`);
  }

  await categories.delete(categoryId);
  res.redirect("/");
});

exports.editGET = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const category = await categories.getCategory(categoryId);

  if (!category) {
    throw new CustomNotFoundError("Category not found.");
  }

  res.render("root", await getViewData(req.params.id));
});

exports.editPOST = [
  validateFormFields,
  asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await categories.getCategory(categoryId);

    // if id is invalid
    if (!category) {
      throw new CustomBadRequestError(`Cannot post on ${req.originalUrl}`);
    }

    // if field is not valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const viewData = await getViewData(category);
      const parsedErrors = parseValidationErrors(errors.array());

      res.status(400).render("root", { ...viewData, errors: parsedErrors });
      return;
    }

    const { categoryName, categoryIconUrl } = req.body;
    await categories.edit(categoryId, categoryName, categoryIconUrl);

    res.redirect("/");
  }),
];
