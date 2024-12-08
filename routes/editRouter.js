const { Router } = require("express");
const accessController = require("../controllers/accessController");
const gameFormController = require("../controllers/gameFromController");
const categoryFormController = require("../controllers/categoryFormController");
const developerFormController = require("../controllers/developerFormController");

const router = new Router();

router.all("/*", accessController.ALL);

router.get("/game/:id", gameFormController.editGET);
router.post("/game/:id", gameFormController.editPOST);

router.get("/category/:id", categoryFormController.editGET);
router.post("/category/:id", categoryFormController.editPOST);

router.get("/developer/:id", developerFormController.editGET);
router.post("/developer/:id", developerFormController.editPOST);

module.exports = router;
