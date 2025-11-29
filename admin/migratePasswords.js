const bcrypt = require("bcrypt");
const pool = require("./controllers/connectDB"); 
async function migratePasswords() {
    try {
        console.log("Checking admin passwords...");

        const [admins] = await pool.query("SELECT admin_id, username, password FROM admin");

        for (const admin of admins) {
            const { admin_id, username, password } = admin;

            // detect plaintext
            if (!password.startsWith("$2")) {
                console.log(`Found plaintext password for ${username}: "${password}"`);

                const hashed = await bcrypt.hash(password, 10);

                await pool.query(
                    "UPDATE admin SET password = ? WHERE admin_id = ?",
                    [hashed, admin_id]
                );

                console.log(`Updated ${username} has a bcrypt hashed password.`);
            }
        }

        console.log("Password migration complete! All plaintext passwords are now hashed.");
        process.exit();
    } catch (err) {
        console.error("Migration error:", err);
        process.exit(1);
    }
}

migratePasswords();
