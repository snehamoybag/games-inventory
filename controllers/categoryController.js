const { body, validationResult } = require("express-validator");
const { categories, games } = require("../db/queries");
const parseValidationErrors = require("../utils/parseValidationErrors");
const asyncHandler = require("express-async-handler");
const CustomBadRequestError = require("../errors/CustomBadRequestError.js");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");
const isValidUrl = require("../utils/isValidUrl.js");

const validateIconUrl = (url) => {
  // since icon url is optional,
  //we want to ignore testing url when it is empty/not provied by the user
  if (!url) return true;

  if (!isValidUrl(url)) {
    throw new Error("Invalid icon url");
  }

  return true;
};

const validateFormFields = [
  body("categoryName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Category name must be between 1 and 255 characters."),

  body("categoryIconUrl")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Icon url must be between 1 and 255 characters.")
    .custom(validateIconUrl),
];

const getViewData = async (category = {}) => ({
  title: "Edit Category",
  mainView: "addCategory",
  fieldValues: category,
  styles: "add-category",
});

exports.GET = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
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

exports.editGET = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const category = await categories.getCategory(categoryId);

  if (!category) {
    throw new CustomNotFoundError("Category not found.");
  }

  res.render("root", await getViewData(category));
});

exports.editPOST = [
  validateFormFields,
  asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await categories.getCategory(categoryId);

    // if id is invalid
    if (!category) {
      throw new CustomBadRequestError(`Cannot post on ${req.originalUrl}`);
    }

    // if field is not valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const viewData = await getViewData(category);
      const parsedErrors = parseValidationErrors(errors.array());

      res.status(400).render("root", { ...viewData, errors: parsedErrors });
      return;
    }

    const { categoryName, categoryIconUrl } = req.body;
    await categories.edit(categoryId, categoryName, categoryIconUrl);

    res.redirect("/");
  }),
];

exports.deletePOST = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const category = await categories.getCategory(categoryId);

  if (!category) {
    throw new CustomBadRequestError(`Invalid category ID: ${categoryId}`);
  }

  await categories.delete(categoryId);
  res.redirect("/");
});
