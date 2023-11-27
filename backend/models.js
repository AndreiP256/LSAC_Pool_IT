const mongoose = require('mongoose');

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

module.exports = { UserModel, PollModel };