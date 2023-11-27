const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const app = express();

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

app.post("/new_poll", (req, res) => {
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
                    res.json({ message: "Logged in successfully", token: token, userId: user._id });
                    console.log("Logged in ",user._id )
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

    app.put("/update_pool", async (req, res) => {
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
                    { _id: req.body.id },
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

app.post("/delete_pool", (req, res) => {
    const pollId = req.body.id;

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