const { Router } = require("express");
const newGameController = require("../controllers/newGameController");
const newDeveloperController = require("../controllers/newDeveloperController");
const newCategoryController = require("../controllers/newCategoryController");

const router = new Router();

router.get("/game", newGameController.GET);
router.post("/game", newGameController.POST);

router.get("/developer", newDeveloperController.get);
router.get("/category", newCategoryController.get);

module.exports = router;
