const { games, developers } = require("../db/queries");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

exports.GET = asyncHandler(async (req, res) => {
  const developerId = req.params.id;
  const developer = await developers.getDeveloper(developerId);

  if (!developer) {
    throw new CustomNotFoundError("Developer not found.");
  }

  const pageQuery = Number(req.query.page);
  const currentPage = pageQuery || 1;
  const gameLimitPerPage = 6;
  const offset = (currentPage - 1) * gameLimitPerPage;
  const numberOfGamesByDeveloper = await games.countByDeveloper(developerId);
  const numberOfPages =
    Math.ceil(numberOfGamesByDeveloper / gameLimitPerPage) || 1;

  if (pageQuery < 1 || pageQuery > numberOfPages) {
    throw new CustomNotFoundError("invalid page number.");
  }

  res.render("root", {
    title: `Developer: ${developer.name}`,
    gamesContainerTitle: `Games by ${developer.name}`,
    mainView: "developer",
    developer: developer,
    games: await games.getByDeveloper(developerId, gameLimitPerPage, offset),
    pagination: {
      currentPage: currentPage,
      lastPage: numberOfPages,
    },
    styles: "developer",
  });
});
