var mongoose = require("mongoose");
var winston = require('winston');

var Question = require("./../models/question.js");

module.exports = {

	addQuestion: function(question){
		Question.create(question, function(err, questionMade){
			if(err){
				winston.error("Error on question entry: " + err);
			}

			winston.info("Question has been entered");
		})
	},

	getCategoryQuestion: function(category, callback){
		Question.find({category: category}, function(err, questionArray){
			if(err){
				winston.error("Error on category entry: " + err);
			}

			winston.info(category + " was pulled from the database!");

			callback(null, questionArray);
		});
	}

}