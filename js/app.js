/* 100devs tic-tac-toe js */
/*https://github.com/Dev-Corinne/TicTacToe*/

import {Ai} from "./ai.mjs";

const rowSize = 3;

class Square {
    constructor(id) {
        this.id = id;
        this.status = -1;
    }

    setOwner(owner) {
        // set status to whichever player owns the square
        this.status = owner;
    }

    getOwner() {
        return this.status;
    }

    isOwned() {
        return this.status !== -1;
    }

    reset() {
        this.status = -1;
        document.getElementById(this.id).innerText = "";
    }

}

class GameBoard {
    #won;
    #tied;

    constructor() {
        this.board = null;
        this.moves = new Map();
        //Send a reference of the GameBoard object
        this.ai = new Ai(this);
        this.#won = false;
        this.#tied = false;
        this.score = this.initScore();
        this.createBoard();
        this.multiplayer = false;
        // start with player 1
        this.currentPlayer = 1;
        this.winningMoves = [];
    }

    /**
     * Make sure there we keep track of the score, use local storage to do so.
     * @return {Map<String, Number>} Map containing our score in localStorage
     */
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

    setMultiplayer() {
        this.resetBoard();
        this.multiplayer = (!this.multiplayer);
    }

    /**
     * On click function, main entrypoint when the user clicks on the square
     * @param loc square location based on a 9 length array
     * @return {boolean}
     */
    onClick(loc) {
        if (this.multiplayer) {
            if (this.choice(loc)) {
                this.currentPlayer = (this.currentPlayer === 1) ? 2 : 1;
            }
        } else {
            if (this.choice(loc)) {
                //Ai's turn
                if (this.#won || this.#tied) {
                    return true;
                }
                // make sure we switch to the AI player
                this.currentPlayer = (this.currentPlayer === 1) ? 2 : 1;
                this.choice(this.ai.choice(loc));
                // AI has made its move, switch current player back to human.
                this.currentPlayer = (this.currentPlayer === 1) ? 2 : 1;
            }

        }
    }

    /**
     * Checks location is a valid choice, if so then set the square and check if it's a winning move.
     * @param loc {number} location in the array.
     */
    choice(loc) {
        // TODO: decide to keep if else chain like this or nest branches.
        if (!this.board[loc].isOwned() && !this.won && !this.tied) {
            this.board[loc].setOwner(this.currentPlayer);
            this.moves.set(loc, this.currentPlayer);
            document.getElementById(loc.toString()).innerText = (this.currentPlayer === 1) ? 'X' : 'O';
            this.checkWinner();
            return true;
        } else if (this.board[loc].isOwned()) {
            // TODO: Alert the player in the DOM?
            console.log(`Square ${loc} is already owned by ${
                ((this.board[loc].getOwner() === 1) ? "Player" : "AI")}`);
            return false;
        } else {
            // TODO: Alert the player in the DOM?
            console.log("Game already decided");
            return false;
        }
    }

    /**
     * Sets AI type from 0 easiest to 2 which is unwinnable
     * @param type {number} 0: easy, 1: random, 2: unwinnable
     */
    setAI(type) {
        this.resetBoard();
        this.ai.setAi(type);
        this.setAIToPage(type)
    }

    /**
     * Checks for a winner
     * @return {(number|null)} -1 for tie or player on win. If neither return null when there is no winner
     */
    checkWinner() {
        let check = this.checkWinnerHelper();
        if (check === 1 || check === 2) {
            console.log(`${this.currentPlayer} has won!`);
            this.setWinner(this.currentPlayer);
        }
        return check;
    }

    /**
     * Does the actual checking for wining scenarios.
     * @param player {number} when called from inside the function, uses the currentPlayer attribute,
     *  otherwise use specifies the player id to check for wining condition
     * @param moves  {number} the number of moves already made.
     * @param simulated {boolean} set to true if it is being called by CPU player
     * @return {null|number} returns either winning playerId (1 for player, 2 for AI),
     *  null on no win, and 0 on a tie.
     */
    checkWinnerHelper(player = this.currentPlayer, moves = this.moves.size,
                      simulated = false) {
        // in case this is being called for simulation, make sure we count all moves
        if (simulated) {
            moves += this.moves.size;
        }
        // Only check for winning moves after 5 moves, there no possible win before that
        // (3 moves from player 0, 2 moves from player 1)
        if (moves >= 5) {
            for (let i = 0; i < 7; i++) {
                if (this.board[i].getOwner() === player) {
                    if (i < rowSize) {
                        if (this.board[i].getOwner() === this.board[i + 3].getOwner() &&
                            this.board[i + 6].getOwner() === this.board[i].getOwner()) {
                            //vertical win
                            if (!simulated) {
                                this.highlight_win(i, i + 3, i + 6);
                            }
                            return player;
                        }
                        if (!(i % 2)) {
                            // only check 0 and 2
                            let d1 = ((i === 0) ? 4 : 3) * 2;
                            if (this.board[i].getOwner() === this.board[4].getOwner() &&
                                this.board[d1].getOwner() === this.board[i].getOwner()) {
                                //diagonal win
                                if (!simulated) {
                                    this.highlight_win(i, 4, ((i === 0) ? 4 : 3) * 2);
                                }
                                return player;
                            }
                        }
                    }
                    if (!(i % 3)) {
                        if (this.board[i].getOwner() === this.board[i + 1].getOwner() &&
                            this.board[i + 2].getOwner() === this.board[i].getOwner()) {
                            // horizontal win
                            if (!simulated) {
                                this.highlight_win(i, i + 1, i + 2);
                            }
                            return player;
                        }
                    }
                }
            }
            if (moves === rowSize ** 2) {
                if (!simulated) {
                    this.#tied = true;
                    console.log(`${player} has tied`);
                }
                // return tie
                return 0;
            }
        }
        // no winners
        return null;
    }

    resetColor() {
        for (const square of this.winningMoves) {
            document.getElementById(`${square}`).style.color = "#AAA";
        }
        this.winningMoves = []
    }

    /**
     * highlights winning squares
     * @param {...number} squares set of squares that are the winning set
     */
    highlight_win(...squares) {
        this.winningMoves = squares;
        for (const square of squares) {
            document.getElementById(`${square}`).style.color = "red";
        }
    }

    /**
     * Sets winner in code, in the DOM, and localstorage
     * @param player {number} Player that won the game.
     */
    setWinner(player) {
        this.#won = true;
        if (player === 1) {
            this.score.set("x", this.score.get("x") + 1);
        } else {
            this.score.set("o", this.score.get("o") + 1);
        }
        this.onScoreChange();
        this.saveScore();
    }

    onScoreChange() {
        for (const [player, score] of this.score.entries()) {
            document.getElementById(`${player}Value`).innerText = score.toString();
        }
    }

    saveScore() {
        localStorage.setItem('score', JSON.stringify(Array.from(this.score)));
    }

    resetBoard() {
        this.currentPlayer = 1;
        this.ai.reset();
        this.#won = false;
        this.#tied = false;
        for (const sq of this.board) {
            sq.reset();
            this.moves = new Map();
            this.#won = false;
        }
        this.resetColor();
    }

    resetScore() {
        for (const player of this.score.keys()) {
            this.score.set(player, 0);
        }
        this.saveScore();
        this.onScoreChange();
        this.resetBoard();
    }

    get won() {
        return this.#won;
    }

    get tied() {
        return this.#tied;
    }

    /**
     *
     * @param obj {{square: number, player: number}} square denotes which square in the array is being
     * used, player is the player id to set the square as
     */
    set setBoardSquare(obj) {
        this.board[obj.square].setOwner(obj.player);
    }

    /**
     * @param {number} square
     */
    set resetSquare(square) {
        this.board[square].reset();
    }

    init() {
        for (const square of document.getElementsByClassName("box")) {
            square.addEventListener("click", (i) => this.onClick(i.target.id));
        }
        // we will declare a reset variable that when the reset button is clicked a fresh start happens.
        const restartButton = document.getElementById("restart");
        if (restartButton) {
            restartButton.addEventListener("click", _ => this.resetBoard());
        }
        const setAIButton = document.getElementById("ai_change");
        if (setAIButton) {
            setAIButton.addEventListener("click", _ =>
                this.setAI(document.getElementById("idSelect").value));
        }
        const setResetButton = document.getElementById("reset_score");
        if (setResetButton) {
            setResetButton.addEventListener("click", _ => this.resetScore());
        }
        const setMultiplayerButton = document.getElementById("multiplayer");
        if (setMultiplayerButton) {
            setMultiplayerButton.addEventListener("click", _ => {
                this.setMultiplayer();
                setMultiplayerButton.innerText = `${
                    (Number(setMultiplayerButton.value)) ? "Enable" : "Disable"} multiplayer`;
                setMultiplayerButton.value = `${(Number(setMultiplayerButton.value)) ? 0 : 1}`;
            })
        }
        this.setAIToPage();
    }

    setAIToPage(type = this.ai.type) {
        for (const element of document.getElementsByClassName("ai-level")) {
            element.innerText = type;
        }
    }
}


const gameBoard = new GameBoard();
// set the score on the page
gameBoard.onScoreChange();
// init all elements on the page
gameBoard.init();


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
//m1chael#3550;
