const { Router } = require("express");
const accessController = require("../controllers/accessController");
const gameFormController = require("../controllers/gameFromController");
const developerFormController = require("../controllers/developerFormController");
const categoryFormController = require("../controllers/categoryFormController");

const router = new Router();

router.all("/*", accessController.ALL);

router.get("/game", gameFormController.newGET);
router.post("/game", gameFormController.newPOST);

router.get("/developer", developerFormController.newGET);
router.post("/developer", developerFormController.newPOST);

router.get("/category", categoryFormController.newGET);
router.post("/category", categoryFormController.newPOST);

module.exports = router;
