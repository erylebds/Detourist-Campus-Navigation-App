//Don't let users who are not admins access the admin side of the website
module.exports = function (req, res, next) {
    if (!req.session || !req.session.isAdmin) {
        return res.redirect("/login?error=Unauthorized");
    }
    next();
}