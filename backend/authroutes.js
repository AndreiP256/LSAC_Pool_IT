const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('./models');
const router = express.Router();
const saltRounds = 10;
const secret = 'lsac_poll';

router.post("/new", (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error hashing password" });
      return;
    }

    const newUser = new UserModel({ name, email, password: hash });

    newUser.save()
      .then(() => {
        console.log("User saved");
        res.json(newUser);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Error saving user" });
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