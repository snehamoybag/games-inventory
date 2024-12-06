const { Router } = require("express");
const gameController = require("../controllers/gameController");

const router = new Router();

router.get("/:id", gameController.GET);

module.exports = router;
