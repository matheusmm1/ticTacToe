const gameBoard = (() => {
    const board = ['topLeft', 'topMiddle', 'topRight',
        'middleLeft', 'middle', 'middleRight',
        'bottomLeft', 'bottomMiddle', 'bottomRight'];
    return board;
})();

const createPlayer = (name, marker) => {
    let score = 0;
    let choices = [];

    const pickSpot = function(spot) {
        const pickedSpot = gameBoard[spot];
        choices.push(pickedSpot);
        return pickedSpot;
    };

    const getScore = () => score;
    const giveScore = () => score++;
    // Clear choices 
    const resetChoices = () => {
        choices.length = 0; 
    };

    return { name, choices, marker, pickSpot, getScore, giveScore, resetChoices };
};

const gameOn = (() => {
    let playerOne = createPlayer('Fred', 'X');
    let playerTwo = createPlayer('Barney', 'O');
    let playerOneChoices = playerOne.choices;
    let playerTwoChoices = playerTwo.choices;
    let squares, turn;

    const initializeGame = () => {
        squares = document.querySelectorAll('.grid-container > div');
        turn = 0;

        // Add event listeners to each square
        squares.forEach(square => {
            square.addEventListener('click', playerTurn);
            square.textContent = '';  
        });
    };

    const winConditions = {
        one: ['topLeft', 'topMiddle', 'topRight'],
        two: ['middleLeft', 'middle', 'middleRight'],
        three: ['bottomLeft', 'bottomMiddle', 'bottomRight'],
        four: ['topLeft', 'middleLeft', 'bottomLeft'],
        five: ['topMiddle', 'middle', 'bottomMiddle'],
        six: ['topRight', 'middleRight', 'bottomRight'],
        seven: ['topLeft', 'middle', 'bottomRight'],
        eight: ['topRight', 'middleLeft', 'bottomLeft']
    };

    const checkWinCondition = () => {
        const vals = Object.values(winConditions);
        for (let x of vals) {
            const playerOneCheck = x.every(e => playerOneChoices.includes(e));
            const playerTwoCheck = x.every(e => playerTwoChoices.includes(e));
            if (playerOneCheck) {
                playerOne.giveScore();
                alert(`${playerOne.name} just won the game! His score is now ${playerOne.getScore()}!`);
                resetGame();
                return;
            } 
            if (playerTwoCheck) {
                playerTwo.giveScore();
                alert(`${playerTwo.name} just won the game! His score is now ${playerTwo.getScore()}!`);
                resetGame();
                return;
            }
        }

        if (playerOneChoices.length + playerTwoChoices.length === 9) { // 9 moves in total
            alert(`It's a tie! Neither ${playerOne.name} nor ${playerTwo.name} gain any points this round!`);
            resetGame();
        }
    };

    const resetGame = () => {
        playerOne.resetChoices(); 
        playerTwo.resetChoices(); 
        // Clear all square contents
        squares.forEach((e) => e.textContent = ' ');
        // No need to reinitialize players
        initializeGame();
    };

    const playerTurn = (event) => {
        if (event.target.textContent !== '') return; // Prevent filling an already filled square

        let currentPlayer = turn === 0 ? playerOne : playerTwo;
        const spotIndex = Array.from(squares).indexOf(event.target);
        // Display the marker
        event.target.textContent = currentPlayer.marker; 
        currentPlayer.pickSpot(spotIndex);
        // Switch turns
        turn = turn === 0 ? 1 : 0; 
        checkWinCondition();
    };

    // Initialize the game initially
    initializeGame();
    
    return { playerOne, playerTwo, playerOneChoices, playerTwoChoices };
})();