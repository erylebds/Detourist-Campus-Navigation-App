const db = require('../config/db'); 
const fs = require('fs');
const path = require('path');

// 1. Render Page
exports.getRoomsPage = (req, res) => {
    const sql = "SELECT * FROM roomlabel ORDER BY name ASC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        res.render('rooms', { rooms: results });
    });
};

// 2. Create Room
exports.createRoom = (req, res) => {
    const { name, floor_id, room_type, x_coord, y_coord } = req.body;
    
    // Server-side Validation
    if (!name || !floor_id || !x_coord || !y_coord) {
        return res.status(400).json({ message: "Name, Floor, X, and Y coordinates are required." });
    }

    // Handle Image Path
    let imagePath = 'assets/backgrounds/maryheights-campus.jpg'; // Teh default one used
    if (req.file) {
        imagePath = 'assets/uploads/' + req.file.filename;
    }

    const sql = "INSERT INTO roomlabel (name, floor_id, room_type, x_coord, y_coord, room_image_path) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, floor_id, room_type, x_coord, y_coord, imagePath], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json({ message: "Room created successfully!" });
    });
};

// 3. Update Room
exports.updateRoom = (req, res) => {
    const { id, name, floor_id, room_type, x_coord, y_coord } = req.body;

    if (!id || !name) {
        return res.status(400).json({ message: "ID and Name are required." });
    }

    let sql, params;

    if (req.file) {
        const newImagePath = 'assets/uploads/' + req.file.filename;
        sql = "UPDATE roomlabel SET name=?, floor_id=?, room_type=?, x_coord=?, y_coord=?, room_image_path=? WHERE id=?";
        params = [name, floor_id, room_type, x_coord, y_coord, newImagePath, id];
    } else {
        sql = "UPDATE roomlabel SET name=?, floor_id=?, room_type=?, x_coord=?, y_coord=? WHERE id=?";
        params = [name, floor_id, room_type, x_coord, y_coord, id];
    }

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json({ message: "Room updated successfully!" });
    });
};

// 4. Delete Room
exports.deleteRoom = (req, res) => {
    const { id } = req.params;
    
    // Optional: Fetch image path first to delete the file, then delete record
    const sql = "DELETE FROM roomlabel WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json({ message: "Room deleted successfully!" });
    });
};