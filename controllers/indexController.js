const { categories } = require("../db/queries");

exports.GET = async (req, res) => {
  res.render("root", {
    title: "Games Inventory",
    categories: await categories.getAll(),
    mainView: "index",
  });
};
