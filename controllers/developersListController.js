const asyncHandler = require("express-async-handler");
const { developers } = require("../db/queries");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

exports.GET = asyncHandler(async (req, res) => {
  const currentPage = Number(req.query.page) || 1;
  const limitPerPage = 50;
  const offset = (currentPage - 1) * limitPerPage;
  const numberOfPages = Math.ceil((await developers.countAll()) / limitPerPage);

  if (currentPage < 1 || currentPage > numberOfPages) {
    throw new CustomNotFoundError("Invalid page number.");
  }

  const searchQuery = req.query.developerSearch;

  res.render("root", {
    title: "Developers List",
    mainView: "developersList",
    searchQuery: searchQuery,
    developers: searchQuery
      ? await developers.searchDevelopers(searchQuery, limitPerPage, offset)
      : await developers.getDevelopers(limitPerPage, offset),
    search: {
      label: "Search Developers",
      inputId: "search-developers",
      inputName: "developerSearch",
      inputValue: searchQuery,
    },
    pagination: {
      currentPage: currentPage,
      lastPage: numberOfPages,
    },
    styles: "developers",
  });
});
