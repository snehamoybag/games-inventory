const { Router } = require("express");
const newGameController = require("../controllers/newGameController");
const newDeveloperController = require("../controllers/newDeveloperController");
const newCategoryController = require("../controllers/newCategoryController");

const router = new Router();

router.get("/game", newGameController.GET);
router.post("/game", newGameController.POST);

router.get("/developer", newDeveloperController.GET);
router.post("/developer", newDeveloperController.POST);

router.get("/category", newCategoryController.GET);
router.post("/category", newCategoryController.POST);

module.exports = router;
