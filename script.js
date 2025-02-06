let score = 0;
let time = 0;
let gameInterval;
let timeInterval;
const playArea = document.querySelector('.play-area');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('startBtn');

function startGame() {
    score = 0;
    time = 30;
    scoreDisplay.textContent = `Puntos: ${score}`;
    timeDisplay.textContent = `Tiempo: ${time}`;
    startBtn.disabled = true;

    gameInterval = setInterval(generateCircle, 1000);
    timeInterval = setInterval(updateTime, 1000);
}

function generateCircle() {
    const circle = document.createElement('div');
    circle.classList.add('circle');

    const x = Math.random() * (playArea.offsetWidth - 50);
    const y = Math.random() * (playArea.offsetHeight - 50);

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    circle.addEventListener('click', catchCircle);

    playArea.appendChild(circle);

    // Remove the circle after 1 second if not clicked
    setTimeout(() => {
        if (circle.parentNode) {
            circle.remove();
        }
    }, 1000);
}

function catchCircle() {
    score++;
    scoreDisplay.textContent = `Puntos: ${score}`;
    this.remove();
}

function updateTime() {
    time--;
    timeDisplay.textContent = `Tiempo: ${time}`;
    if (time <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    alert(`Juego Terminado! \nPuntuación final: ${score}`);
    startBtn.disabled = false;
}

startBtn.addEventListener('click', startGame);
