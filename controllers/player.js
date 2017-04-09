var mongoose = require("mongoose");
var winston = require('winston');

var Player = require('./../models/player.js');

module.exports = {

    addNewPlayer: function(player, callback) {
        Player.create(player, function(err, newPlayer) {
            if (err) {
                winston.error("Error when adding new player: " + err);
                return;
            }
            winston.info(newPlayer.username + " has become a Top Cat.");

            callback(null, newPlayer);
        })
    },

    loginPlayer: function(username, password, callback) {
        console.log(username + " " + password);
        var userSearch = {
            username: username
        }
        var response;
        Player.findOne(userSearch, function(err, foundPlayer) {

            winston.info(password + " should = " + foundPlayer.password);
            if (err) {
                winston.info("Error when trying to login: " + err);
            }
            if (!foundPlayer) {
                winston.info("Player with username: " + username + " not found!");
                response = { message: "Player Not Found" };
            }
            if (foundPlayer) {
                if (foundPlayer.password === password) {
                    winston.info(foundPlayer.username + " has logged in!");
                    response = foundPlayer;
                    winston.info("this is : " + response);
                } else {
                    winston.info("Wrong Password " + username);
                    response = { message: "Wrong Password" }

                }

            }
            callback(null, response);
        });

    }


}
