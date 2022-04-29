/* 100devs tic-tac-toe js */
https://github.com/Dev-Corinne/TicTacToe

// we will declare a reset variable that when the reset button is clicked a fresh start happens.
const restartButton = document.querySelectorAll('#reset')

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
	
}

// Conditional - If three in a row are selected by either the user or AI. The game ends. If all squares are selected and three in a row does not occur. It is a draw.
// Conditional - Three in a row means [0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,5,8], [2,4,6], [3,4,5], or [6,7,8] all have the same value.
// Horizontally => 0,1,2; 3,4,5; 6,7,8
// Vertically => 0,3,6; 1,4,7; 2,5,8
// Diagonally => 0,4,8; 2,4,6
// Conditional - If any square is selected by either User or AI. The square cannot be reselected. 
// Conditional - The player and the ai can each only make one move per turn.
// Conditional - 

//DIRECTIONS
//player's turn: player click adds square number to array 'playerMove'
//bot move: bot adds random number to array 'botMove'

let ticTacToe = [0,0,0,0,0,0,0,0,0]
let playerMove = []
let botMove = []
let chooseRandom = Math.floor(Math.random()*9)

/*
0 1 2
3 4 5
6 7 8

Win conditions:
012
345
678

036
147
258

048
246
*/

switch (playerMove) {
	case [0,1,2]:
  case [0,3,6]:
  case [0,4,8]:
  case [3,4,5]:
  case [1,4,7]:
  case [2,4,6]:
  case [6,7,8]:
  case [2,5,8]:
  	return ('Player wins!')
    break;
  default:
  	return ('Tie!')
} 

class Squares {
	constructor(id) {
		this.id = id
    this.status = 0; 
	}
  getId() {
		return this.id; 
	}
  changeStatus(){
	 	this.status = 1; 
	}
}

class gameBoard {
	constructor(board){
		this.board = board;
	}

	createBoard(){
		for(let i =0; i < 9; i++){
			let square = new Square(i);
			board.push(square);
		}
	}
	getBoard() {
		return this.board; 
	}
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
