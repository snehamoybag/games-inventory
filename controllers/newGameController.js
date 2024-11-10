const { body, validationResult } = require("express-validator");
const { games, categories, developers } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors");
const isValidUrl = require("../utils/isValidUrl");
const asyncHandler = require("express-async-handler");

const validateGameName = async (value) => {
  if (await games.isNameTaken(value)) {
    return Promise.reject(
      "Game name is already taken, Please try a different name.",
    );
  }
};

const validateImgUrl = (value) => {
  if (!isValidUrl(value)) {
    throw new Error("Invalid image url");
  }

  return true;
};

const validateFormFields = [
  body("gameName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Game name must be between 1 and 255 characters.")
    .custom(validateGameName),

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
    .withMessage("Logo url must be between 1 and 255 characters.")
    .custom(validateImgUrl),

  body("gameCoverImgUrl")
    .trim()
    .optional()
    .isLength({ max: 255 })
    .withMessage("Cover image url must not be more than 255 characters.")
    .custom(validateImgUrl),

  body("gameDetails")
    .trim()
    .isLength({ min: 30, max: 2000 })
    .withMessage("Game details must be between 30 and 2000 characters."),

  body("gamePrice")
    .trim()
    .isNumeric()
    .withMessage("Price must be number or decimal."),
];

const getViewData = async () => ({
  title: "Add New Game",
  mainView: "addGame",
  developers: await developers.getAll(),
  categories: await categories.getAll(),
});

exports.GET = asyncHandler(async (req, res) => {
  res.render("root", await getViewData());
});

exports.POST = [
  validateFormFields,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    // if validation error
    if (!errors.isEmpty()) {
      const viewData = await getViewData();
      const parsedErrors = parseValidationErrors(errors.array());

      res.status(400).render("root", { ...viewData, errors: parsedErrors });
      return;
    }

    const {
      gameName,
      gameLogoUrl,
      gameCoverImgUrl,
      gameDetails,
      gamePrice,
      gameCategories,
      gameDevelopers,
    } = req.body;

    await games.add(
      gameName,
      gameLogoUrl,
      gameCoverImgUrl,
      gameDetails,
      gamePrice,
      [...gameDevelopers], // to make sure we always dealing with an array
      [...gameCategories],
    );

    res.redirect("/");
  }),
];
