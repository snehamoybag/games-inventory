const { Router } = require("express");
const gameFormController = require("../controllers/gameFromController");
const categoryFormController = require("../controllers/categoryFormController");
const developerFormController = require("../controllers/developerFormController");

const router = new Router();

router.post("/game/:id", gameFormController.deletePOST);
router.post("/category/:id", categoryFormController.deletePOST);
router.post("/developer/:id", developerFormController.deletePOST);

module.exports = router;
