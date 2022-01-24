function shuffle(array, seed) {
    // Function taken from user Ulf Aslak on stackoverflow
    // https://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed

    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(random(seed) * m--);

        // And swap it with the current elements.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
        ++seed
    }

    return array;
}

function random(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function handleStart(evt) {
    evt.preventDefault();
    if (!seedForm.elements.isRandom.checked) {
        seed = seedForm.elements.chosenSeed.value;
    }
    console.log(`Seed is ${seed}`);
    seedDisplay.innerText = seed;
    shuffle(letterBag, seed);
    seedForm.remove();
    createWordForm();
    currentRound += 1;
    roundDisplay.innerText = currentRound;
    const wordForm = document.querySelector("#word-form");
    wordForm.addEventListener('submit', e => handleWordSubmission(e, wordForm));
    setupTileRack();
    timer.start({ countdown: true, startValues: { minutes: timeInMinutes } });
    timer.addEventListener('secondsUpdated', () => {
        if (timer.getTimeValues().seconds === 10) {
            timeDisplay.classList.toggle('red');
        }
        timeDisplay.innerText = timer.getTimeValues().toString(['minutes', 'seconds']);
    });
    timer.addEventListener('targetAchieved', () => {
        handleGameEnd(outOfTime = true);
    })
}

function handleGameEnd(outOfTime = false) {
    let gameOverMessage = '';
    if (outOfTime) {
        gameOverMessage = 'You ran out of time!';
    } else {
        gameOverMessage = `You completed all ${numRounds} rounds.`;
        const secondsLeft = timer.getTimeValues().seconds;
        const secondsLeftCategory = Math.floor(secondsLeft / 10);
        if (secondsLeftCategory) {
            const bonus = speedRunBonuses[secondsLeftCategory];
            userScore += bonus;
        }
    }
    gameArea.innerHTML = `<h1>GAME OVER. ${gameOverMessage} Final score: ${userScore} points</h1><h2>with seed ${seed}</h2>`;
    const scoreTable = document.createElement('table');
    for (let word of wordsWritten) {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `<td>word <span class="bold">${word.word}</span></td><td>${word.points} points</td>`;
        scoreTable.append(tableRow);
    }
    gameArea.append(scoreTable);
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Play Again';
    restartButton.classList.add('button');
    gameArea.append(restartButton);
    console.log(wordsWritten);
    restartButton.addEventListener('click', () => window.location.reload());
}

const gameArea = document.querySelector('#game-area');
const seedForm = document.querySelector("#seed-form");
const randomSeedCheck = document.querySelector("#use-seed");
const seedSelection = document.querySelector("#seed-selection");

// Enables the manual seed input if the user choose to do so
randomSeedCheck.addEventListener("click", () => {
    seedSelection.toggleAttribute("disabled");
    seedSelection.classList.toggle("disabled");
})

// Start the main "game loop" on submission of the random seed form
seedForm.addEventListener("submit", e => handleStart(e));
const gameMessages = document.querySelector('#game-messages');

// Initialise game info
const timeDisplay = document.querySelector('#timer');
const roundDisplay = document.querySelector('#roundDisplay');
const scoreDisplay = document.querySelector('#scoreDisplay');
const seedDisplay = document.querySelector('#seedDisplay');

let seed = Math.random();
let userScore = 0;
let currentRound = 0;
const wordsWritten = [];

// Game configuration
const timer = new easytimer.Timer();
const timeInMinutes = 1;
const numRounds = 5;
const speedRunBonuses = {
    0: 0, 1: 10, 2: 20, 3: 40, 4: 60, 5: 100
}

timeDisplay.innerText = `${timeInMinutes}:00`;
