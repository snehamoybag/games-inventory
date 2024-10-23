const { body, validationResult } = require("express-validator");
const { categories } = require("../db/queries");

const validateFormFields = [
  body("categoryName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Category name must be between 1 and 255 characters."),

  body("categoryIconUrl")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Icon url must be between 1 and 255 characters."),
];

const getViewData = async () => ({
  title: "Add New Category",
  mainView: "addCategory",
  categories: await categories.getAll(),
});

exports.GET = async (req, res) => {
  res.render("root", await getViewData());
};

exports.POST = [
  validateFormFields,
  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      res.redirect("/");
      return;
    }

    const viewData = await getViewData();
    res.status(400).render("root", { ...viewData, errors: errors.array() });
  },
];
