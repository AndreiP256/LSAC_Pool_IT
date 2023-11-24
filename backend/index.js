const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const app = express();

secret = 'your-secret-key';

app.use(cors());

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
    console.log(req.body);
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

app.post("/login", (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    UserModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.status(400).json({ message: "Incorrect email or password" });
            } else {
                if (password === user.password) {
                    const token = jwt.sign({ id: user._id }, secret);
                    res.json({ message: "Logged in successfully", token: token });
                } else {
                    res.status(400).json({ message: "Incorrect email or password" });
                }
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error logging in" });
        });
});

function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.userId = decoded.id;
        next();
    });
}

app.post("/logout", authenticate, (req, res) => {
  
    res.json({ message: "Logged out successfully" });
});


app.listen(5000, () => {
    console.log("Server is running")
})