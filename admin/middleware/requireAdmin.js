module.exports = function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }

    // if AJAX (X-Requested-With), return json 401
    if (req.xhr || req.headers.accept?.includes("application/json")) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // non-AJAX redirect to login
    return res.redirect("/login");
};
