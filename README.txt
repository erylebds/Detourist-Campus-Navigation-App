INSTRUCTIONS FOR NODE EXPRESS INSTALLATION USING TERMINAL

1. From the Detourist-Campus-Navigation-App, change directories and go to the admin folder
- cd admin

2. Open your terminal (CMD) inside visual studio and install the needed dependencies for node express (server)
- npm init -y
- npm install / npm install express express-session mysql2 ejs multer cors
- npm install bcryptjs

3. After installing the dependencies, start the server using the command
- node server.js

NOTE: IF ALL DEPENDENCIES ARE ALREADY INSTALLED IN THE ADMIN folder,
      SIMPLY START THE SERVER USING THE node server.js command in the terminal

*Restart server everytime there is a change in the code
*If you want to automatically restart the server whenever you save
changes in the code

install nodemon using this command
- npm install -g nodemon

then run the server using this command
- nodemon server.js

just reload the website and it will automatically show you the updated changes in your web


for checking of the hashed password use:
- node migratePasswords.js

it will print out the real password, as well if it was already hashed or not