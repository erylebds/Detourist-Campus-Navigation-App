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
        
        
        res.render("rooms", { 
            rooms: rooms,
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// create new room
exports.createRoom = async (req, res) => {
    try {
        const { name, floor_id, room_type, x_coord, y_coord } = req.body;

        if (!name || !floor_id || !room_type || !x_coord || !y_coord)
            return res.status(400).json({ success: false, message: "All fields are required" });

        const cleanName = name.trim();

        if (!minLen(cleanName, 2))
            return res.status(400).json({ success: false, message: "Name must be at least 2 characters" });

        const existingRoom = await roomModel.findRoomByName(cleanName);
        if (existingRoom)
            return res.status(400).json({ success: false, message: "Room name already exists" });

        let imagePath = "assets/backgrounds/maryheights-campus.jpg"; 
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

        res.json({ success: true, message: "Room created successfully", id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// update room 
exports.updateRoom = async (req, res) => {
    try {
        const id = Number(req.body.id); 
        const { name, floor_id, room_type, x_coord, y_coord } = req.body;

        if (!id || !name || !floor_id)
            return res.status(400).json({ success: false, message: "ID, Name, and Floor are required" });

        const cleanName = name.trim();

        const room = await roomModel.getRoomById(id);
        if (!room)
            return res.status(404).json({ success: false, message: "Room not found" });

        const duplicate = await roomModel.findRoomByName(cleanName);
        if (duplicate && duplicate.room_id !== id)
            return res.status(400).json({ success: false, message: "Name already taken" });

        let newImagePath = null;
        if (req.file) {
            newImagePath = "assets/uploads/" + req.file.filename;
            
            // Delete old image only if it exists and isn't the default
            if (room.image_path && !room.image_path.includes("default") && !room.image_path.includes("maryheights")) {
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

        res.json({ success: true, message: "Room updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// delete room
exports.deleteRoom = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!id)
            return res.status(400).json({ success: false, message: "Invalid Room ID" });

        const room = await roomModel.getRoomById(id);
        if (!room)
            return res.status(404).json({ success: false, message: "Room not found" });

        if (room.image_path && !room.image_path.includes("default") && !room.image_path.includes("maryheights")) {
            const filePath = path.join(__dirname, "../public", room.image_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        const affected = await roomModel.deleteRoom(id);
        if (!affected)
            return res.status(500).json({ success: false, message: "Failed to delete room" });

        res.json({ success: true, message: "Room deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};