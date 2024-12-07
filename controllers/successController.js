const getViewData = (title, message, link, linkText) => ({
  mainView: "success",
  title,
  message,
  link,
  linkText,
  styles: "success",
});

const getAddViewData = (message) =>
  getViewData("Added Successfully!", message, "/", "Go to Homepage");

const getEditViewData = (message, link, linkText) =>
  getViewData("Edited Successfully!", message, link, linkText);

const getDeleteViewData = (message) =>
  getViewData("Deleted Successfully!", message, "/", "Go to Homepage");

exports.addGameGET = (req, res) => {
  res.render("root", getAddViewData("Game has been added successfully."));
};

exports.editGameGET = (req, res) => {
  const link = `/game/${req.params.id}`;
  res.render(
    "root",
    getEditViewData(
      "Game has been edited successfully.",
      link,
      "View Gamepage",
    ),
  );
};

exports.deleteGameGET = (req, res) => {
  res.render(
    "root",
    getDeleteViewData("The game has been deleted successfully."),
  );
};

exports.addDeveloperGET = (req, res) => {
  res.render("root", getAddViewData("Developer has been added successfully."));
};

exports.editDeveloperGET = (req, res) => {
  const link = `/developer/${req.params.id}`;
  res.render(
    "root",
    getEditViewData(
      "Developer has been edited successfully.",
      link,
      "View Developerpage",
    ),
  );
};

exports.deleteDeveloperGET = (req, res) => {
  res.render(
    "root",
    getDeleteViewData("The developer has been deleted successfully."),
  );
};

exports.addCategoryGET = (req, res) => {
  res.render("root", getAddViewData("Category added successfully."));
};

exports.editCategoryGET = (req, res) => {
  const link = `/category/${req.params.id}`;
  res.render(
    "root",
    getEditViewData(
      "Category has been edited successfully.",
      link,
      "View Categorypage",
    ),
  );
};

exports.deleteCategoryGET = (req, res) => {
  res.render(
    "root",
    getDeleteViewData("The category has been deleted successfully."),
  );
};
