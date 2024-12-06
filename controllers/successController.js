const getViewData = (title, message) => ({
  mainView: "success",
  title: title,
  message: message,
  styles: "success",
});

const getAddViewData = (message) => getViewData("Added Successfully!", message);
const getEditViewData = (message) =>
  getViewData("Edited Successfully!", message);

const getDeleteViewData = (message) =>
  getViewData("Deleted Successfully!", message);

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

exports.editCategoryGET = (req, res) => {
  res.render("root", getEditViewData("Category has been edited successfully."));
};

exports.deleteCategoryGET = (req, res) => {
  res.render(
    "root",
    getDeleteViewData("The category has been deleted successfully."),
  );
};
