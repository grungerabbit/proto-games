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
	
	if (text === 'reset\n') {
		console.log("You have reset the game!");
		console.log("Starting over...");
		runGame();
		return;
	}
	
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
var comp = 0;
var human = 1;
var width = process.stdout.columns;

var Player = function (player) {
	this.player = player;
	this.hand = [];
	this.round = 1;
	this.total = 0;
	this.computer = false;
	this.finished = false;
};

function generateHR (character) {
	var rule = "";
	for (var y = 0; y < width; y++) {
		rule += character;
	}
	console.log(rule);
}

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
		
		
		
		generateHR("/");
		console.log("// Welcome to Bilge Dice!");
		console.log("// Bilge Dice is a game from Neopets");
		console.log("// Each player can keep 6 dice");
		console.log("// You must keep one 1 and one 4 as qualifiers");
		console.log("// You can keep any amount of dice per round but at least one");
		console.log("// The highest score wins");
		console.log("// A perfect score is 24, bonus if you get it!");
		generateHR("/");
	}
	
	for (var q = 0; q < players.length; q++) {
		var player = players[q];
		
		if (moves && player.adjustHand(moves) === true) {
			player.round++;
		}
		if (q === 0) {
			generateHR("~");
		}
		
		
		player.checkComputer();
		player.getRound();
		player.getName();
		player.returnHand();
		player.getDiceChoices();
		console.log("---");
	}
	
	console.log(" ");
	console.log(" ");

	if (players[comp].finished === true && players[human].finished === true) {
		generateHR("/");
		console.log("GAME OVER!");
		
		if (players[human].total > players[comp].total) {
			console.log("YOU WIN!");
		} else if (players[human].total === players[comp].total) {
			console.log("Nice tie.");
		} else {
			console.log("Computer wins. whrrrrrhrrrr...");
		}
		generateHR("/");
	} else if (players[human].finished === true || players[comp].finished === true) {
		console.log("> press enter to continue...");
	} else {
		console.log("> Player " + players[human].player + ", please choose your dice!");
		if (players[human].round === 1) {
			console.log("> The command is > keep #,#");
			console.log("> Remember, you need 1 and 4 & want the highest score possible.");
			console.log(" ");
		}
	}
};

Player.prototype.checkComputer = function () {
	if (this.player === "computer") {
		this.computer = true;
	}	
};

Player.prototype.getName = function () {
	var message = "PLAYER " + this.player.toUpperCase();
	var border = "";
	console.log(message);

	for (var n = 0; n<message.length; n++) {
		border += "=";
	}
	
	console.log(border);
};


Player.prototype.adjustHand = function (moves) {
	var self = this;
	 if (this.player === players[human].player) {
		if (moves[0] === "keep") {
			var adjMoves = moves[1];
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
		console.log("The computer has selected " + (this.hand.length + 1) + " dice.");
	} else {
		console.log("Your hand: " + (this.hand.length === 0 ? "empty" : this.hand));	
	}
};

Player.prototype.checkValid = function () {
	var one = this.computer ? 1 : "1";
	var four = this.computer ? 4 : "4";
	
	return (this.hand.indexOf(one) !== -1 && this.hand.indexOf(four) !== -1) ? true : false;
};

Player.prototype.getComputerChoices = function (choices) {
	this.round++;
	//console.log("Sorry Dave, I'm afraid I can't do that.")
	//console.log("secret computer input: " + choices);
	
	var in1 = choices.indexOf(1);
	var in4 = choices.indexOf(4);
	
	// computer qualifiers
	if (in1 !== -1 && this.hand.indexOf(1) === -1) {
		this.hand.push(choices[in1]);
		return;
	} else if (in4 !== -1 && this.hand.indexOf(4) === -1) {
		this.hand.push(choices[in4]);
		return;
	}
	
	var sorted = choices.sort();
	this.hand.push(sorted[sorted.length - 1]);
	//console.log("Computer hand: " + this.hand);
	
	if (this.hand.length === 6) {
		console.log("Computer's hand: " + this.hand);
		this.playerResults();
	}
};

Player.prototype.getDiceChoices = function () {
	var length = this.hand.length;
	
	if (length >= 6) {
		this.playerResults();
		return;
	} else {
		if (this.computer) {
			this.getComputerChoices(rollDice(6, 6 - length));
			return;
		}
		console.log("Your choices: " + rollDice(6, 6 - length));
	}
};

Player.prototype.playerResults = function () {
	if (this.checkValid() === true) {
		for (var w = 0; w < 6; w++) {
			if (this.finished === true) { break; }
			this.total += parseInt(this.hand[w]);
		}
		this.total -= this.finished === true ? 0 : 5; //adjustment for qualifiers
		console.log("Player " + this.player + " final score: " + this.total);
		this.finished = true;
		
		if (this.total === 24) {
			console.log("Perfect score!");
			this.autowin();
		}
	} else {
		console.log("Player " + this.player + " failed to qualify!");
		this.total = 0;
		this.finished = true;
	}	
};

Player.prototype.autowin = function () {
	console.log("A perfect win means you can't lose! Woo hoo!");
	console.log("GAME OVER!");
	return;
};

Player.prototype.getRound = function () {
	console.log(" ");
	console.log("Round " + this.round);
};

runGame();