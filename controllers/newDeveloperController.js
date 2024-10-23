const { body, validationResult } = require("express-validator");

const validateFormFileds = [
  body("developerName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Developer name must be between 1 and 255 characters."),

  body("developerLogoUrl")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Logo url must be between 1 and 255 characters."),

  body("developerCoverImgUrl")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Cover image url must be between 1 and 255 charactes."),

  body("developerDetails")
    .trim()
    .isLength({ min: 30, max: 2000 })
    .withMessage("Details must be between 30 and 2000 characters."),
];

exports.GET = (req, res) => {
  res.render("addDeveloper", {});
};

exports.POST = [
  validateFormFileds,
  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      res.redirect("/");
      return;
    }

    res.status(400).render("addDeveloper", { errors: errors.array() });
  },
];
