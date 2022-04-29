/* 100devs tic-tac-toe js */
https://github.com/Dev-Corinne/TicTacToe

// Event listener for each cell.
document.querySelector('#one').addEventListener('click', )
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
//Horizontally=> 0,1,2; 3,4,5; 6,7,8
// Vertically => 0,3,6; 1,4,7; 2,5,8
Diagonally=>0,4,8; 2,4,6
// Conditional - If any square is selected by either User or AI. The square cannot be reselected. 
// Conditional - The player and the ai can each only make one move per turn.

let ticTacToe = [0,0,0,0,0,0,0,0,0]
let chooseRandom = Math.floor(Math.random()*9)
// Would we minus the number 9 by how many squares are currently occupied?

/*
0 1 2
3 4 5
6 7 8
*/

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
  

}
