const { body, validationResult } = require("express-validator");
const { categories } = require("../db/queries");
const { parseValidationErrors } = require("../utils/parseValidationErrors");

const validateCategoryName = async (value) => {
  if (await categories.isNameTaken(value)) {
    return Promise.reject("Category already exists, please enter a new one.");
  }
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
    .withMessage("Icon url must be between 1 and 255 characters."),
];

const getViewData = async (categoryId) => ({
  title: "Edit Category",
  mainView: "addCategory",
  fieldValues: await categories.getCategory(categoryId),
});

exports.GET = (req, res) => {
  res.send(`Category ID: ${req.params.id}`);
};

exports.deletePOST = async (req, res) => {
  const categoryId = req.params.id;

  if (!(await categories.isValid(categoryId))) {
    res.status(400).send("Error: Category does not exist.");
    return;
  }

  await categories.delete(categoryId);
  res.redirect("/");
};

exports.editGET = async (req, res) => {
  res.render("root", await getViewData(req.params.id));
};

exports.editPOST = [
  validateFormFields,
  async (req, res) => {
    const categoryId = req.params.id;

    // if field is not valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const viewData = await getViewData(categoryId);
      const parsedErrors = parseValidationErrors(errors.array());

      res.status(400).render("root", { ...viewData, errors: parsedErrors });
      return;
    }

    // if id is invalid
    if (!(await categories.isValid(categoryId))) {
      res.status(400).send("Error: invalid category ID");
      return;
    }

    const { categoryName, categoryIconUrl } = req.body;
    await categories.edit(categoryId, categoryName, categoryIconUrl);

    res.redirect("/");
  },
];
