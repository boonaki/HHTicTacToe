const rowSize = 3;
export class Ai {
    /**
     * @param {GameBoard} p GameBoard object to reference back to
     * @param type AI type initial value.
     */
    constructor(p,type = 0) {
        this.id = 2;
        //reference to parent object
        this.p = p;
        // Ai will start from 0 easiest to 2 hardest
        this.type = type;
        this.moves = new Map();
        this.possible = [...Array(rowSize ** 2).keys()]
        this.playerMoves = [];
        this.score = new Map([[1,5], [2,-5], [0, 0]]);
        this.tree = new Map();
    }

    choice(playerMove) {
        if (this.p.won){
            return;
        }
        const move = Number(playerMove);
        this.playerMoves.push(move);
        this.updateMove(move);
        switch(this.type){
            case 0:
                return this.easyAI();
            case 1:
                return this.randomAI();
            default:
                return this.impossibleAI();

        }
    }

    updateMove(move){
        this.possible = this.possible.filter(e=> e!==move);
        this.moves.set(move, 1);

    }

    /**
     * Using a rng, have the computer generate moves.
     * @return {number} location in the array to place the computers move
     */
    easyAI() {
        let move = this.possible[Math.floor(Math.random()*this.possible.length)];
        this.updateMove(move);
        return move;
    }

    randomAI() {
        let move;
        // will be a combination of the two, coin flip style between random and impossible
        if (Math.floor(Math.random()*99) > 50){
            move = this.easyAI();
        } else {
            move  = this.impossibleAI();
        }
        this.updateMove(move);
        return move;

    }

    impossibleAI(){
        // TODO: Alpha-beta pruning and depth limiter.
        let bestScore = Infinity;
        let move;
        for (const candidate  of this.possible){
            this.p.setBoardSquare = {square: candidate, player: this.id};
            const score = this.mm(this.possible.filter((e) => e !== candidate), 0, 1, [candidate]);
            this.p.resetSquare = candidate;
            this.tree.set(candidate, score);
            if (score < bestScore){
                bestScore = score;
                move = candidate;
            }
        }
        this.tree = new Map();
        this.updateMove(move);
        return move;
    }
    /**
     * minimax implemented using info from https://en.wikipedia.org/wiki/Minimax adapted for
     * use here.
     * @param possible {Array<number>} possible moves to make
     * @param depth {number} recursive check for knowing how far we should go
     * @param player {number} 1 or 2 depending on the player
     * @param moves {Array<number>} tracking moves in the simulation.
     * @return {number} will return a score, a number of how good the move is in accordance with
     *  the calculated optimal move for the adversary to move on.
     */
    mm(possible, depth, player, moves) {
        const res = this.p.checkWinnerHelper((player === 1) ? 2 : 1, moves.length, true);
        if (res !== null) {
            return this.score.get(res) - depth;
        }
        let bScore = (player === 1)? -Infinity : Infinity;
        for (const candidate of possible){
            if(this.p.squareIsNotOwned(candidate)){
                this.p.setBoardSquare = {square: candidate, player: player};
                moves.push(candidate);
                let score = this.mm(possible.filter((e) => e !== candidate), depth+1, (player === 1)? 2:1, moves);
                this.p.resetSquare = moves.pop();
                bScore = (player === 1)? Math.max(score, bScore) : Math.min(score, bScore);
            }
        }
        return bScore;
    }
    setAi(type){
        this.type = +type;
        this.reset();
        console.log(`SET AI TO ${type}`);
    }
    reset(){
        this.moves = new Map();
        this.possible = [...Array(rowSize ** 2).keys()]
        this.playerMoves = [];
    }
}
