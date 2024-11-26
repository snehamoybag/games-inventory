const asyncHandler = require("express-async-handler");
const { developers } = require("../db/queries");

exports.GET = asyncHandler(async (req, res) => {
  res.render("root", {
    title: "Developers List",
    mainView: "developersList",
    developers: await developers.getAll(),
    search: {},
    pagination: {},
    styles: "developers",
  });
});
