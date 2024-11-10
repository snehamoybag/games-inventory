const { body, validationResult } = require("express-validator");
const { developers } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors");
const asyncHandler = require("express-async-handler");

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
    .optional()
    .isLength({ max: 255 })
    .withMessage("Logo url must be between 1 and 255 characters."),

  body("developerCoverImgUrl")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Cover image url must be between 1 and 255 charactes."),

  body("developerDetails")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Details must be between 30 and 2000 characters."),
];

const viewData = {
  title: "Resgister New Developer",
  mainView: "addDeveloper",
};

exports.GET = asyncHandler((req, res) => {
  res.render("root", viewData);
});

exports.POST = [
  validateFormFileds,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
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

    const developer = await developers.getByName(developerName);

    res.redirect(`/developer/${developer.id}`);
  }),
];
