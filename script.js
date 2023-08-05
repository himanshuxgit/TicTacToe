const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const makeMove = (index, player) => {
        if (board[index] === "") {
            board[index] = player;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, makeMove, resetBoard };
})();

const DisplayController = (() => {
    const renderBoard = () => {
        const gameContainer = document.getElementById("game-container");
        gameContainer.innerHTML = "";

        const board = Gameboard.getBoard();
        for (let i = 0; i < board.length; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell", "border", "border-gray-400", "flex", "items-center", "justify-center", "text-3xl");
            cell.textContent = board[i];
            cell.addEventListener("click", () => {
                if (board[i] === "" && !isGameOver()) {
                    makePlayerMove(i);
                }
            });
            gameContainer.appendChild(cell);
        }
    };

    const isGameOver = () => {
        const board = Gameboard.getBoard();
        return false;
    };

    const makePlayerMove = (index) => {
        const player = "X"; 
        if (Gameboard.makeMove(index, player)) {
            renderBoard();
            if (!isGameOver()) {
                setTimeout(makeComputerMove, 500); 
            }
        }
    };

    const makeComputerMove = () => {
        const result = checkGameOver();
        if (result) {
            updateResult(result);
        } else {
            const board = Gameboard.getBoard();
            const emptyCells = board.reduce((acc, cell, index) => cell === "" ? acc.concat(index) : acc, []);
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const computerMove = emptyCells[randomIndex];

            const computerPlayer = "O"; 
            Gameboard.makeMove(computerMove, computerPlayer);
            renderBoard();

            const updatedResult = checkGameOver();
            if (updatedResult) {
                updateResult(updatedResult);
            }
        }
    };

    return { renderBoard };
})();

DisplayController.renderBoard();

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
    Gameboard.resetBoard();
    DisplayController.renderBoard();
    updateResult(""); 
});

const checkGameOver = () => {
    const board = Gameboard.getBoard();
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6] 
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            if (board[a] === "O") {
                return "Computer wins";
            } else if (board[a] === "X") {
                return "You win";
            }
        }
    }

    if (board.every(cell => cell !== "")) {
        return "It's a tie!";
    }

    return null;
};

const updateResult = (result) => {
    const resultElement = document.getElementById("result");
    resultElement.textContent = result;
};

const makePlayerMove = (index) => {
    const player = "X"; 
    if (Gameboard.makeMove(index, player)) {
        DisplayController.renderBoard();

        const result = checkGameOver();
        if (result) {
            updateResult(result);
        } else {
            setTimeout(makeComputerMove, 500); 
        }
    }
};
