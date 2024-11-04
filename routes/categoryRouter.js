const { Router } = require("express");
const categoryController = require("../controllers/categoryController");

const router = new Router();

router.get("/:id", categoryController.GET);
router.post("/delete/:id", categoryController.deletePOST);

module.exports = router;
