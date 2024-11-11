const path = require("node:path");
const express = require("express");

const indexRouter = require("./routes/indexRouter");
const newRouter = require("./routes/newRouter");
const categoryRouter = require("./routes/categoryRouter");
const gameRouter = require("./routes/gameRouter");
const developerRouter = require("./routes/developerRouter");
const { categories } = require("./db/queries");

const app = express();

// set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// parse req.body
app.use(express.urlencoded({ extended: true }));

// serve static files
app.use(express.static("public"));

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
app.use("/developer", developerRouter);

// error handler
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.statusCode || 500).render("error", {
    name: err.name || "error",
    statusCode: err.statusCode || 500,
    message: err.message || "internal server error",
  });
});

// error 404 route. Make sure it is at the end of all middleware functions
app.use((req, res, next) => {
  res.status(404).render("error", {
    name: "NotFound",
    statusCode: 404,
    message: "Page not found.",
  });
});

// run server
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

app.listen(PORT, HOST, () =>
  console.log(`Server is running on http://${HOST}:${PORT}`),
);
