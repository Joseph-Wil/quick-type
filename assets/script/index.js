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
const timeInGame = 99;
let i = 0; // This is for titleAnimation function
let currentIndex = 0;
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

    const countdownTimer = setInterval(() => {
        timer.innerText = timeInGame-- ;

        if (timeInGame < 0) {
            clearInterval(countdownTimer);
            timer.innerText = 'Time is up!'
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
    }
}

function userTypedInput() {
    const userInput = userInput.value.toLowerCase();
    const currentWord = wods[currentIndex - 1];

    if (userInput === currentWord) {
        words.splice(currentIndex - 1, 1);
        displayNextWord();
    }
}

// onEvent

onEvent('input', userInput, userTypedInput);

onEvent('load', window, function() {
    titleAnimation();
})

onEvent('click', startButton, function() {
    shuffleArray(words);
    gameCountdown();
    currentIndex = 0;
    displayNextWord()

})