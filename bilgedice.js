#!/usr/local/bin/node

// bilge dice is a game from neopets
// each player can keep 6 dice
// they must keep a 1 & 4 as qualifiers
// you can keep any amount of dice per round and your aim is for the highest
// the best score is a 24, highest score wins

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

process.stdin.on('data', function (text) {
	console.log('received data:', util.inspect(text));
	if (text === 'quit\n') {
		done();
	}
});

function done() {
	console.log('Thanks for playing Bilge Dice!');
	process.exit();
}

var Player = function (player) {
	this.player = player;
	this.hand = [];
};

function rollDice (sides, rolls) {
	var currentRolls = [];
	for (var j = 0; j < rolls; j++) {
		currentRolls.push(Math.floor(Math.random() * sides + 1));
	}
	return currentRolls;
};

function runGame() {
	for (var i = 2; i < process.argv.length; i++) {
		console.log("PLAYER " + process.argv[i]);
		var player = new Player(process.argv[i]);
		
		player.returnHand();
		player.getDiceChoices();
		console.log("---")
	}
};

Player.prototype.returnHand = function () {
	console.log("My hand: " + (this.hand.length === 0 ? "blank" : this.hand));
};

Player.prototype.getDiceChoices = function () {
	var length = this.hand.length;
	
	if (length < 6) {
		console.log("My choices: " + rollDice(6, 6 - length));
	}
};

function round(num) {
	console.log("Welcome to round " + num + " of Bilge Dice!");
	num++;
};


round(1);

runGame();