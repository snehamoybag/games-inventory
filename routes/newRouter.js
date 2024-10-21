const { Router } = require("express");
const newController = require("../controllers/newController");

const router = new Router();

router.get("/game", newController.gameGet);
router.get("/developer", newController.developerGet);
router.get("/category", newController.categoryGet);

module.exports = router;
