const { body, validationResult } = require("express-validator");
const { games, categories, developers } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors");
const isValidUrl = require("../utils/isValidUrl");
const asyncHandler = require("express-async-handler");
const CustomBadRequestError = require("../errors/CustomBadRequestError");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

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

const validateGameNameChain = () =>
  body("gameName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Game name must be between 1 and 255 characters.");

const validateGameDevelopersChain = () =>
  body("gameDevelopers")
    .trim()
    .notEmpty()
    .withMessage("Developer cannot be empty.")
    .isLength({ max: 2000 })
    .withMessage("Developers must be lesser than 2000 characters.");

const validateGameCategoriesChain = () =>
  body("gameCategories")
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty.");

const validateGameLogoUrlChain = () =>
  body("gameLogoUrl")
    .trim()
    .isLength({ min: 7, max: 255 })
    .withMessage("Logo url must be between 7 and 255 characters.")
    .custom(validateImgUrl);

const validateGameCoverimgUrlChain = () =>
  body("gameCoverImgUrl")
    .trim()
    .isLength({ min: 7, max: 255 })
    .withMessage("Cover image url must be between 7 and 255 characters.")
    .custom(validateImgUrl);

const validateGameDetailsChain = () =>
  body("gameDetails")
    .trim()
    .isLength({ min: 30, max: 2000 })
    .withMessage("Game details must be between 30 and 2000 characters.");

const validateGamePriceChain = () =>
  body("gamePrice")
    .trim()
    .isNumeric()
    .withMessage("Price must be number or decimal.");

const validateNewGameForm = [
  validateGameNameChain().custom(validateGameName),
  validateGameDevelopersChain(),
  validateGameCategoriesChain(),
  validateGameDetailsChain(),
  validateGamePriceChain(),
  validateGameLogoUrlChain(),
  validateGameCoverimgUrlChain(),
];

const validateEditGameForm = [
  validateGameNameChain(),
  validateGameDevelopersChain(),
  validateGameCategoriesChain(),
  validateGameDetailsChain(),
  validateGamePriceChain(),
  validateGameLogoUrlChain(),
  validateGameCoverimgUrlChain(),
];

const getViewData = async (title, fieldValues, errors, isEditMode = false) => ({
  title,
  developers: await developers.getAll(),
  categories: await categories.getAll(),
  fieldValues,
  errors,
  isEditMode,
  mainView: "gameForm",
  styles: "add-game",
});

exports.newGET = asyncHandler(async (req, res) => {
  res.render("root", await getViewData("Add New Game"));
});

exports.newPOST = [
  validateNewGameForm,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    // if no validation error
    if (errors.isEmpty()) {
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
        [...gameDevelopers], // to make sure we are always dealing with an array
        [...gameCategories],
      );

      res.redirect("/success/add/game");
      return;
    }

    // if validation error
    const parsedErrors = parseValidationErrors(errors.array());
    const fieldValues = {
      ...req.body,
      gameCategories: [...req.body.gameCategories], // making sure we are always dealing with an array
      gameDevelopers: [...req.body.gameDevelopers],
    };

    const viewData = await getViewData(
      "Add New Game",
      fieldValues,
      parsedErrors,
    );

    res.status(400).render("root", viewData);
  }),
];

exports.editGET = asyncHandler(async (req, res) => {
  const gameId = Number(req.params.id);

  if (isNaN(gameId)) {
    throw new CustomBadRequestError("Invalid game ID.");
  }

  const game = await games.getGame(gameId);

  if (!game) {
    throw new CustomNotFoundError("Game not found.");
  }

  const gameCategories = await categories.getByGame(gameId);
  const gameCategoryIds = gameCategories.map((category) => category.id);

  const gameDevelopers = await developers.getByGame(gameId);
  const gameDeveloperIds = gameDevelopers.map((developer) => developer.id);

  console.log(gameCategories, gameDevelopers);

  const filedValues = {
    gameId: game.id,
    gameName: game.name,
    gameDetails: game.details,
    gamePrice: game.price,
    gameLogoUrl: game.logo_url,
    gameCoverImgUrl: game.coverimg_url,
    gameCategories: gameCategoryIds,
    gameDevelopers: gameDeveloperIds,
  };

  res.render("root", await getViewData("Edit Game", filedValues, null, true));
});

exports.editPOST = [
  validateEditGameForm,
  asyncHandler(async (req, res) => {
    const gameId = Number(req.params.id);

    if (isNaN(gameId)) {
      throw new CustomBadRequestError("Invalid game ID.");
    }

    const game = await games.getGame(gameId);

    if (!game) {
      throw new CustomNotFoundError("Game not found.");
    }

    const errors = validationResult(req);

    // if no validation error
    if (errors.isEmpty()) {
      const { gameName, gameDetails, gamePrice, gameLogoUrl, gameCoverImgUrl } =
        req.body;

      const gameDevelopers = [...req.body.gameDevelopers]; // making sure we are always dealing with an array
      const gameCategories = [...req.body.gameCategories];

      await games.edit(
        gameId,
        gameName,
        gameLogoUrl,
        gameCoverImgUrl,
        gameDetails,
        gamePrice,
        gameDevelopers,
        gameCategories,
      );

      res.redirect(`/success/edit/game/${gameId}`);
      return;
    }

    // if no validation error
    const fieldValues = {
      ...req.body,
      gameId: gameId,
      gameDevelopers: [...req.body.gameDevelopers], // making sure we are always dealing with an array
      gameCateogories: [...req.body.gameCategories],
    };

    const parsedErrors = parseValidationErrors(errors.array());

    res
      .status(400)
      .render(
        "root",
        await getViewData("Edit Game", fieldValues, parsedErrors, true),
      );
  }),
];

exports.deletePOST = asyncHandler(async (req, res) => {
  const gameId = Number(req.params.id);

  if (isNaN(gameId)) {
    throw new CustomBadRequestError("Invalid game ID.");
  }

  const game = await games.getGame(gameId);

  if (!game) {
    throw new CustomNotFoundError("Game not found.");
  }

  await games.delete(gameId);
  res.redirect("/success/delete/game");
});
