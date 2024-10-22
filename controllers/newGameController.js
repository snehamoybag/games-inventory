const { body, validationResult } = require("express-validator");

const validateFormFields = [
  body("gameName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Game name must be between 1 and 255 characters."),

  body("gameDevelopers")
    .trim()
    .notEmpty()
    .withMessage("Developer cannot be empty.")
    .isLength({ max: 2000 })
    .withMessage("Developers must be lesser than 2000 characters."),

  body("gameCategories")
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty."),

  body("gameLogoUrl")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Logo url must be between 1 and 255 characters."),

  body("gameCoverImgUrl")
    .trim()
    .optional()
    .isLength({ max: 255 })
    .withMessage("Cover image url must not be more than 255 characters."),

  body("gameDetails")
    .trim()
    .isLength({ min: 30, max: 2000 })
    .withMessage("Game details must be between 30 and 2000 characters."),

  body("gamePrice")
    .trim()
    .isNumeric()
    .withMessage("Price must be number or decimal."),
];

exports.GET = (req, res) => {
  res.render("addGame", {});
};

exports.POST = [
  validateFormFields,
  (req, res) => {
    const errors = validationResult(req);

    // if no errors
    if (errors.isEmpty()) {
      res.redirect("/");
      return;
    }

    // if errors
    res.status(400).render("addGame", { errors: errors.array() });
  },
];
