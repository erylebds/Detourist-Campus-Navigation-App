const express = require('express');
const router = express.Router();
const roomController = require("../controllers/roomControllers"); 
const multer = require('multer');
const upload = multer(); 

router.post("/admin/rooms/create", upload.single("room_image"), roomController.createRoom);

router.post("/admin/rooms/update", upload.single("room_image"), roomController.updateRoom);

router.delete("/admin/rooms/delete/:id", roomController.deleteRoom);

module.exports = router;