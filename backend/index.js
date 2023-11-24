const express = require('express');
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

app.use("/new", (req, res) => {
    const user = new UserModel({
        email: req.body.email,
        password: req.body.password
    })
    user.save()
        .then(function(){
            console.log("User saved")
            res.json(user)
        })
        .catch(function(err){
            console.log(err)
        })
})


app.listen(5000, () => {
    console.log("Server is running")
})