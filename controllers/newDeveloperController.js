const { body, validationResult } = require("express-validator");
const { developers } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors");
const asyncHandler = require("express-async-handler");
const isValidUrl = require("../utils/isValidUrl");

const validateDeveloperName = async (value) => {
  if (await developers.isNameTaken(value)) {
    return Promise.reject("Developer already exists, please enter a new one.");
  }
};

const validateImgUrl = (url) => {
  // since dev logo and cover image are optional,
  //we want to ignore testing url when it is empty/not provied by the user
  if (!url) return true;

  if (!isValidUrl(url)) {
    throw new Error("Invalid image url");
  }

  return true;
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
    .withMessage("Logo url must be between 1 and 255 characters.")
    .custom(validateImgUrl),

  body("developerCoverImgUrl")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Cover image url must be between 1 and 255 charactes.")
    .custom(validateImgUrl),

  body("developerDetails")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Details must be between 30 and 2000 characters."),
];

const viewData = {
  title: "Resgister New Developer",
  mainView: "addDeveloper",
  styles: "add-developer",
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
