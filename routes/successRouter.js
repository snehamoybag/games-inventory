const { Router } = require("express");
const successController = require("../controllers/successController.js");

const router = new Router();

router.get("/login", successController.loginGET);
router.get("/logout", successController.logoutGET);

router.get("/add/game", successController.addGameGET);
router.get("/edit/game/:id", successController.editGameGET);
router.get("/delete/game", successController.deleteGameGET);

router.get("/add/developer", successController.addDeveloperGET);
router.get("/edit/developer/:id", successController.editDeveloperGET);
router.get("/delete/developer", successController.deleteDeveloperGET);

router.get("/add/category", successController.addCategoryGET);
router.get("/edit/category/:id", successController.editCategoryGET);
router.get("/delete/category", successController.deleteCategoryGET);

module.exports = router;
