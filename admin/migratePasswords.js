const bcrypt = require("bcrypt");
const pool = require("./controllers/connectDB"); 

// migrate all admin passwords to hashed format
async function migratePasswords() {
    try {
        console.log("checking admin passwords...");

        // get all admins from the database
        const [admins] = await pool.query("SELECT admin_id, username, password FROM admin");

        // process each admin
        for (const admin of admins) {
            const { admin_id, username, password } = admin;

            // check if password is plaintext
            if (!password.startsWith("$2")) {
                console.log(`found plaintext password for ${username}: "${password}"`);

                // hash the plaintext password
                const hashed = await bcrypt.hash(password, 10);

                // update the admin password in the database
                await pool.query(
                    "UPDATE admin SET password = ? WHERE admin_id = ?",
                    [hashed, admin_id]
                );

                console.log(`updated ${username} has a bcrypt hashed password`);
            }
        }

        console.log("password migration complete. all plaintext passwords are now hashed.");
        process.exit();
    } catch (err) {
        console.error("migration error:", err);
        process.exit(1);
    }
}

// start migration
migratePasswords();
