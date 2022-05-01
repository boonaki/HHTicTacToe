/* 100devs tic-tac-toe js */
/*https://github.com/Dev-Corinne/TicTacToe*/


const rowSize = 3;
// we will declare a variable for when a box is selected.
const box = document.querySelectorAll('.box')

// this function will determine the winner and alert it.
const winner = () => {

}

// this function will decide if the game was a tie and will alert if the game is a tie,
const tie = () => {

}

// this function will be used to reset the board when the restart button is clicked.
const restart = () => {
	/* Need to toggle off innerHTML (x and O). Will look similar to
    document.getElementById(i.target.id).innerHTML = '';. I played around with it for a bit
    but I don't have time to get it to work!*/
}

class Square {
	constructor(id) {
		this.id = id;
		this.status = -1;
	}

	getId() {
		return this.id;
	}

	setOwner(owner) {
		// set status to whichever player owns the square
		this.status = owner;
	}

	displayOwner(owner) {
		// for now assume ai is
	}

	getOwner() {
		return this.status;
	}

	isOwned() {
		return this.status != -1;
	}

	reset() {
		this.status = -1;
		document.getElementById(this.id).innerHTML = ""
	}
}

class GameBoard {
	constructor() {
		this.board = null;
		this.moves = new Map();
		// this.ai = new AI();
		this.won = false;
		this.score = this.initScore();
		this.createBoard();
	}

	debug() {
		console.log(this.board)
		console.log(this.moves)
	}

	initScore() {
		if (!localStorage.getItem('score')) {
			localStorage.setItem('score', JSON.stringify(Array.from(new Map([["x", 0], ["o", 0]]))));
		}
		return new Map(JSON.parse(localStorage.getItem('score')));
	}

	createBoard() {
		let ret = [];
		for (let i = 0; i < rowSize ** 2; i++) {
			ret.push(new Square(i));
		}
		this.board = ret;
	}

	getBoard() {
		return this.board;
	}

	/**
	 * On click function, main entrypoint
	 * @param player
	 * @param loc
	 * @return {boolean}
	 */
	onClick(player, loc) {
		if (!this.board[loc].isOwned() && !this.won) {
			this.board[loc].setOwner(player);
			console.log(`Player ${player} now owns square ${loc}`)
			// this.moves.push(loc);
			this.moves.set(loc, player)
			document.getElementById(loc).innerHTML = 'X'
			this.checkWinner(1)
			return true;
			//AI's turn
			// let ai_loc = this.ai.choice(loc)
			// if (!this.board[ai_loc].isOwned()) {
			// 	this.board[ai_loc].setOwner(0)
			// 	this.moves.set(ai_loc, 0)
			// 	this.checkWinner()
			// }

		} else {
			console.log(`Square ${loc} is already owned by ${
				((this.board[loc].getOwner() === 1) ? "Player" : "AI")}`)
			return false;
		}
	}

	setAI(type) {
		// STUB, to hook once the AI js is committed to the repo
		// reset board
		this.resetBoard()
		console.log(type)

	}

	resetBoard() {
		for (const sq of this.board) {
			sq.reset();
			this.moves = new Map();
			this.won = false;
		}
	}

	/**
	 * Checks for a winner
	 * @example checkWinner(1)
	 * @param {number} player either 1 for human, or 0 for AI
	 * @return {(number|null)} -1 for tie or player on win. If neither return null when there is no winner
	 */
	checkWinner(player) {
		// Only check for winning moves after 5 moves, there no possible win before that
		// (3 moves from player 0, 2 moves from player 1)
		// returns two boolean values, one if game is finished (two cases, in the case of tie/win)
		// Return values: -1 in case of tie, otherwise the player on a win, or null in case there is no
		// winner.
		if (this.moves.size > 2) {
			if (this.moves.size === rowSize ** 2) {
				console.log(`${player} has tied`);
				// return tie
				return -1;
			}
			for (let i = 0; i < 7; i++) {
				if (this.board[i].getOwner() === player) {
					if (i < rowSize) {
						if (player === this.board[i + 3].getOwner() &&
							this.board[i + 6].getOwner() === player) {
							//vertical win
							console.log(`${player} has won!`);
							this.setWinner(player);
							return player;
						}
						if (!(i % 2)) {
							// only check 0 and 2
							if (player === this.board[((i === 0) ? 4 : 2) * 1].getOwner() &&
								this.board[((i === 0) ? 4 : 2) * 2].getOwner() === player) {
								//diagonal win
								console.log(`${player} has won!`);
								this.setWinner(player);
								return player;
							}
						}
					}
					if (!(i % 3)) {
						if (player === this.board[i + 1].getOwner() &&
							this.board[i + 2].getOwner() === player) {
							// horizontal win
							console.log(`${player} has won!`);
							this.setWinner(player);
							return player;
						}
					}
				}
			}
		} else {
			// No one has won yet
			return null;
		}
	}

	setWinner(player) {
		this.won = true;
		(player) ? this.score.set("x", this.score.get("x") + 1) : this.score.set("o", this.score.get("o") + 1)
		this.onScoreChange();
		this.saveScore();
	}

	onScoreChange() {
		for (const [player, score] of this.score.entries()) {
			document.getElementById(`${player}Value`).innerText = score.toString();
		}
	}

	saveScore() {
		console.log(this.score)
		localStorage.setItem('score', JSON.stringify(Array.from(this.score)))
	}

	resetScore() {
		for (const player of this.score.keys()) {
			this.score.set(player, 0);
		}
		this.onScoreChange();
		this.resetBoard();
	}
}


const gameBoard = new GameBoard();
gameBoard.onScoreChange();
// All of this could be inside the gameBoard object, but not a big deal to have it here.

// formats our querySelector from a nodeList to array.
const grid = [...document.querySelectorAll(".box")];
for (let i = grid.length; i--;) {
	grid[i].addEventListener("click", (i) => gameBoard.onClick(1, i.target.id))
}
// we will declare a reset variable that when the reset button is clicked a fresh start happens.
const restartButton = document.getElementById("restart")
if (restartButton) {
	restartButton.addEventListener("click", _ => gameBoard.resetBoard())
}
const setAIButton = document.getElementById("ai_change")
if (setAIButton) {
	setAIButton.addEventListener("click", _ =>
		gameBoard.setAI(document.getElementById("idSelect").value))
}
const setResetButton = document.getElementById("reset_score")
if (setResetButton) {
	setResetButton.addEventListener("click", _ => gameBoard.resetScore())
}

//contributors:
//We the people of 100Devs, 100baristas,
//Cormasaurus#4787
//colinnn#1406
//colin's dog, choco bork bork
//San An Stan#3218
//Mish#5762
//yoda30010#9626 (boonaki)
//itmightbehere#69130
//Michael the cat =^_^=
//TheCrazyHorse#9867
//WiseOak#4084
//Someone#7786
//OmNomNom#6057
//NicLe#5006
//DeMe#4447;