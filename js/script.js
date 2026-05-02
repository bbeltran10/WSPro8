const game = {
    targetWord: "APPLE",
    currentRow: 0,
    currentCol: 0,
    guesses: ["", "", "", "", "", ""],
    feedbacks: [],
    state: "playing"
};

const board = document.getElementById("game-board");

function createBoard() {
    board.innerHTML = "";
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = `tile-${r}-${c}`;
            board.appendChild(tile);
        }
    }
}

function renderGame() {
    for (let r = 0; r < 6; r++) {
        const guess = game.guesses[r] || "";
        const feedback = game.feedbacks[r] || [];
        for (let c = 0; c < 5; c++) {
            const tile = document.getElementById(`tile-${r}-${c}`);
            tile.textContent = guess[c] || "";
            tile.className = "tile";
            if (feedback[c]) {
                tile.classList.add(feedback[c]);
                tile.classList.add("animate"); // trigger pop animation
                setTimeout(() => tile.classList.remove("animate"), 300);
            }
        }
    }

    const status = document.getElementById("status-message");
    if (game.state === "win") {
        status.textContent = "🎉 You win!";
    } else if (game.state === "lose") {
        status.textContent = `💀 You lose! The word was ${game.targetWord}`;
    } else {
        status.textContent = "";
    }
}

function processInput(key) {
    if (game.state !== "playing") return;

    if (key === "BACKSPACE") {
        if (game.currentCol > 0) {
            game.currentCol--;
            game.guesses[game.currentRow] =
                game.guesses[game.currentRow].slice(0, -1);
        }
    } else if (key === "ENTER") {
        if (game.guesses[game.currentRow].length === 5) {
            submitGuess();
        }
    } else if (/^[A-Z]$/.test(key)) {
        if (game.currentCol < 5) {
            game.guesses[game.currentRow] += key;
            game.currentCol++;
        }
    }
}

function submitGuess() {
    const guess = game.guesses[game.currentRow];
    const feedback = [];

    for (let i = 0; i < 5; i++) {
        if (guess[i] === game.targetWord[i]) {
            feedback.push("correct");
        } else if (game.targetWord.includes(guess[i])) {
            feedback.push("present");
        } else {
            feedback.push("absent");
        }
    }

    game.feedbacks[game.currentRow] = feedback;

    if (guess === game.targetWord) {
        game.state = "win";
    } else if (game.currentRow === 5) {
        game.state = "lose";
    } else {
        game.currentRow++;
        game.currentCol = 0;
    }
}

function restartGame() {
    game.targetWord = "APPLE";
    game.currentRow = 0;
    game.currentCol = 0;
    game.guesses = ["", "", "", "", "", ""];
    game.feedbacks = [];
    game.state = "playing";
}

document.addEventListener("keydown", (e) => {
    processInput(e.key.toUpperCase());
    renderGame();
});

document.getElementById("restart-btn").addEventListener("click", () => {
    restartGame();
    renderGame();
});

createBoard();
renderGame();