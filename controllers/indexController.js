const asyncHandler = require("express-async-handler");
const { games } = require("../db/queries");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");

exports.GET = asyncHandler(async (req, res) => {
  const pageQuery = Number(req.query.page);
  const currentPage = pageQuery || 1;
  const limitPerPage = 30;
  const offset = (currentPage - 1) * limitPerPage;
  const totalNumberOfPages = Math.ceil((await games.countAll()) / limitPerPage);

  if (pageQuery < 1 || pageQuery > totalNumberOfPages) {
    throw new CustomNotFoundError("Invalid page number.");
  }

  const searchQuery = req.query.gameSearch;

  res.render("root", {
    title: "Games Inventory",
    gamesContainerTitle: "All Games",
    searchQuery: searchQuery || null,
    games: searchQuery
      ? await games.searchGames(searchQuery, limitPerPage, offset)
      : await games.getGames(limitPerPage, offset),
    mainView: "index",
    styles: "index",
    search: {
      label: "Search Games",
      inputId: "search-games",
      inputName: "gameSearch",
      inputValue: searchQuery,
    },
    pagination: {
      currentPage: currentPage,
      lastPage: totalNumberOfPages,
    },
  });
});
