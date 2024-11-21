const { body, validationResult } = require("express-validator");
const { games, developers } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors");
const asyncHandler = require("express-async-handler");
const isValidUrl = require("../utils/isValidUrl");
const CustomBadRequestError = require("../errors/CustomBadRequestError");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

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
    .withMessage("Developer name must be between 1 and 255 characters."),

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

const getEditFormViewData = async (developer = {}) => ({
  title: "Edit Developer",
  mainView: "addDeveloper",
  developer: developer,
  styles: "add-developer",
});

exports.GET = asyncHandler(async (req, res) => {
  const developerId = req.params.id;
  const developer = await developers.getDeveloper(developerId);

  if (!developer) {
    throw new CustomNotFoundError("Developer not found.");
  }

  const gamesByDeveloper = await games.getByDeveloper(developerId);

  res.render("root", {
    title: `Developer: ${developer.name}`,
    mainView: "developer",
    developer: developer,
    games: gamesByDeveloper,
    styles: "developer",
  });
});

exports.editGET = asyncHandler(async (req, res) => {
  const developerId = req.params.id;
  const developer = await developers.getDeveloper(developerId);

  if (!developer) {
    throw new CustomNotFoundError("Developer not found.");
  }

  res.render("root", await getEditFormViewData(developer));
});

exports.editPOST = [
  validateFormFileds,
  asyncHandler(async (req, res) => {
    const developerId = req.params.id;
    const developer = await developers.getDeveloper(developerId);

    // if invalid id
    if (!developer) {
      throw new CustomBadRequestError(`Cannot post on ${req.originalUrl}`);
    }

    // if validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const parsedErrors = parseValidationErrors(errors.array());

      res.status(400).render("root", {
        ...(await getEditFormViewData(developer)),
        errors: parsedErrors,
      });
      return;
    }

    const {
      developerName,
      developerDetails,
      developerLogoUrl,
      developerCoverImgUrl,
    } = req.body;

    await developers.edit(
      developerId,
      developerName,
      developerLogoUrl,
      developerCoverImgUrl,
      developerDetails,
    );

    res.redirect(`/developer/${req.params.id}`);
  }),
];

exports.deletePOST = asyncHandler(async (req, res) => {
  const developerId = req.params.id;
  const developer = await developers.getDeveloper(developerId);

  if (!developer) {
    throw new CustomBadRequestError(`Invalid developer ID: ${developerId}`);
  }

  const gamesByDeveloper = await games.getByDeveloper(developerId);

  if (gamesByDeveloper.length) {
    throw new CustomBadRequestError(
      "Please delete all the games published by the developer first before attempting to delete the developer.",
    );
  }

  await developers.delete(developerId);
  res.redirect("/");
});
