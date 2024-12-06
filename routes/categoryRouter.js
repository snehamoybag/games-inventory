const { Router } = require("express");
const categoryController = require("../controllers/categoryController");

const router = new Router();

router.get("/:id", categoryController.GET);

module.exports = router;
