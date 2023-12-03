'use strict';

import { onEvent, getElement, select, create } from "./utility.js";
import { Score } from "./score.js";

// Variables 

const gameTitle = select('.game-title');
const randomWords = select('.random-words');
const userInput = select('.user');
const startButton = select('.start');
const timer = select('.timer');
const wordCount = select('.words-typed');
const backgroundAudio = new Audio ('../assets/audio/stranger-things.mp3');
let typedWords = 0;
let i = 0; // This is for titleAnimation function
let currentIndex = 0;
let timeInGame = 99;
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

        if (timeInGame < 10) {
            timer.style.color= '#d80000';
        }
        if (timeInGame < 0) {
            clearInterval(countdownTimer);
            timer.innerText = 'Time is up!'
            stopMusic();
        }
    }, 1000)    // Timer goes down every second (1000 milliseconds = 1 second)
};

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
        stopMusic();
    }
}

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

function resetGame() {
    startButton.value = 'Restart';
    clearInterval(countdownTimer);

    shuffleArray(words);
    currentIndex = 0;
    displayNextWord();
    userInput.focus();
    typedWords = 0;
    wordCount.textContent = 0;

    timeInGame = 99;
    gameCountdown();
};

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
});

onEvent('click', startButton, function() {
    shuffleArray(words);
    currentIndex = 0;
    displayNextWord()
    userInput.focus();
    playMusic();
    resetGame();
});