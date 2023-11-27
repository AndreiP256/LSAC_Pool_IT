# LSAC_Pool_IT
This is the technical challenge for the 2023 LSAC IT department addmission.
It consists of creating a poll website with login,register,poll-creation/deletion,voting capabilities.

## Technologies used:
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Bootstrap](https://getbootstrap.com/)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Instalation
- In the frontend folder run "npm install" and  "npm start"
- In the backend folder run "npm install" and "npm start"
- If the frontend runs correctly it will display a React Web App on localhost:3000
- If the backend runs correctly it will write "Server is Running" and "Database Connected" in the console
- From that point the app is fully functionall

## Usage

After setting up the project, you can use the app by navigating to `localhost:3000` in your web browser. From there, you can register a new user, log in, create and delete polls, and vote on existing polls. 

## Project Description

### Database
The database is hosted on my mongoDB cluster, any ip should have access, no need to set up a local database.
If you however prefere a local database for testing, in the backend folder, "db.js" contains the database connection, you can modify it there

## Frontend
The frontend is split into several components and pages.

### Pages and App
The project contains 2 pages, the main page with the polls and everything and an Error404 page
Those pages are displayed using a router in the "App.js" file, navbar and footer are allways displayed.
The Home page fetches all the polls from the database using a get request and saves them in an array which is then mapped to multiple poll components.

### NavBar
The navbar is a basic React Bootstrap navbar that displayes the Login, Register, Logout and Create Pool dinamicaly based on if the user is or is not logged in. It uses the context provided by the backend for that.

### Footer
The footer is just a div at the bottom of the screen containing the social pages as href images

#### Login
Login returns a modal and a button. The button is placed on the navbar and the modal pops up on click of the button.
Appart from the design, the login.js contains a request to the backend for checking for a user which than returns a jwt for authentification. It than sets the local isLoggedIn to true so that it can be checked for and used. It also saveds the token locally.

### Register
Register has almost the same functonality as login but instead of searhing for a user it creates a new one. The text fields are checked by the frontedn code ( and the backend asswell ) so that they match the criteria.

### Logout
Logout delets the token and sets isLoggedIn to false after which it refreshes the page

### Create Poll
This element creates a modal with options for poll creation that are checked for and sent to the backend request after. The user that sends the request is processed by the backend from it's jwt token.

### Poll
This is thee template for every poll on the app. It is a function that takes several parameters and creates a poll element from them. The Vote and Delete buttons are also dinamically shown based on the user's logged in status and the backedn checks for it aswell.

## Backend
The backend is split into various files that take care of diferent aspects of the app.

### Models
In the models file the PollSchema, PollModel, UserSchema and UserModel are defined for later use throughout the app.

### Database
The database file takes care of connecting to the database.

### Authentification Middleware
The authentification Middleware file takes care of verifying the jwt token used to identify each user and it also decodes their UserID so that it can be used later.

### Authentification Routes
In this file the login and new_user endpoints are defined.
- The login searches the database for the email and than compares the passwords. Bcrypt encription is used to hash the passwords before sending it to the database for checking. In this section the jwt token is generated and passed back in the response.
- The register section checkes using regex for a valid email and a valid password and if the 2 are correct it hashes the password. After that it checks the database for an User with that email that allready exists and if it is not found, a new user is created.

### CRUD
This file handles everything related to the polls.
- The post creates a new poll with the options passed in through the json request and the UserID from the jwt token.
- The get returns a json with all the polls on the database
- The patch uses the poll ID too modifie the votes and add the current user to the user_voted list so that they cannot vote again. ( it is checked that he can vote )
- The delete removes one poll from the database based on its id. It is checked that the user who requested the deletion of the poll is the owner

### Index
The index file comprises of a router that directs the requests to the endpoints defined in the previous files.

## License
This project and all the code contained within this repository is owned and maintained by Prusacov Andrei-Ionut. Unauthorized copying of this project, via any medium, is strictly prohibited.