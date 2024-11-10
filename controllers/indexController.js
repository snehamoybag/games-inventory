const asyncHandler = require("express-async-handler");
const { games } = require("../db/queries");

exports.GET = asyncHandler(async (req, res) => {
  res.render("root", {
    title: "Games Inventory",
    games: await games.getAll(),
    mainView: "index",
  });
});
