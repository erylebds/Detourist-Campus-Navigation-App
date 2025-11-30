const adminModel = require("../models/adminModel");

// find an admin using username or email
async function findAdminByUsernameOrEmail(identifier) {
    return await adminModel.findByUsernameOrEmail(identifier);
}

// export functions for use in other modules
module.exports = {
    findAdminByUsernameOrEmail
};
