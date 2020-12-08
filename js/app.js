const game = new Game();

/** 
 * Listens for click on `#begin-game` and calls startGame() on game object
 */
document.querySelector('#begin-game').addEventListener('click', function () {
    game.startGame();

    this.style.display = 'none';
    document.querySelector('#play-area').style.opacity = '1';
});

/**
 * Listen for keyboard presses
 */
document.addEventListener('keydown', e => game.handleKeydown(e));