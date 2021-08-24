(function () {
  /*
  Scene
  - Group short names of scenes with their HTMLElements
  */
  class Scene {
    constructor(name, element, callback) {
      this.name = name
      this.element = element
      this.callback = callback
    }
  }

  /*
  SceneManager
  - Change scenes
  */
  class SceneManager {
    constructor(scenes) {
      this.scenes = scenes;
    }

    changeScene(name) {
      let callback;
      this.scenes.forEach((scene) => {
        if (scene.name === name) {
          scene.element.style.display = "flex";
          callback = scene.callback;
        } else {
          scene.element.style.display = "none";
        }
      })
      if (callback !== undefined) {
        callback();
      }
    }
  }

  /*
  Game
  - Update board
  - Update lives
  - Update score
  - Watch Timer
  */
  class Game {
    constructor() {
      this.difficulty = 0;
      this.lives = new Lives();
      this.score = new Score();
      this.timer = new Timer();
    }
  }

  /*
  Lives
  - Track lives
  */
  class Lives {
    constructor() {
      this.lives = 3;
    }

    currentLives() {
      return this.lives;
    }

    increaseScore() {
      this.lives--;
    }
  }

  /*
  Score
  - Track score
  */
  class Score {
    constructor() {
      this.score = 0;
    }

    currentScore() {
      return this.score;
    }

    increaseScore() {
      this.score++;
    }
  }

  /*
  Timer
  - 
  */
  class Timer {

  }


  const startButton = document.getElementById("startButton");
  const pauseButton = document.getElementById("pauseButton");
  const loseButton = document.getElementById("loseButton");
  const winButton = document.getElementById("winButton");
  const winScreenMenuButton = document.getElementById("winScreenMenuButton");
  const loseScreenMenuButton = document.getElementById("loseScreenMenuButton");
  const startScreen = document.getElementById("startScreen");
  const playScreen = document.getElementById("playScreen");
  const winScreen = document.getElementById("winScreen");
  const loseScreen = document.getElementById("loseScreen");
  // TODO: Move this to Game class
  const startGame = () => {
    // TODO: Move this into Game
    // Start the game
    moveMole();
    countDownTimerId = setInterval(countDown, 1000);
  }
  const endGame = () => {
    // TODO: Move this to Game
    // Giving up so lets stop the timers
    clearInterval(countDownTimerId);
    clearInterval(timerId);
  }
  const scenes = [
    new Scene("start", startScreen),
    new Scene("play", playScreen, startGame),
    new Scene("win", winScreen, endGame),
    new Scene("lose", loseScreen, endGame),
  ]
  const sceneManager = new SceneManager(scenes);
  startButton.onclick = (e) => {
    e.preventDefault();
    sceneManager.changeScene("play")
  };
  pauseButton.onclick = (e) => {
    e.preventDefault();
    // We should pause all the game intervals
  };
  loseButton.onclick = (e) => {
    e.preventDefault();
    sceneManager.changeScene("lose")
  };
  winButton.onclick = (e) => {
    e.preventDefault();
    sceneManager.changeScene("win")
  };
  
  winScreenMenuButton.onclick = (e) => {
    e.preventDefault();
    // TODO: Move this to use scene manager
    // We should hide the winScreen, show the startScreen by resetting its CSS class
    sceneManager.changeScene("start")
  };
  
  loseScreenMenuButton.onclick = (e) => {
    e.preventDefault();
    // TODO: Move this to use scene manager
    // We should hide the winScreen, show the startScreen by resetting its CSS class
    sceneManager.changeScene("start")
  };

  // TODO: Move as much as possible below to Game
  const squares = document.querySelectorAll(".square");
  const mole = document.querySelector(".mole");
  const timeLeft = document.querySelector("#time-left");
  const score = document.querySelector("#score");
  // const livesLeft = document.querySelector("#livesLeft");

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
        square.style.backgroundImage = 'url("../images/greenSplat.png")';
        square.style.backgroundSize = "90%";
        result++;
        score.textContent = result;
        hitPosition = null;
        setTimeout(
          () => {
            square.classList.remove("mole");
            square.style = undefined;
          },
          250
        )
      }
    });
  });

  function moveMole() {
    timerId = setInterval(randomSquare, 1000);
  }

  function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime;
    // livesLeft.textContent = currentTime;

    if (currentTime == 0) {
      clearInterval(countDownTimerId);
      clearInterval(timerId);
      alert("GAME OVER! Your final score is " + result);
      sceneManager.changeScene("lose")
    }
  }
})();
