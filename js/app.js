/* 100devs tic-tac-toe js */
/*https://github.com/Dev-Corinne/TicTacToe*/

import {Ai} from "./ai.mjs";

const rowSize = 3;
// we will declare a variable for when a box is selected.
const box = document.querySelectorAll('.box');

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
    }

    getOwner() {
        return this.status;
    }

    isOwned() {
        return this.status !== -1;
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
        //Send a reference to the parent object
        this.ai = new Ai(this);
        this.won = false;
        this.tied = false;
        this.score = this.initScore();
        this.createBoard();
        this.multiplayer = false;
        // start with player 1
        this.currentPlayer = 1;
    }

    debug() {
        console.log(this.board);
        console.log(this.moves);
    }

    initScore() {
        if (!localStorage.getItem('score')) {
            localStorage.setItem('score',
                JSON.stringify(Array.from(new Map([["x", 0], ["o", 0]]))));
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

    setMultiplayer() {
        this.resetBoard()
        this.multiplayer = (!this.multiplayer);
    }

    /**
     * On click function, main entrypoint
     * @param loc
     * @return {boolean}
     */
    onClick(loc) {

        this.choice(loc);

        if (this.multiplayer) {
            this.currentPlayer = (this.currentPlayer === 1) ? 2 : 1
        } else {
            // TODO: need to plug in Ai move
            this.choice(loc);
            //Ai's turn
            if (this.won || this.tied){return true}
            let ai_loc = this.ai.choice(loc)
            console.log(ai_loc)
            this.currentPlayer = (this.currentPlayer === 1) ? 2 : 1
            this.choice(ai_loc)
            this.currentPlayer = (this.currentPlayer === 1) ? 2 : 1
        }
    }

    /**
     * Checks location is a valid choice, if so then set the square and check if it's a winning move.
     * @param loc {number} location in the array.
     */
    choice(loc) {
        // TODO: decide to keep if else chain like this or nest branches.
        if (!this.board[loc].isOwned()  && !this.won && !this.tied) {
            this.board[loc].setOwner(this.currentPlayer);
            console.log(`Player ${this.currentPlayer} now owns square ${loc}`);
            this.moves.set(loc, this.currentPlayer);
            console.log("CP", this.currentPlayer)
            document.getElementById(loc.toString()).innerHTML = (this.currentPlayer === 1) ? 'X' : 'O';
            this.checkWinner(loc);
        } else if (this.board[loc].isOwned()) {
            console.log(`Square ${loc} is already owned by ${
                ((this.board[loc].getOwner() === 1) ? "Player" : "AI")}`);
        } else {
            // console.log(this.won, )
            console.log("Game already decided");
        }
    }

    setAI(type) {
        // STUB, to hook once the Ai js is committed to the repo
        // reset board
        this.resetBoard();
        this.ai.setAi(type)
        console.log(type);

    }

    /**
     * Checks for a winner
     * @example checkWinner(1)
     * @param {number} loc either 1 for human, or 0 for Ai
     * @return {(number|null)} -1 for tie or player on win. If neither return null when there is no winner
     */
    checkWinner(loc) {
        let check = this.checkWinnerHelper(loc);
        // -1 and null should be falsy, so it's an easy if check
        if (check === 1 || check === 2){
            console.log(`${this.currentPlayer} has won!`);
            this.setWinner(this.currentPlayer);
        }
        return check;
    }
    checkWinnerHelper(loc){
        // Only check for winning moves after 5 moves, there no possible win before that
        // (3 moves from player 0, 2 moves from player 1)
        // returns two boolean values, one if game is finished (two cases, in the case of tie/win)
        // Return values: -1 in case of tie, otherwise the player on a win, or null in case there is no
        // winner.
        if (this.moves.size > 2) {
            for (let i = 0; i < 7; i++) {
                if (this.board[i].getOwner() === this.board[loc].getOwner()) {
                    if (i < rowSize) {
                        if (this.board[loc].getOwner() === this.board[i + 3].getOwner() &&
                            this.board[i + 6].getOwner() === this.board[loc].getOwner()) {
                            //vertical win
                            return this.currentPlayer;
                        }
                        if (!(i % 2)) {
                            // only check 0 and 2
                            if (this.board[i].getOwner() === this.board[4].getOwner() &&
                                this.board[((i === 0) ? 4 : 3) * 2].getOwner() === this.board[i].getOwner()) {
                                //diagonal win
                                return this.currentPlayer;
                            }
                        }
                    }
                    if (!(i % 3)) {
                        if (this.board[loc].getOwner() === this.board[i + 1].getOwner() &&
                            this.board[i + 2].getOwner() === this.board[loc].getOwner()) {
                            // horizontal win
                            return this.currentPlayer;
                        }
                    }
                }
            }
            if (this.moves.size === rowSize ** 2) {
                this.tied = true;
                console.log(`${this.currentPlayer} has tied`);
                // return tie
                return -1;
            }
        } else {
            // No one has won yet
            return null;
        }
    }
    setWinner(player) {
        console.log("W:", player)
        this.won = true;
        (player === 1) ? this.score.set("x", this.score.get("x") + 1) : this.score.set("o", this.score.get("o") + 1)
        this.onScoreChange();
        this.saveScore();
    }

    onScoreChange() {
        for (const [player, score] of this.score.entries()) {
            document.getElementById(`${player}Value`).innerText = score.toString();
        }
    }

    saveScore() {
        // console.log(this.score);
        localStorage.setItem('score', JSON.stringify(Array.from(this.score)));
    }

    resetBoard() {
        this.currentPlayer = 1;
        this.ai.reset();
        this.won = false;
        this.tied = false;
        for (const sq of this.board) {
            sq.reset();
            this.moves = new Map();
            this.won = false;
        }
    }

    resetScore() {
        for (const player of this.score.keys()) {
            this.score.set(player, 0);
        }
        this.saveScore();
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
    grid[i].addEventListener("click", (i) => gameBoard.onClick(i.target.id));
}
// we will declare a reset variable that when the reset button is clicked a fresh start happens.
const restartButton = document.getElementById("restart")
if (restartButton) {
    restartButton.addEventListener("click", _ => gameBoard.resetBoard());
}
const setAIButton = document.getElementById("ai_change");
if (setAIButton) {
    setAIButton.addEventListener("click", _ =>
        gameBoard.setAI(document.getElementById("idSelect").value));
}
const setResetButton = document.getElementById("reset_score");
if (setResetButton) {
    setResetButton.addEventListener("click", _ => gameBoard.resetScore());
}
const setMultiplayerButton = document.getElementById("multiplayer");
if (setMultiplayerButton) {
    setMultiplayerButton.addEventListener("click", _ => {
        gameBoard.setMultiplayer();
        setMultiplayerButton.innerText = `${(Number(setMultiplayerButton.value)) ? "Enable" : "Disable"} multiplayer`;
        setMultiplayerButton.value = `${(Number(setMultiplayerButton.value)) ? 0 : 1}`;
    })
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
