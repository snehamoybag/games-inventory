const { body, validationResult } = require("express-validator");

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

exports.GET = (req, res) => {
  res.render("addCategory", {});
};

exports.POST = [
  validateFormFields,
  (req, res) => {
    console.log("category post");
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      res.redirect("/");
      return;
    }

    res.status(400).render("addCategory", { errors: errors.array() });
  },
];
