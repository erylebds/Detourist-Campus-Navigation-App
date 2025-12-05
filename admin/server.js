const express = require("express");
const session = require("express-session");
const path = require("path");
const multer = require('multer');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const upload = multer();

const app = express();

console.log("Starting the server...");

// security headers
app.use(helmet({
    contentSecurityPolicy: false,
}));

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// session configuration with security settings
app.use(session({
    secret:"detourist-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// make CSRF token available in all views
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use("/", require("./routes/authRoutes"));
app.use("/rooms", require("./routes/roomRoutes"));
app.use("/", require("./routes/announcementRoutes"));
app.use("/", require("./routes/accountRoutes"));

// GLOBAL ERROR HANDLING MIDDLEWARE
// Import error handlers
const { 
    notFoundHandler, 
    errorHandler, 
    handleDatabaseError 
} = require("./middleware/errorHandler");

// Handle 404 errors (must be after all routes)
app.use(notFoundHandler);

// Handle database errors
app.use(handleDatabaseError);

// Global error handler (must be last)
app.use(errorHandler);

//start the server and listen to port
app.listen(3000, () => console.log("Admin server is running on port 3000..."));