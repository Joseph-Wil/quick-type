'use strict';

import { onEvent, getElement, select, create } from "./utility.js";

// Variables 

const gameTitle = select('.game-title');
const randomWords = select('.random-words');
const userInput = select('.user');
const startButton = select('.start');
const timer = select('.timer');
const wordCount = select('.words-typed');
const backgroundAudio = new Audio ('../assets/audio/stranger-things.mp3');
const dialog = select('.dialog');
const scoreboardButton = select('.scoreboard');
const totalWords = 120;
let typedWords = 0;
let i = 0; // This is for titleAnimation function
let currentIndex = 0;
let timeInGame = 15;
let countdownTimer;
const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
    'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
    'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
    'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
    'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
    'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
];

// Functions 

// Leaderboard functions 

function showLeaderboard() {
    dialog.style.display = 'grid';
}

function showScoreboardButton() {
    scoreboardButton.style.display = 'block';
}

function createUserStats(hits, totalWords) {
    return {
        hits: hits,
        percentage: calcAccuracy(hits, totalWords),
        date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric', 
            year: 'numeric'
        }),
    };
}

function getLeaderboardFromStorage() {
    const storedLeaderboard = localStorage.getItem('leaderboardArray');
    return storedLeaderboard ? JSON.parse(storedLeaderboard) : [] ;
}

function updateLeaderboard(userStats) {
    const leaderboardArray = getLeaderboardFromStorage();
    leaderboardArray.push(userStats);
    localStorage.setItem('leaderboardArray', JSON.stringify(leaderboardArray));
}

function displayLeaderboardStats() {
    const leaderboardArray = getLeaderboardFromStorage();
    const leaderboardContainer = select('.dialog');
    const topNineOnly = Math.min(9, leaderboardArray.length);

    leaderboardArray.sort((a, b) => b.hits - a.hits);
    leaderboardContainer.innerHTML = '';
    showLeaderboardTitle();

    for (let index = 0; index < topNineOnly; index++) {
        const userStats = leaderboardArray[index];
        const leaderboardRank = document.createElement('p');
        leaderboardRank.classList.add('rank');
        leaderboardRank.innerHTML = ` <span class="rank-number">${index + 1}</span>
                                      <span class="final-score">${userStats.hits} words</span>
                                      <span class="date">${userStats.date}</span>`;
        leaderboardContainer.appendChild(leaderboardRank);
    };
}

function showLeaderboardTitle() {
    const leaderboardTitle = create('h4');
    const leaderboardContainer = select('.dialog');
    leaderboardTitle.textContent = 'Leaderboards';
    leaderboardContainer.appendChild(leaderboardTitle);
}

function noStatsRecorded() {
    const leaderboardArray = getLeaderboardFromStorage();
    const leaderboardContainer = select('.dialog')

    if (leaderboardArray.length === 0) {
        leaderboardContainer.innerHTML = 'No games played';
    }
}

// Input functions 

function hideGameName() {
    gameTitle.style.display = 'none';
    scoreboardButton.style.display = 'none';
};

function enableInput() {
    userInput.removeAttribute('disabled');
    userInput.style.cursor = 'auto';
    userInput.focus();
    userInput.innerText = '';
}

function disableInput() {
    userInput.setAttribute('disabled', 'disabled');
};

// In game animation and timer

function titleAnimation() {
    let speed = 80;
    const titleName = 'Welcome to Type Master';

    if (i < titleName.length) {
        gameTitle.textContent += titleName.charAt(i);
        i++;
        setTimeout(titleAnimation, speed);
    }
};

function gameCountdown() {
    countdownTimer = setInterval(() => {
        timer.innerText = timeInGame;
        timeInGame--;

        if (timeInGame < 11) {
            timer.style.color= '#d80000';
        }
        if (timeInGame < 0) {
            clearInterval(countdownTimer);
            timer.innerText = 'Time is up!'
            stopMusic();
            disableInput();
            showScoreboardButton();

            const userStats = createUserStats(typedWords, words.length);
            updateLeaderboard(userStats);
            displayLeaderboardStats();
        }
    }, 1000)    // Timer goes down every second (1000 milliseconds = 1 second)
};

// Randomize  array of words 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayNextWord() {
    if (currentIndex < words.length) {
        randomWords.textContent = words[currentIndex];
        userInput.value = '';
        currentIndex ++;
    } else {
        randomWords.textContent = 'No more words';
        showScoreboardButton();
        disableInput();
        stopMusic();
    }
}

// User input and hits tracker

function userTypedInput() {
    const userInputText = userInput.value.toLowerCase();
    const currentWord = words[currentIndex - 1];

    if (userInputText === currentWord) {
        words.splice(currentIndex - 1, 1);
        displayNextWord();
        playerScore();
    }
}

function playerScore() {
    typedWords++;
    wordCount.textContent = typedWords;
}

function calcAccuracy(typedWords, totalWords) {
    if (totalWords === 0 ) {
        return 0;
    }
    return ((typedWords / totalWords) * 100).toFixed(1);
}

// Reset function

function resetGame() {
    startButton.value = 'Restart';
    clearInterval(countdownTimer);

    shuffleArray(words);
    currentIndex = 0;
    displayNextWord();
    userInput.focus();
    typedWords = 0;
    wordCount.textContent = 0;
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    hideGameName();
    playMusic();

    timeInGame = 15;
    gameCountdown();
};

// Play, stop and revert music back to 0 

function playMusic() {
    backgroundAudio.play();
}

function stopMusic() {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
}

// onEvent

onEvent('input', userInput, userTypedInput);

onEvent('load', window, function() {
    titleAnimation();
    displayLeaderboardStats();

});

onEvent('click', startButton, function() {
    hideGameName();
    enableInput();
    shuffleArray(words);
    currentIndex = 0;
    displayNextWord()
    userInput.focus();
    playMusic();
    resetGame();
});

onEvent('click', scoreboardButton, function() {
    noStatsRecorded();
    showLeaderboard();
});

onEvent('click', dialog, function(e) {
    const rect = this.getBoundingClientRect();

    if (e.clientY < rect.top || e.clientY > rect.bottom ||
        e.clientX < rect.left || e.clientX > rect.right) {
            dialog.close();     
            console.log('Dialog closed');
    }
});
