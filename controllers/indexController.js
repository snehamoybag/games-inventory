const asyncHandler = require("express-async-handler");
const { games } = require("../db/queries");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");

exports.GET = asyncHandler(async (req, res) => {
  const currentPage = Number(req.query.page) || 1;
  const limitPerPage = 30;
  const offset = (currentPage - 1) * limitPerPage;
  const totalNumberOfPages = Math.ceil((await games.countAll()) / limitPerPage);

  if (currentPage < 1 || currentPage > totalNumberOfPages) {
    throw new CustomNotFoundError("invalid page number");
  }

  res.render("root", {
    title: "Games Inventory",
    games: await games.getGames(limitPerPage, offset),
    mainView: "index",
    styles: "index",
    pagination: {
      currentPage: currentPage,
      lastPage: totalNumberOfPages,
    },
  });
});
