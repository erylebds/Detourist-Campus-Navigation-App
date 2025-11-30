const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/requireAdmin");
const accountController = require("../controllers/accountController");
const multer = require("multer");
const upload = multer();

// routes for my account actions
// update current admin username
router.post("/admin/account/username", requireAdmin, upload.none(), accountController.updateUsername);
// update current admin password
router.post("/admin/account/password", requireAdmin, upload.none(), accountController.updatePassword);
// update current admin email
router.post("/admin/account/email", requireAdmin, upload.none(), accountController.updateEmail);

// routes for managing other admins
// create a new admin
router.post("/admin/account/create", requireAdmin, upload.none(), accountController.createAdmin);
// edit an existing admin
router.post("/admin/account/edit/:id", requireAdmin, upload.none(), accountController.editAdmin);
// delete an admin
router.post("/admin/account/delete/:id", requireAdmin, upload.none(), accountController.deleteAdmin);

module.exports = router;
