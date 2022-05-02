// 0 1 2
// 3 4 5
// 6 7 8
// 0 == Ai 1 === player
// export const name = "ai";
import {GameBoard} from "./app.js";

const rowSize = 3;
export class Ai {
    constructor(type = 0) {
        // Ai will start from 0 easiest to 3 hardest, TODO: Allow this to be set by the parent class
        this.type = type;
        //map with Ai move to list of lists of winning strategies
        this.aiTree = new Map();
        this.moves = new Map();
        this.possible = [...Array(rowSize ** 2).keys()]
        console.log(this.possible)
        this.playerMoves = [];
        this.aiMoves = [];
        this.score = new Map([[0,5], [1,-5], [-1, 0]]);
        // hardcode for now, TODO: See they can be calculated
        this.corners = [0, 2, 6, 8];
        // this.lastPlayerMove = Number.MAX_SAFE_INTEGER;
        // this.lastAiMove = Number.MAX_SAFE_INTEGER;
    }

    // ((i < (arr.length/rows)) ? 1 : 0) * 2 + i *
    choice(playerMove) {
        // Simple rules Ai is 0
        // check if there are any immediate wining moves
        // check if there are any player moves
        // choose a random spot (TODO: more intelligent guessing)
        // edges follow
        // 0	+3,+4,+1
        // 2	+3,+2,-1
        // 6	-3,-2,+1
        // 8	-3,-4,-1
        let move = +playerMove
        this.playerMoves.push(move)
        // corners
        // if (this.moves.size === 0) {
        this.update(move)
        console.log(this.playerMoves, playerMove, this.possible)
        switch(this.type){
            case 0:
                return this.easyAI()
            case 1:
                return this.randomAI()
            default:
                return this.impossibleAI()

        }
        // } else {
        //     let ret = 0;
        //     if (playerMove === 5) {
        //         // if x started in the middle, pick a corner
        //         do {
        //             let choice = Math.floor(Math.random() * 3);
        //             ret = this.corners[choice];
        //         } while (playerMove === ret)
        //         this.aiTree.set(this.aiTree.size, [])
        //     } else {
        //         // always pick middle
        //         ret = 5
        //     }
        //     // let the Ai keep track of their moves
        //     this.moves.set(ret, 0);
        //     this.aiMoves.push(ret);
        //     return ret;
        //
        // }
    }

    update(move){
        this.possible.splice(this.possible.findIndex(e => move === e), 1)
        this.moves.set(move, 1)

    }

    easyAI() {
        let rand = Math.floor(Math.random()*this.possible.length)
        let ret = this.possible[rand];
        console.log("R:",ret,"A:", this.possible,"R:", rand);
        this.update(ret)
        return ret;
    }

    impossibleAI(board) {
        // implement minimax
        // Both players are given two scores min and max. The algorithm decides using a tree
        // which will alternate between min and max players which will then choose the appropriate
        // move base on both players playing optimally.
        let bScore = -Infinity;
        let move;
        for (const candidate of this.possible){
            board[candidate].setOwner(0);
            // TODO: REDO
            let score = this.mm(0, false);
            // let score = check[0]
            board[candidate].reset();
            if (score > bScore){
                bScore = score;
                move = candidate[1];
            }
        }
        this.possible.splice(move)
        this.update(move)
        return move;

    }

    randomAI() {
        let move
        // will be a combination of the two, coin flip style between random and impossible
        if (Math.floor(Math.random()*99) > 50){
            move = this.easyAI()
        } else {
            move  = this.impossibleAI()
        }
        this.update(move)
        return move

    }

    mm(board, depth, isMax) {
        function mm_h(depth, player) {
            let bScore = -Infinity;
            for (const candidate of this.possible) {
                board[candidate].setOwner(0);
                let score = this.mm(board, depth + 1, ((player) ?  0:1));
                board[candidate].reset();
                bScore = (player) ? Math.max(bScore, score) : Math.min(bScore, score);
            }
            return bScore;
        }
        if (gameBoard.checkWinner(isMax) != null) {
            // 1 = player, 0 = Ai
            return this.score.get(isMax);
        }
        // 0 is falsy
        return (isMax) ? mm_h(depth + 1, 0) : mm_h(depth + 1, 1)
    }

    setAi(type){
        this.type = type
    }
}

//     function mm_h(board, depth) {
//         if (depth > maxDepth) {
//             return board
//         }
//         let bScore = -Infinity;
//         let move;
//         for (let i = 0; i < rowSize ** 2; i++) {
//
//         }
//     }
// }
