const express = require("express"); //import node express framework for server creation
const session = require("express-session"); //track user requests
const path = require("path");


const app = express();

console.log("Starting the server...");

app.use(express.urlencoded({ extended: true})); //parse HTML form data
app.use(express.json());
app.use(express.static("public")); //access static files

app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs"); //render ejs to html
app.set("views", path.join(__dirname, "views"));

app.use(session({
    secret:"detourist-secret",
    resave: false, //prevent saving unchanged sessions
    saveUninitialized: false //prevent creating session until there's data to store
}));

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/roomRoutes"));
app.use("/", require("./routes/announcementRoutes"));
app.use("/", require("./routes/accountRoutes"));

//start the server and listen to port
app.listen(3000, () => console.log("Admin server is running on port 3000..."));