const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require('./models');
const router = express.Router();
const saltRounds = 10;
const secret = 'lsac_poll';

router.post("/new", (req, res) => {
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
                        .catch(err => {
                            console.error(err);
                            res.status(500).json({ message: "Error saving user" });
                        });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "Error finding user" });
            });
    });
});


router.post("/login", (req, res) => {
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

module.exports = router;