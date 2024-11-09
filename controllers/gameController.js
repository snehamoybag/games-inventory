const { body, validationResult } = require("express-validator");
const { games, categories, developers } = require("../db/queries");
const { parseValidationErrors } = require("../utils/parseValidationErrors");

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
    .isLength({ min: 1, max: 255 })
    .withMessage("Logo url must be between 1 and 255 characters."),

  body("gameCoverImgUrl")
    .trim()
    .optional()
    .isLength({ max: 255 })
    .withMessage("Cover image url must not be more than 255 characters."),

  body("gameDetails")
    .trim()
    .isLength({ min: 30, max: 2000 })
    .withMessage("Game details must be between 30 and 2000 characters."),

  body("gamePrice")
    .trim()
    .isNumeric()
    .withMessage("Price must be number or decimal."),
];

exports.GET = async (req, res) => {
  const gameId = req.params.id;
  const game = await games.getGame(gameId);

  res.render("root", {
    mainView: "game",
    title: game.name,
    game: game,
    gameDevelopers: await developers.getByGame(gameId),
  });
};

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
});

exports.editGET = async (req, res) => {
  const gameId = req.params.id;
  res.render("root", await getEditViewData(gameId));
};

exports.editPOST = [
  validateFormFields,
  async (req, res) => {
    const gameId = req.params.id;

    const errors = validationResult(req);
    // if validation error
    if (!errors.isEmpty()) {
      const viewData = await getEditViewData(gameId);
      const parsedErrors = parseValidationErrors(errors.array());

      res.status(400).render("root", { ...viewData, errors: parsedErrors });
      return;
    }

    // if id is invalid
    if (!(await games.isValid(gameId))) {
      res.status(400).send("Error: invalid game ID");
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
  },
];

exports.deletePOST = async (req, res) => {
  const gameId = req.params.id;

  if (!(await games.isValid(gameId))) {
    res.status(400).send("Error: game does not exist.");
    return;
  }

  await games.delete(gameId);
  res.redirect("/");
};
