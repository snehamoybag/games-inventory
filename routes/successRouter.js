const { Router } = require("express");
const successController = require("../controllers/successController.js");

const router = new Router();

router.get("/delete/game", successController.deleteGameGET);

router.get("/delete/developer", successController.deleteDeveloperGET);

router.get("/add/category", successController.addCategoryGET);
router.get("/delete/category", successController.deleteCategoryGET);

module.exports = router;
