const { categories } = require("../db/queries");

exports.get = async (req, res) => {
  res.render("index", { categories: await categories.getAll() });
};
