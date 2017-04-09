var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


var Question = new mongoose.Schema({
	question: String,
	mc1: {answer: String, correct: Boolean},
	mc2: {answer: String, correct: Boolean},
	mc3: {answer: String, correct: Boolean},
	mc4: {answer: String, correct: Boolean},
	howToSolve: String,
	timesAttempted: Number,
	timesSolved: Number,
	value: Number,
	category: String
})

module.exports = mongoose.model('Question', Question);