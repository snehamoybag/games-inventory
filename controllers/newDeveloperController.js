const { body, validationResult } = require("express-validator");
const { categories, developers } = require("../db/queries");
const { parseValidationErrors } = require("../utils/parseValidationErrors");

const validateDeveloperName = async (value) => {
  if (await developers.isNameTaken(value)) {
    return Promise.reject("Developer already exists, please enter a new one.");
  }
};

const validateFormFileds = [
  body("developerName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Developer name must be between 1 and 255 characters.")
    .custom(validateDeveloperName),

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

const getViewData = async () => ({
  title: "Resgister New Developer",
  mainView: "addDeveloper",
  categories: await categories.getAll(),
});

exports.GET = async (req, res) => {
  res.render("root", await getViewData());
};

exports.POST = [
  validateFormFileds,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const viewData = await getViewData();
      const parsedErrors = parseValidationErrors(errors.array());

      res.status(400).render("root", { ...viewData, errors: parsedErrors });
      return;
    }

    const {
      developerName,
      developerDetails,
      developerLogoUrl,
      developerCoverImgUrl,
    } = req.body;

    await developers.add(
      developerName,
      developerDetails,
      developerLogoUrl,
      developerCoverImgUrl,
    );

    res.redirect("/");
  },
];
