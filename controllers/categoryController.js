const { categories } = require("../db/queries");

exports.GET = (req, res) => {
  res.send(`Category ID: ${req.params.id}`);
};

exports.deletePOST = async (req, res) => {
  const categoryId = req.params.id;
  const isCategoryValid = categories.isValid(categoryId);

  if (!isCategoryValid) {
    res.status(400).send("Error: Category does not exist.");
    return;
  }

  await categories.delete(categoryId);
  res.redirect("/");
};
