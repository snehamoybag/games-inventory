const developerController = require("../controllers/developerController");
const { Router } = require("express");

const router = new Router();

router.get("/:id", developerController.GET);
router.get("/edit/:id", developerController.editGET);

router.post("/edit/:id", developerController.editPOST);

module.exports = router;
