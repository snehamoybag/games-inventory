const { body, validationResult } = require("express-validator");
const { games, categories, developers } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors");
const isValidUrl = require("../utils/isValidUrl.js");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");
const CustomBadRequestError = require("../errors/CustomBadRequestError.js");

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
    .isLength({ min: 7, max: 255 })
    .withMessage("Logo url must be between 7 and 255 characters.")
    .custom(validateImgUrl),

  body("gameCoverImgUrl")
    .trim()
    .isLength({ min: 7, max: 255 })
    .withMessage("Cover image url must be between 7 and 255 characters.")
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

exports.GET = asyncHandler(async (req, res) => {
  const gameId = req.params.id;
  const game = await games.getGame(gameId);

  if (!game) {
    throw new CustomNotFoundError("Game not found.");
  }

  res.render("root", {
    title: game.name,
    mainView: "game",
    game: game,
    gameDevelopers: await developers.getByGame(gameId),
    gameCategories: await categories.getByGame(gameId),
    styles: "game",
  });
});

const getEditViewData = async (gameId) => ({
  title: "Edit Game",
  mainView: "addGame",
  developers: await developers.getAll(),
  categories: await categories.getAll(),
  fieldValues: {
    game: await games.getGame(gameId),
    selectedDevelopers: await developers.getByGame(gameId),
    selectedCategories: await categories.getByGame(gameId),
  },
  styles: "add-game",
});

exports.editGET = asyncHandler(async (req, res) => {
  const gameId = req.params.id;
  const game = await games.getGame(gameId);

  if (!game) {
    throw new CustomNotFoundError("Game not found.");
  }

  res.render("root", await getEditViewData(gameId));
});

exports.editPOST = [
  validateFormFields,
  asyncHandler(async (req, res) => {
    const gameId = req.params.id;
    const game = await games.getGame(gameId);

    // if id is invalid
    if (!game) {
      throw new CustomBadRequestError(`Cannot post on ${req.originalUrl}`);
    }

    // if validation error
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const viewData = await getEditViewData(gameId);
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

    await games.edit(
      gameId,
      gameName,
      gameLogoUrl,
      gameCoverImgUrl,
      gameDetails,
      gamePrice,
      [...gameDevelopers], // to make sure we are always dealing with arrays
      [...gameCategories],
    );

    res.redirect(`/game/${gameId}`);
  }),
];

exports.deletePOST = asyncHandler(async (req, res) => {
  const gameId = req.params.id;
  const game = await games.getGame(gameId);

  if (!game) {
    throw new CustomBadRequestError(`Invalid game ID: ${gameId}`);
  }

  await games.delete(gameId);
  res.redirect("/success/delete/game");
});
