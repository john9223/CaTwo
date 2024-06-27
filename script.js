document.addEventListener('DOMContentLoaded', () => {
    const cardsArray = [
        'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 
        'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
    ];
    
    let cardsContainer = document.getElementById('cards-container');
    let scoreDisplay = document.getElementById('score');
    let timerDisplay = document.getElementById('timer');
    let startButton = document.getElementById('start-game');
    let playAgainButton = document.getElementById('play-again');
    let intro = document.getElementById('intro');
    let game = document.getElementById('game');
    let gameOver = document.getElementById('game-over');
    let finalScore = document.getElementById('final-score');
    let message = document.getElementById('message');

    let playerName;
    let score = 0;
    let timer;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;

    startButton.addEventListener('click', () => {
        playerName = document.getElementById('player-name').value;
        if (playerName.trim() === '') {
            alert('Please enter your name.');
            return;
        }
        intro.classList.add('hidden');
        game.classList.remove('hidden');
        startGame();
    });

    playAgainButton.addEventListener('click', () => {
        resetGame();
        startGame();
    });

    function startGame() {
        score = 0;
        matchedPairs = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        timerDisplay.textContent = 'Time: 0';
        message.classList.add('hidden');
        shuffle(cardsArray);
        createCards();
        startTimer();
        setTimeout(() => {
            hideAllCards();
            enableCardFlipping();
            message.classList.remove('hidden');
        }, 30000);
    }

    function createCards() {
        cardsContainer.innerHTML = '';
        cardsArray.forEach((cardValue, index) => {
            let card = document.createElement('div');
            card.classList.add('card', 'open');
            card.dataset.value = cardValue;
            card.dataset.index = index;
            card.textContent = cardValue;
            cardsContainer.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

        this.classList.add('open');
        this.textContent = this.dataset.value;

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.value === secondCard.dataset.value;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        score++;
        matchedPairs++;
        scoreDisplay.textContent = `Score: ${score}`;
        resetBoard();

        if (matchedPairs === cardsArray.length / 2) {
            endGame();
        }
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('open');
            secondCard.classList.remove('open');
            firstCard.textContent = '';
            secondCard.textContent = '';
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function hideAllCards() {
        document.querySelectorAll('.card').forEach(card => {
            if (!card.classList.contains('matched')) {
                card.classList.remove('open');
                card.classList.add('hidden');
                card.textContent = '';
            }
        });
    }

    function enableCardFlipping() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', flipCard);
            card.classList.remove('hidden');
        });
    }

    function shuffle(array) {
        array.sort(() => 0.5 - Math.random());
    }

    function startTimer() {
        let timeElapsed = 0;
        timer = setInterval(() => {
            timeElapsed++;
            timerDisplay.textContent = `Time: ${timeElapsed}`;
        }, 1000);
    }

    function endGame() {
        clearInterval(timer);
        game.classList.add('hidden');
        gameOver.classList.remove('hidden');
        finalScore.textContent = `Your score is ${score}. Time taken: ${timerDisplay.textContent.split(' ')[1]} seconds.`;
    }

    function resetGame() {
        intro.classList.add('hidden');
        gameOver.classList.add('hidden');
        game.classList.remove('hidden');
        score = 0;
        matchedPairs = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        timerDisplay.textContent = 'Time: 0';
        clearInterval(timer);
        cardsContainer.innerHTML = '';
    }
});
