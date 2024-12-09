require("dotenv").config();
const path = require("node:path");
const express = require("express");
const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/indexRouter");
const loginRouter = require("./routes/loginRouter");
const logoutRouter = require("./routes/logoutRouter");
const newRouter = require("./routes/newRouter");
const editRouter = require("./routes/editRouter");
const deleteRouter = require("./routes/deleteRouter");
const categoryRouter = require("./routes/categoryRouter");
const gameRouter = require("./routes/gameRouter");
const developerRouter = require("./routes/developerRouter");
const developerslistRouter = require("./routes/developersListRouter");
const successRouter = require("./routes/successRouter");

const { categories } = require("./db/queries");

const app = express();

// set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// parse cookies
app.use(cookieParser("snehamoybag"));

// parse req.body
app.use(express.urlencoded({ extended: true }));

// serve static files
app.use(express.static("public"));

// global variables available to views
app.use(async (req, res, next) => {
  res.locals.categories = await categories.getAll();
  res.locals.isAdmin = Boolean(req.signedCookies.isAdmin);
  next();
});

// routes
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/new", newRouter);
app.use("/edit", editRouter);
app.use("/delete", deleteRouter);
app.use("/category", categoryRouter);
app.use("/game", gameRouter);
app.use("/developer", developerRouter);
app.use("/developers-list", developerslistRouter);
app.use("/success", successRouter);

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
