const pool = require("../controllers/connectDB"); 

// get all rooms
async function getAllRooms() {
    const [rows] = await pool.query(`
        SELECT 
            id AS room_id, 
            name, 
            floor_id, 
            room_type, 
            x_coord, 
            y_coord, 
            room_image_path AS image_path 
        FROM roomlabel 
        ORDER BY name ASC
    `);
    return rows;
}

// get single room by id
async function getRoomById(id) {
    const [rows] = await pool.query(`
        SELECT 
            id AS room_id, 
            name, 
            floor_id, 
            room_type, 
            x_coord, 
            y_coord, 
            room_image_path AS image_path 
        FROM roomlabel 
        WHERE id = ? 
        LIMIT 1
    `, [id]);
    return rows[0] || null;
}

// find room by name 
async function findRoomByName(name) {
    const [rows] = await pool.query(
        "SELECT * FROM roomlabel WHERE name = ? LIMIT 1",
        [name]
    );
    return rows[0] || null;
}

// create new room
async function createRoom({ name, floor_id, room_type, x_coord, y_coord, image_path }) {
    const [result] = await pool.query(
        "INSERT INTO roomlabel (name, floor_id, room_type, x_coord, y_coord, room_image_path) VALUES (?, ?, ?, ?, ?, ?)",
        [name, floor_id, room_type, x_coord, y_coord, image_path]
    );
    return result.insertId;
}

// update room details 
async function updateRoom({ id, name, floor_id, room_type, x_coord, y_coord, image_path }) {
    let query = "UPDATE roomlabel SET name = ?, floor_id = ?, room_type = ?, x_coord = ?, y_coord = ?";
    const params = [name, floor_id, room_type, x_coord, y_coord];

    // Only update image if a new path is provided
    if (image_path) {
        query += ", room_image_path = ?";
        params.push(image_path);
    }

    query += " WHERE id = ?";
    params.push(id);

    const [result] = await pool.query(query, params);
    return result.affectedRows;
}

// delete room
async function deleteRoom(id) {
    const [result] = await pool.query(
        "DELETE FROM roomlabel WHERE id = ?",
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllRooms,
    getRoomById,
    findRoomByName,
    createRoom,
    updateRoom,
    deleteRoom
};