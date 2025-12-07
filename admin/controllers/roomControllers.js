const roomModel = require("../models/roomModel");
const fs = require("fs");
const path = require("path");

// helper to remove file from server if needed
const deleteFile = (filePath) => {
    if (!filePath) return;
    const fullPath = path.join(__dirname, "../public", filePath);
    fs.unlink(fullPath, (err) => {
        if (err && err.code !== 'ENOENT') console.error("Failed to delete file:", err);
    });
};

// create room
exports.createRoom = async (req, res) => {
    try {
        const { name, room_type, floor_id, x_coord, y_coord } = req.body;
        
        // Handle Image Upload
        const image_path = req.file ? `uploads/rooms/${req.file.filename}` : null;

        const roomData = {
            name,
            room_type,
            floor_id,
            x_coord,
            y_coord,
            image_path
        };

        const newId = await roomModel.createRoom(roomData);

        if (newId) {
            res.json({ success: true, message: "Room created successfully!" });
        } else {
            res.json({ success: false, message: "Failed to insert room into database." });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error creating room." });
    }
};

// update room
exports.updateRoom = async (req, res) => {
    try {
        
        const roomId = req.body.id; 
        const { name, room_type, floor_id, x_coord, y_coord } = req.body;

        // Fetch existing room to get old image path
        const existingRoom = await roomModel.getRoomById(roomId);
        if (!existingRoom) {
            return res.json({ success: false, message: "Room not found." });
        }

        let image_path = existingRoom.image_path;

        // If a new file was uploaded
        if (req.file) {
            if (existingRoom.image_path) {
                deleteFile(existingRoom.image_path);
            }
            image_path = `uploads/rooms/${req.file.filename}`;
        }

        const updateData = {
            id: roomId,
            name,
            room_type,
            floor_id,
            x_coord,
            y_coord,
            image_path
        };

        const result = await roomModel.updateRoom(updateData);

        if (result) {
            res.json({ success: true, message: "Room updated successfully!" });
        } else {
            res.json({ success: false, message: "No changes made or update failed." });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error updating room." });
    }
};

// delete room
exports.deleteRoom = async (req, res) => {
    try {
        const roomId = req.params.id;

        const room = await roomModel.getRoomById(roomId);
        
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        const result = await roomModel.deleteRoom(roomId);

        if (result) {
            if (room.image_path) {
                deleteFile(room.image_path);
            }
            res.json({ success: true, message: "Room deleted successfully" });
        } else {
            res.json({ success: false, message: "Failed to delete room" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error deleting room" });
    }
};