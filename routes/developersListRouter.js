const { Router } = require("express");
const developersListController = require("../controllers/developersListController");

const router = new Router();

router.get("/", developersListController.GET);

module.exports = router;
