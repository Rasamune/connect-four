class Game {
    constructor() {
        this.board = new Board();
        this.players = this.createPlayers();
        this.ready = false;
    }

    /**
     * Returns active player
     * @returns   {Object}    The active player
     */
    get activePlayer() {
        const activePlayer = this.players.find(player => player.active);
        return activePlayer;
    }

    /** 
     * Creates two player objects
     * @return  {Array}    An array of two Player objects.
     */
    createPlayers() {
        const players = [new Player('Player 1', '#e15258', 1, true),
                         new Player('Player 2', '#e59a13', 2)];
        return players;
    }

    /** 
     * Switches active player. 
     */
    switchPlayers() {
        this.players.forEach(player => {
            player.active = player.active === true ? false : true;
        });
    }

    /*
     * Begins Game
     */
    startGame() {
        /** 
         * Initializes game. 
         */
        this.board.drawHTMLBoard();
        this.activePlayer.activeToken.drawHTMLToken();
        this.ready = true;
    }

    /**
     * Branches code, depending on what key player presses
     * @param   {Object}    e - Keydown event object
     */
    handleKeydown(e) {
        if (this.ready) {
            if(e.key === 'ArrowLeft') {
                this.activePlayer.activeToken.moveLeft();
            } else if (e.key === 'ArrowRight') {
                this.activePlayer.activeToken.moveRight(this.board.columns);
            } else if (e.key === 'ArrowDown') {
                this.playToken();
            }
        }
    }

    /**
     * Drop token if space is available
     */
    playToken() {
        const game = this;
        const token = this.activePlayer.activeToken;
        let column = this.board.spaces[token.columnLocation];
        column = column.filter(space => space.token === null);
        if (column.length) {
            game.ready = false;
            const space = column[column.length - 1];
            token.drop(space, function() {
                game.updateGameState(token, space);
            });
        }
    }

     /** 
     * Updates game state after token is dropped. 
     * @param   {Object}  token  -  The token that's being dropped.
     * @param   {Object}  target -  Targeted space for dropped token.
     */
    updateGameState(token, target) {
        target.mark(token);
        if(this.checkForWin(target)) {
            this.gameOver(`${target.owner.name} wins!`);
        } else {
            this.switchPlayers();

            if (this.activePlayer.checkTokens()) {
                this.activePlayer.activeToken.drawHTMLToken();
                this.ready = true;
            } else {
                this.gameOver('Out of tokens');
            }
        }
    }

    /** 
     * Checks if there a winner on the board after each token drop.
     * @param   {Object}    Targeted space for dropped token.
     * @return  {boolean}   Boolean value indicating whether the game has been won (true) or not (false)
     */
    checkForWin(target) {
        const owner = target.token.owner;
        let win = false;

        // vertical
        for (let x = 0; x < this.board.columns; x++) {
            for (let y = 0; y < this.board.rows - 3; y++) {
                if (this.board.spaces[x][y].owner === owner &&
                    this.board.spaces[x][y+1].owner === owner &&
                    this.board.spaces[x][y+2].owner === owner &&
                    this.board.spaces[x][y+3].owner === owner) {
                        win = true;
                    }
            }
        }

        // horizontal
        for (let x = 0; x < this.board.columns - 3; x++) {
            for (let y = 0; y < this.board.rows3; y++) {
                if (this.board.spaces[x][y].owner === owner &&
                    this.board.spaces[x+1][y].owner === owner &&
                    this.board.spaces[x+2][y].owner === owner &&
                    this.board.spaces[x+3][y].owner === owner) {
                        win = true;
                    }
            }
        }

        // diagonal
        for (let x = 3; x < this.board.columns; x++) {
            for (let y = 0; y < this.board.rows - 3; y++) {
                if (this.board.spaces[x][y].owner === owner &&
                    this.board.spaces[x-1][y+1].owner === owner &&
                    this.board.spaces[x-2][y+2].owner === owner &&
                    this.board.spaces[x-3][y+3].owner === owner) {
                        win = true;
                    }
            }
        }

        // diagonal
        for (let x = 3; x < this.board.columns; x++) {
            for (let y = 3; y < this.board.rows; y++) {
                if (this.board.spaces[x][y].owner === owner &&
                    this.board.spaces[x-1][y-1].owner === owner &&
                    this.board.spaces[x-2][y-2].owner === owner &&
                    this.board.spaces[x-3][y-3].owner === owner) {
                        win = true;
                    }
            }
        }
        
        return win;
    }

    /** 
     * Displays game over message.
     * @param {string} message - Game over message.      
    */
    gameOver(message) {
        const gameover = document.querySelector('#game-over');
        gameover.textContent = message;
        gameover.style.display = 'block';
    }
}