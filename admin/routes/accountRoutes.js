const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/requireAdmin");
const accountController = require("../controllers/accountController");
const multer = require("multer");
const upload = multer();

// my account
router.post("/admin/account/username", requireAdmin, upload.none(), accountController.updateUsername);
router.post("/admin/account/password", requireAdmin, upload.none(), accountController.updatePassword);
router.post("/admin/account/email", requireAdmin, upload.none(), accountController.updateEmail);

// other admins
router.post("/admin/account/create", requireAdmin, upload.none(), accountController.createAdmin);
router.post("/admin/account/edit/:id", requireAdmin, upload.none(), accountController.editAdmin);
router.post("/admin/account/delete/:id", requireAdmin, upload.none(), accountController.deleteAdmin);

module.exports = router;
