const { Router } = require("express");
const categoryController = require("../controllers/categoryController");

const router = new Router();

router.get("/:id", categoryController.GET);
router.get("/edit/:id", categoryController.editGET);

router.post("/delete/:id", categoryController.deletePOST);
router.post("/edit/:id", categoryController.editPOST);

module.exports = router;
