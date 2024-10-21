const { Router } = require("express");
const categoryController = require("../controllers/categoryController");

const router = new Router();

router.get("/:id", categoryController.get);

module.exports = router;
