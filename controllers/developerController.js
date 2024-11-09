const { body, validationResult } = require("express-validator");
const { developers } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors");

const validateFormFileds = [
  body("developerName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Developer name must be between 1 and 255 characters."),

  body("developerLogoUrl")
    .trim()
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

const getEditFormViewData = async (developerId) => ({
  title: "Edit Developer",
  mainView: "addDeveloper",
  developer: await developers.getDeveloper(developerId),
});

exports.GET = async (req, res) => {
  const developer = await developers.getDeveloper(req.params.id);

  res.render("root", {
    title: `Developer: ${developer.name}`,
    mainView: "developer",
    developer: developer,
  });
};

exports.editGET = async (req, res) => {
  res.render("root", await getEditFormViewData(req.params.id));
};

exports.editPOST = [
  validateFormFileds,
  async (req, res) => {
    const developerId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const parsedErrors = parseValidationErrors(errors.array());

      res.status(400).render("root", {
        ...(await getEditFormViewData(developerId)),
        errors: parsedErrors,
      });
      return;
    }

    // if invalid id
    if (!(await developers.isValid(developerId))) {
      res.status(400).send("Error: Invalid developer Id");
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
  },
];
