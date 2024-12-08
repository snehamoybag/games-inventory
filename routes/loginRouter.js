const { Router } = require("express");
const adminLoginFormController = require("../controllers/adminLoginFormController");

const router = new Router();

router.get("/admin", adminLoginFormController.adminGET);
router.post("/admin", adminLoginFormController.adminPOST);

module.exports = router;
