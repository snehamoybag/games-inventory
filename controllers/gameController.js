const { games, categories, developers } = require("../db/queries");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");

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
