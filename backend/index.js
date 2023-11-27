const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const secret = 'lsac_poll';

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

const PollSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    is_multiple: Boolean,
    options: Array,
    votes: Array,
    user_voted: Array
})

const UserModel = mongoose.model("User", UserSchema)
const PollModel = mongoose.model("Poll", PollSchema)

app.use(bodyParser.json());

function authenticate(req, res, next) {
    let token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }

    console.log("Token:", token);

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // If the token is valid, call next() to proceed to the next middleware or route handler
        next();
    });
}

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
        const confirmPassword = req.body.confpass;

        const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: "Invalid email. Only '@gmail.com' emails are allowed." });
            return;
        }

        if (password.length < 8 || password.length > 32) {
            res.status(400).json({ message: "Invalid password. Password must be between 8 and 32 characters." });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ message: "Passwords do not match." });
            return;
        }
    
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error hashing password" });
                return;
            }
    
            UserModel.findOne({ email: email })
                .then(user => {
                    if (user) {
                        res.status(400).json({ message: "Email already in use" });
                    } else {
                        const newUser = new UserModel({ email, password: hash });
                        newUser.save()
                            .then(() => {
                                console.log("User saved");
                                res.json(newUser);
                            })
                            // handle save error
                            .catch(err => {
                                console.error(err);
                                res.status(500).json({ message: "Error saving user" });
                            });
                    }
                })
                // handle find error
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ message: "Error finding user" });
                });
        });
    });

app.post("/polls", (req, res) => {
    const title = req.body.title;
    const is_multiple = req.body.is_multiple;
    const options = req.body.options;
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      const owner = decoded.id;
      const newPoll = new PollModel({ title, is_multiple, options, owner, votes: new Array(options.length).fill(0), user_voted: [] });
  
      newPoll.save()
        .then(() => {
          console.log("Poll saved");
          res.json(newPoll);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: "Error saving poll" });
        });
    });
  });

  app.post("/login", (req, res) => {
    const { email, password } = req.body;

    UserModel.findOne({ email })
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "No user found with that email" });
                return;
            }

            bcrypt.compare(password, user.password, function(err, result) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: "Error comparing passwords" });
                    return;
                }

                if (result) {
                    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });

                    res.status(200).json({ message: "Login successful", token, userId: user._id });
                } else {
                    res.status(401).json({ message: "Invalid password" });
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Error logging in" });
        });
});

    app.patch("/polls/vote/:id", async (req, res) => {
        const authHeader = req.headers.authorization;
        console.log(authHeader, req.body);
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }
    
        const token = authHeader.split(' ')[1];
    
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }
        
            const userId = decoded.id; 
        
            try {
                const updatedDoc = await PollModel.findOneAndUpdate(
                    { _id: req.params.id },
                    { 
                        $push: { user_voted: userId },
                        $set: { votes: req.body.votes }
                    },
                    { new: true }
                );
                console.log(updatedDoc);
                res.json(updatedDoc);
            } catch (err) {
                console.log("Something wrong when updating data!");
                res.status(500).json({ error: 'Error updating data' });
            }
        });
    });

app.post("/logout", authenticate, (req, res) => {
  
    res.json({ message: "Logged out successfully" });
});

app.get("/polls", (req, res) =>{
    PollModel.find({})
        .then(function(polls){
            console.log("i got the pools")
            console.log(polls)
            res.json(polls)
        })
        .catch(function(err){
            console.log(err)
        })
    }
)   

app.delete("/polls/:id", (req, res) => {
    const pollId = req.params.id;

    PollModel.findOneAndDelete({ _id: pollId })
        .then(deletedPoll => {
            if (deletedPoll) {
                res.status(200).json({ message: "Poll deleted successfully" });
            } else {
                res.status(404).json({ message: "No poll found with that ID" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Error deleting poll" });
        });
});


app.listen(5000, () => {
    console.log("Server is running")
})