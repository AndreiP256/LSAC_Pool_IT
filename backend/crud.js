const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { PollModel } = require('./models.js');

const secret = 'lsac_poll';

router.use(cors());
router.use(bodyParser.json());
const verifyToken = require('./authmiddleware.js');

router.post("/polls", verifyToken, (req, res) => {
  const { title, is_multiple, options } = req.body;
  const owner = req.userId;
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

router.patch("/polls/vote/:id", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const poll = await PollModel.findById(req.params.id);
    if (poll.user_voted.includes(userId)) {
      return res.status(400).json({ error: 'User has already voted' });
    }

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

router.get("/polls", (req, res) => {
  PollModel.find({})
    .then(function(polls){
      console.log("i got the pools")
      console.log(polls)
      res.json(polls)
    })
    .catch(function(err){
      console.log(err)
    })
});

router.delete("/polls/:id", verifyToken, async (req, res) => {
    const userId = req.userId;
  
    try {
      const poll = await PollModel.findById(req.params.id);
      if (!poll) {
        return res.status(404).json({ message: "No poll found with that ID" });
      }
  
      if (poll.owner.toString() !== userId) {
        return res.status(403).json({ message: "User is not the owner of the poll" });
      }
  
      const deletedPoll = await PollModel.findOneAndDelete({ _id: req.params.id });
      res.status(200).json({ message: "Poll deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting poll" });
    }
  });
  
  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An error occurred' });
  });
  
  module.exports = router;