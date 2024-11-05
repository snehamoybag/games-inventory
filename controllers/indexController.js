const { games } = require("../db/queries");

exports.GET = async (req, res) => {
  res.render("root", {
    title: "Games Inventory",
    games: await games.getAll(),
    mainView: "index",
  });
};
