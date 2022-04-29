/* 100devs tic-tac-toe js */
https://github.com/Dev-Corinne/TicTacToe

// Event listener for each cell.
document.querySelector('#one').addEventListener('click', ()=>{

})
document.querySelector('#two').addEventListener('click', )
document.querySelector('#three').addEventListener('click', )
document.querySelector('#four').addEventListener('click', )
document.querySelector('#five').addEventListener('click', )
document.querySelector('#six').addEventListener('click', )
document.querySelector('#seven').addEventListener('click', )
document.querySelector('#eight').addEventListener('click', )
document.querySelector('#nine').addEventListener('click', )

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