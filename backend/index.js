const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();



mongoose.connect('mongodb+srv://Prusi-admin:Database_pass@lsac-poll-it.g9u2hcc.mongodb.net/poll_it_app')
.then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

const UserSchema = mongoose.Schema({
    email: String,
    password: String
})

const UserModel = mongoose.model("User", UserSchema)

app.use(bodyParser.json());

app.get("/users", (req, res) =>{
    UserModel.find({})
        .then(function(users){
            console.log("i got a user")
            res.json(users)
        })
        .catch(function(err){
            console.log(err)
        })
    })

    app.post("/new", (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
    
        UserModel.findOne({ email: email })
            .then(user => {
                if (user) {
                    res.status(400).json({ message: "Email already in use" });
                } else {
                    const newUser = new UserModel({ email, password });
                    newUser.save()
                        .then(() => {
                            console.log("User saved");
                            res.json(newUser);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ message: "Error saving user" });
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Error checking user existence" });
            });
    });

app.listen(5000, () => {
    console.log("Server is running")
})