const path = require("node:path");
const express = require("express");

const indexRouter = require("./routes/indexRouter");
const newRouter = require("./routes/newRouter");
const categoryRouter = require("./routes/categoryRouter");
const gameRouter = require("./routes/gameRouter");
const { categories } = require("./db/queries");

const app = express();

// set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// parse req.body
app.use(express.urlencoded({ extended: true }));

// global variables available to views
app.use(async (req, res, next) => {
  res.locals.categories = await categories.getAll();
  next();
});

// routes
app.use("/", indexRouter);
app.use("/new", newRouter);
app.use("/category", categoryRouter);
app.use("/game", gameRouter);

// run server
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

app.listen(PORT, HOST, () =>
  console.log(`Server is running on http://${HOST}:${PORT}`),
);
