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
//	console.log('received data:', util.inspect(text));
	var moves = util.inspect(text).slice(1, -3).split(" ");
		
	runGame(moves);
	
	if (text === 'quit\n') {
		done();
	}
});

function done() {
	console.log('Thanks for playing Bilge Dice!');
	process.exit();
}

var players = [];

var Player = function (player) {
	this.player = player;
	this.hand = [];
	this.round = 1;
	this.total = 0;
	this.computer = false;
};

function rollDice (sides, rolls) {
	var currentRolls = [];
	for (var j = 0; j < rolls; j++) {
		currentRolls.push(Math.floor(Math.random() * sides + 1));
	}
	return currentRolls;
};

function runGame(moves) {
	if (!moves) {
		for (var i = 2; i < process.argv.length; i++) {
			players.push(new Player(process.argv[i]));
		}
	}
	
	for (var q = 0; q < players.length; q++) {
		var player = players[q];
		
		if (moves && player.adjustHand(moves) === true) {
			player.round++;
		}
		
		player.checkComputer();
		
		player.getRound();
		player.getName();
		player.returnHand();
		player.getDiceChoices();
		console.log("---");
	}
};

Player.prototype.checkComputer = function () {
	if (this.player === "computer") {
		console.log("I AM A COMPUTER");
		console.log("RUN COMPUTER THINGS INSTEAD");
		this.computer = true;
	}	
};

Player.prototype.getName = function () {
	console.log("PLAYER " + this.player.toUpperCase());
};

Player.prototype.adjustHand = function (moves) {
	var self = this;
	if (this.player === moves[0]) {
		if (moves[1] === "keep") {
			var adjMoves = moves[2];
			var movesArray = adjMoves.match(",") ? adjMoves.split(",") : adjMoves;
			for (var k = 0; k < movesArray.length; k++) {
				self.hand.push(movesArray[k]);			
			}
			return true;
		}
	}
};


Player.prototype.returnHand = function () {
	if (this.computer) {
		console.log("The computer has selected " + this.hand.length + " cards.");
	} else {
		console.log("My hand: " + (this.hand.length === 0 ? "blank" : this.hand));	
	}
};

Player.prototype.checkValid = function () {
	return (this.hand.indexOf("1") !== -1 && this.hand.indexOf("4") !== -1) ? true : false;
};

Player.prototype.getComputerChoices = function (choices) {
	this.round++;
	console.log("Sorry Dave, I'm afraid I can't do that.")
	console.log("secret computer input: " + choices);
};

Player.prototype.getDiceChoices = function () {
	
	var length = this.hand.length;
	
	if (length === 6) {
		this.playerResults();
		return;
	} else {
		if (this.computer) {
			this.getComputerChoices(rollDice(6, 6 - length));
			return;
		}
		console.log("My choices: " + rollDice(6, 6 - length));
	}
};

Player.prototype.playerResults = function () {
	if (this.checkValid() === true) {
		for (var w = 0; w < 6; w++) {
			this.total += parseInt(this.hand[w]);
		}
		this.total -= 5; //adjustment for qualifiers
		console.log("Player " + this.player + " final score: " + this.total);
		if (this.total === 24) {
			console.log("Perfect score!");
		}
	} else {
		console.log("Player " + this.player + " failed to qualify!");
	}	
};

Player.prototype.getRound = function () {
	console.log("Welcome to round " + this.round + " of Bilge Dice!");
	console.log("$~*$~*$~*$~*$~*$~*$~*$~*$~*$~*$~*$~*$~*$~*$~*$");
};

runGame();