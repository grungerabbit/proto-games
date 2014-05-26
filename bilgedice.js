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
	return Math.floor(Math.random() * sides + 1);
};

function runGame(players) {
	for (var i = 0; i < players.length; i++) {
		console.log(players[i]);
		var player = new Player(players[i]);
	}
};

function round(num) {
	console.log("Welcome to round " + num + " of Bilge Dice!");
	num++;
};

console.log(rollDice(6, 6));

round(0);

runGame()