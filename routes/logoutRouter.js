const { Router } = require("express");
const accessController = require("../controllers/accessController");
const logoutController = require("../controllers/logoutController");

const router = new Router();

router.all("/*", accessController.ALL);

router.post("/admin", logoutController.adminPOST);

module.exports = router;
