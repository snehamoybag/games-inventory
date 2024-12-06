const { body, validationResult } = require("express-validator");
const { developers, games } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors");
const asyncHandler = require("express-async-handler");
const isValidUrl = require("../utils/isValidUrl");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const CustomBadRequestError = require("../errors/CustomBadRequestError");

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

const validateDeveloperNameChain = () =>
  body("developerName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Developer name must be between 1 and 255 characters.");

const validateDeveloperLogoUrlChain = () =>
  body("developerLogoUrl")
    .trim()
    .optional()
    .isLength({ max: 255 })
    .withMessage("Logo url must be between 1 and 255 characters.")
    .custom(validateImgUrl);

const validateDeveloperCoverimgUrlChain = () =>
  body("developerCoverimgUrl")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Cover image url must be between 1 and 255 charactes.")
    .custom(validateImgUrl);

const validateDeveloperDetailsChain = () =>
  body("developerDetails")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Details must be between 30 and 2000 characters.");

const validateNewDeveloperForm = [
  validateDeveloperNameChain().custom(validateDeveloperName),
  validateDeveloperLogoUrlChain(),
  validateDeveloperCoverimgUrlChain(),
  validateDeveloperDetailsChain(),
];

const validateEditDeveloperForm = [
  validateDeveloperNameChain(),
  validateDeveloperLogoUrlChain(),
  validateDeveloperCoverimgUrlChain(),
  validateDeveloperDetailsChain(),
];

const getViewData = (title, fieldValues, errors, isEditMode = false) => ({
  title,
  fieldValues,
  errors,
  isEditMode,
  mainView: "developerForm",
  styles: "add-developer",
});

exports.newGET = asyncHandler((req, res) => {
  res.render("root", getViewData("Register New Developer"));
});

exports.newPOST = [
  validateNewDeveloperForm,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    // if no validation error
    if (errors.isEmpty()) {
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
      return;
    }

    // if validation error
    const parsedErrors = parseValidationErrors(errors.array());
    const fieldValues = req.body;

    res
      .status(400)
      .render(
        "root",
        getViewData("Register New Developer", fieldValues, parsedErrors),
      );
  }),
];

exports.editGET = asyncHandler(async (req, res) => {
  const developerId = Number(req.params.id);

  if (isNaN(developerId)) {
    throw new CustomNotFoundError("Developer not found.");
  }

  const developer = await developers.getDeveloper(developerId);

  if (!developer) {
    throw new CustomNotFoundError("Developer not found.");
  }

  const fieldValues = {
    developerId: developerId,
    developerName: developer.name,
    developerDetails: developer.details,
    developerLogoUrl: developer.logo_url,
    developerCoverimgUrl: developer.coverimg_url,
  };

  res.render("root", getViewData("Edit Developer", fieldValues, null, true));
});

exports.editPOST = [
  validateEditDeveloperForm,
  asyncHandler(async (req, res) => {
    const developerId = Number(req.params.id);

    if (isNaN(developerId)) {
      throw new CustomBadRequestError("Invalid post url.");
    }

    const developer = await developers.getDeveloper(developerId);

    if (!developer) {
      throw new CustomNotFoundError("Developer not found.");
    }

    const errors = validationResult(req);

    // if no validation errors
    if (errors.isEmpty()) {
      const {
        developerName,
        developerDetails,
        developerLogoUrl,
        developerCoverimgUrl,
      } = req.body;

      await developers.edit(
        developerId,
        developerName,
        developerLogoUrl,
        developerCoverimgUrl,
        developerDetails,
      );

      res.redirect(`/developer/${req.params.id}`);
      return;
    }

    // if validation errors
    const parsedErrors = parseValidationErrors(errors.array());
    const fieldValues = { developerId: developerId, ...req.body };

    res.render(
      "root",
      getViewData("Edit Developer", fieldValues, parsedErrors, true),
    );
  }),
];

exports.deletePOST = asyncHandler(async (req, res) => {
  const developerId = req.params.id;
  const developer = await developers.getDeveloper(developerId);

  if (!developer) {
    throw new CustomBadRequestError(`Invalid developer ID: ${developerId}`);
  }

  const gamesByDeveloper = await games.getByDeveloper(developerId, 1, 0);

  if (gamesByDeveloper.length) {
    throw new CustomBadRequestError(
      "Please delete all the games published by the developer first before attempting to delete the developer.",
    );
  }

  await developers.delete(developerId);
  res.redirect("/success/delete/developer");
});
