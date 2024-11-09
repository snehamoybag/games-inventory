const { Router } = require("express");
const gameController = require("../controllers/gameController");

const router = new Router();

router.get("/:id", gameController.GET);
router.get("/edit/:id", gameController.editGET);

router.post("/edit/:id", gameController.editPOST);
router.post("/delete/:id", gameController.deletePOST);

module.exports = router;
