var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = require('express').Router();
var winston = require('winston');
var async = require('async');

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var questionController = require('./controllers/question.js');
var playerController = require('./controllers/player.js');
var Question = require('./models/question.js');

var app = express();


var clients = [];

io.on("connection", function(socket) {

    var currentUser = {



    };

    socket.on("USER_CONNECT", function() {
        winston.info("User Connected!");
        for (var i = clients.length; i++;) {
            socket.emit("USER_CONNECTED", { name: clients[i].name, position: clients[i].position });

            winston.info("User Name: " + clients[i].name + " is Connected");
        }
    });

    socket.on("GET_QUESTION_CATEGORY", function(data) {
        winston.info("!!!!!!!!!!!!!!!!!!!!" + data.category);
        questionController.getCategoryQuestion(data.category, function(err, questionSet) {
        	for (var i = 0; i < questionSet.length; i++) {
        		socket.emit("QUESTION_CATEGORY_RESPONSE",questionSet[i]);
        	}
        })
    });

    socket.on("LOGIN", function(data) {

        playerController.loginPlayer(data.username, data.password, function(err, response) {
            socket.emit("LOGIN_RESPONSE", response);
            winston.info("Login hit! response is: " + response);
        });
    })

    socket.on("SIGNUP", function(data) {

        var newPlayer = {
            username: data.username,
            password: data.password,
            lives: 9,
            score: 100
        }

        playerController.addNewPlayer(newPlayer, function(err, response){
        	socket.emit("SIGNUP_RESPONSE", response);
            winston.info("Sign up!! response is: " + response);       	

        });
    })

    socket.on("disconnect", function() {
        //socket.broadcast.emit("USER_DISCONNECTED", currentUser);
        // for (var i = 0; i < clients.length; i++) {
        //     if (clients[i].name === currentUser.name) {
        //         winston.info("User " + clients[i].name + " disconnected");
        //         clients.splice(i, 1);
        //     }
        //}
    });

})

//Set Port
app.set('PORT', process.env.PORT || 3000);
//Set Socket IO PORT
app.set('SOCKET_PORT', process.env.PORT || 3001);
//MongoDB 
mongoose.connect("mongodb://127.0.0.1/topcat");

// set up handlebars view engine
var handlebars = require('express-handlebars')
    .create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.render("home");
})

app.post('/addQuestion', function(req, res) {


    var Question = {
        question: req.body.question,
        mc1: { answer: req.body.mc1, correct: true },
        mc2: { answer: req.body.mc2, correct: false },
        mc3: { answer: req.body.mc3, correct: false },
        mc4: { answer: req.body.mc4, correct: false },
        value: 100,
        howToSolve: req.body.howToSolve,
        category: req.body.category
    }

    questionController.addQuestion(Question);


    res.send(Question);
});

app.post('/newPlayer', function(req, res) {
    var newPlayer = {
        username: req.body.username,
        password: req.body.password,
        lives: 9,
        score: 100
    }

    playerController.addNewPlayer(newPlayer);

    res.redirect('/');

})

app.post('/loginPlayer', function(req, res) {
    playerController.loginPlayer(req.body.username, req.body.password);

    res.redirect('/');
})

app.get('/questions', function(req, res) {
    Question.find(function(err, questions) {
        if (err) {
            winston.error(err);
        }
        res.render("questions", { questions: questions });
    })
})

// Socket IO Server Listen
server.listen(app.get('SOCKET_PORT'), function() {
    console.log("Socket IO Running on: " + app.get('SOCKET_PORT'));
});

// Web Port
app.listen(app.get('PORT'), function() {
    console.log("Website Running on: " + app.get('PORT'));
});
