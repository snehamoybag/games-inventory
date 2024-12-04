const getViewData = (title, message) => ({
  mainView: "success",
  title: title,
  message: message,
  styles: "success",
});

const getDeleteViewData = (message) =>
  getViewData("Deleted Successfully!", message);

const getAddViewData = (message) => getViewData("Added Successfully!", message);

exports.deleteGameGET = (req, res) => {
  res.render(
    "root",
    getDeleteViewData("The game has been deleted successfully."),
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

exports.deleteCategoryGET = (req, res) => {
  res.render(
    "root",
    getDeleteViewData("The category has been deleted successfully."),
  );
};
