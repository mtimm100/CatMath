var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Player = new mongoose.Schema({
	username: { type: String, unique: true },
	score: Number,
	password: String,
	questionsAttempted: Number,
	questionsSolved: Number,
	lives: Number,
	questionsWrong: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Question"
	}]
})

module.exports = mongoose.model('Player', Player);