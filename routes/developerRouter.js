const developerController = require("../controllers/developerController");
const { Router } = require("express");

const router = new Router();

router.get("/:id", developerController.GET);

module.exports = router;
