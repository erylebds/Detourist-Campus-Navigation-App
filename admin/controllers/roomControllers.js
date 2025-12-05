const roomModel = require("../models/roomModel");
const fs = require("fs");
const path = require("path");

// Helper: Check string length
function minLen(str, len) {
    return typeof str === "string" && str.trim().length >= len;
}

// get all rooms
exports.getRooms = async (req, res) => {
    try {
        const rooms = await roomModel.getAllRooms();
        res.json({ success: true, rooms });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// create a new room
exports.createRoom = async (req, res) => {
    try {
        const { name, floor_id, room_type, x_coord, y_coord } = req.body;

        // check for empty fields
        if (!name || !floor_id || !room_type || !x_coord || !y_coord)
            return res.status(400).json({ success: false, message: "all fields are required" });

        const cleanName = name.trim();

        // check name length
        if (!minLen(cleanName, 2))
            return res.status(400).json({ success: false, message: "room name must be at least 2 characters" });

        // check for duplicate name
        const existingRoom = await roomModel.findRoomByName(cleanName);
        if (existingRoom)
            return res.status(400).json({ success: false, message: "room name already exists" });

        // handle image upload (default if none provided)
        let imagePath = "admin\public\assets\backgrounds\maryheights-campus.jpg"; 
        if (req.file) {
            imagePath = "assets/uploads/" + req.file.filename;
        }

        const id = await roomModel.createRoom({ 
            name: cleanName, 
            floor_id, 
            room_type, 
            x_coord, 
            y_coord, 
            image_path: imagePath 
        });

        res.json({ success: true, message: "room created successfully", id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// update room details
exports.updateRoom = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, floor_id, room_type, x_coord, y_coord } = req.body;

        if (!id || !name || !floor_id)
            return res.status(400).json({ success: false, message: "id, name, and floor are required" });

        const cleanName = name.trim();

        const room = await roomModel.getRoomById(id);
        if (!room)
            return res.status(404).json({ success: false, message: "room not found" });

        // check duplicate name (ensure it's not the current room)
        const duplicate = await roomModel.findRoomByName(cleanName);
        if (duplicate && duplicate.room_id !== id)
            return res.status(400).json({ success: false, message: "room name already taken" });

        // handle image update
        let newImagePath = null;
        if (req.file) {
            newImagePath = "assets/uploads/" + req.file.filename;

            // delete old image if it exists and isn't default
            if (room.image_path && !room.image_path.includes("default")) {
                const oldPath = path.join(__dirname, "../public", room.image_path);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        await roomModel.updateRoom({ 
            id, 
            name: cleanName, 
            floor_id, 
            room_type, 
            x_coord, 
            y_coord, 
            image_path: newImagePath 
        });

        res.json({ success: true, message: "room updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};

// delete room
exports.deleteRoom = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!id)
            return res.status(400).json({ success: false, message: "invalid room id" });

        const room = await roomModel.getRoomById(id);
        if (!room)
            return res.status(404).json({ success: false, message: "room not found" });

        // delete associated image file
        if (room.image_path && !room.image_path.includes("default")) {
            const filePath = path.join(__dirname, "../public", room.image_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        const affected = await roomModel.deleteRoom(id);
        if (!affected)
            return res.status(500).json({ success: false, message: "failed to delete room" });

        res.json({ success: true, message: "room deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "server error" });
    }
};