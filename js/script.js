(function () {
  const startButton = document.getElementById("startButton");
  const pauseButton = document.getElementById("pauseButton");
  const stopButton = document.getElementById("stopButton");
  const highScoresMenuButton = document.getElementById("highScoresMenuButton");
  const startScreen = document.getElementById("startScreen");
  const playScreen = document.getElementById("playScreen");
  const winScreen = document.getElementById("winScreen");
  startButton.onclick = (e) => {
    e.preventDefault();
    // We should hide the startScreen, show the playScreen by resetting its CSS class, and reset the board and score
    startScreen.style.display = "none";
    winScreen.style.display = "none";
    playScreen.style.display = "flex";
    // Start the game
    moveMole();
    countDownTimerId = setInterval(countDown, 1000);
  };
  pauseButton.onclick = (e) => {
    e.preventDefault();
    // We should pause all the game intervals
  };
  stopButton.onclick = (e) => {
    e.preventDefault();
    // We should hide the playScreen, show the loseScreen by resetting its CSS class, and stop all the game intervals
    startScreen.style.display = "none";
    playScreen.style.display = "none";
    winScreen.style.display = "flex";
    // Giving up so lets stop the timers
    clearInterval(countDownTimerId);
    clearInterval(timerId);
  };
  
  highScoresMenuButton.onclick = (e) => {
    e.preventDefault();
    // We should hide the winScreen, show the startScreen by resetting its CSS class
    winScreen.style.display = "none";
    playScreen.style.display = "none";
    startScreen.style.display = "flex";
  };
  const squares = document.querySelectorAll(".square");
  const mole = document.querySelector(".mole");
  const timeLeft = document.querySelector("#time-left");
  const score = document.querySelector("#score");

  let result = 0;
  let hitPosition;
  let currentTime = 60;
  let timerId = null;

  function randomSquare() {
    squares.forEach((square) => {
      square.classList.remove("mole");
    });

    let randomSquare = squares[Math.floor(Math.random() * 16)];
    randomSquare.classList.add("mole");

    hitPosition = randomSquare.id;
  }

  squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id == hitPosition) {
        result++;
        score.textContent = result;
        hitPosition = null;
        square.classList.remove("mole");
      }
    });
  });

  function moveMole() {
    timerId = setInterval(randomSquare, 1000);
  }

  function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime;

    if (currentTime == 0) {
      clearInterval(countDownTimerId);
      clearInterval(timerId);
      alert("GAME OVER! Your final score is " + result);
    }
  }
})();
