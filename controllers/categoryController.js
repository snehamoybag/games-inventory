const { categories, games } = require("../db/queries");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");

exports.GET = asyncHandler(async (req, res) => {
  const categoryId = Number(req.params.id);

  if (isNaN(categoryId)) {
    throw new CustomNotFoundError("Category not found.");
  }

  const category = await categories.getCategory(categoryId);

  if (!category) {
    throw new CustomNotFoundError("Category not found.");
  }

  const pageQuery = Number(req.query.page);
  const currentPage = pageQuery || 1;
  const limitPerPage = 30;
  const offset = (currentPage - 1) * limitPerPage;
  const numberOfGamesInCategory = await games.countInCategory(categoryId);
  const totalNumberOfPages = Math.ceil(numberOfGamesInCategory / limitPerPage);

  if (pageQuery < 1 || pageQuery > totalNumberOfPages) {
    throw new CustomNotFoundError("Invalid page number.");
  }

  const searchQuery = req.query.gameSearch;
  const categoryGames = searchQuery
    ? await games.searchGamesInCategory(
        categoryId,
        searchQuery,
        limitPerPage,
        offset,
      )
    : await games.getByCategory(categoryId, limitPerPage, offset);

  res.render("root", {
    title: `${category.name} Games`,
    gamesContainerTitle: `${category.name} Games`,
    searchQuery: searchQuery || null,
    games: categoryGames,
    mainView: "category",
    styles: "category",
    search: {
      label: `Search ${category.name} Games`,
      inputId: "search-games",
      inputName: "gameSearch",
      inputValue: searchQuery,
    },
    pagination: {
      currentPage: currentPage,
      lastPage: totalNumberOfPages || 1,
    },
  });
});
