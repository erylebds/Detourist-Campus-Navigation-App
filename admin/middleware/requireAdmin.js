// Export a middleware function to check if the current user is an admin
module.exports = function requireAdmin(req, res, next) {
    
    // Check if the session exists and the user has admin privileges
    if (req.session && req.session.isAdmin) {
        return next(); // User is admin → allow them to proceed to the next middleware/route
    }

    // If the request is an AJAX request (or expects JSON), respond with a 401 Unauthorized
    // req.xhr is true if the request was made via XMLHttpRequest (AJAX)
    // req.headers.accept?.includes("application/json") checks if client expects JSON response
    if (req.xhr || req.headers.accept?.includes("application/json")) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // If the request is a normal browser request (non-AJAX), redirect the user to the login page
    return res.redirect("/login");
};