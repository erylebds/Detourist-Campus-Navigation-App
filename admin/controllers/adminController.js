const adminModel = require("../models/adminModel");

async function findAdminByUsernameOrEmail(identifier) {
    return await adminModel.findByUsernameOrEmail(identifier);
}

module.exports = {
    findAdminByUsernameOrEmail
};

