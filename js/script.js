(function () {
  /*
  Scene
  - Group short names of scenes with their HTMLElements
  */
  class Scene {
    constructor(name, element, callback) {
      this.name = name;
      this.element = element;
      this.callback = callback;
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
      console.log(`Changing scene to ${name}`)
      let callback;
      this.scenes.forEach((scene) => {
        if (scene.name === name) {
          scene.element.style.display = "flex";
          callback = scene.callback;
        } else {
          scene.element.style.display = "none";
        }
      });
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
    constructor(difficulty, goal) {
      if (difficulty === undefined) {
        throw new Error("Game: difficulty is required")
      }
      if (goal === undefined) {
        throw new Error("Game: goal is required")
      }
      this.difficulty = difficulty;
      this.lives = new Lives();
      this.score = new Score(goal);
      this.timer = new Timer();
    }
  }

  /*
  Lives
  - Track lives
  */
  class Lives {
    constructor() {
      this.lives = 5;
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
    constructor(goal) {
      if (goal === undefined) {
        throw new Error("Score: goal is required")
      }
      this.score = 0;
      this.goal = goal;
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
    constructor(limit) {
      this.limit = limit
    }
  }

  const mainMusic = document.getElementById("mainMusic");
  const startButton = document.getElementById("startButton");
  const pauseButton = document.getElementById("pauseButton");
  const loseButton = document.getElementById("loseButton");
  const winButton = document.getElementById("winButton");
  const difficultyPicker = document.getElementById("difficulty");
  const winScreenMenuButton = document.getElementById("winScreenMenuButton");
  const loseScreenMenuButton = document.getElementById("loseScreenMenuButton");
  const startScreen = document.getElementById("startScreen");
  const playScreen = document.getElementById("playScreen");
  const winScreen = document.getElementById("winScreen");
  const loseScreen = document.getElementById("loseScreen");
  // TODO: Move this to Game class
  const startGame = () => {
    // TODO: Move this into Game
    // Start music
    if (mainMusic.paused) {
      console.log("Starting paused music");
      mainMusic.play();
    }

    // Reset scores, in case we're restarting
    console.log("Resetting scores");
    result = 0;
    lives = 5;
    switch (difficulty) {
      case 3:
        limit = 120;
        currentTime = 60;
        interval = 600;
        break;
      case 2:
        limit = 90;
        currentTime = 60;
        interval = 800;
        break;
      case 1:
        limit = 45;
        currentTime = 30;
        interval = 1000;
        break;
      default:
        limit = 30;
        currentTime = 30;
        interval = 1000;
        break;
    }
    score.textContent = result;
    timeLeft.textContent = currentTime;
    livesLeft.textContent = lives;
    goal.textContent = limit;

    // Start the game
    moveMole();
    countDownTimerId = setInterval(countDown, 1000);
  };
  const endGame = () => {
    // TODO: Move this to Game
    // Giving up so lets stop the timers
    console.log("Ending game timers");
    clearInterval(countDownTimerId);
    clearInterval(timerId);
  };
  const scenes = [
    new Scene("start", startScreen),
    new Scene("play", playScreen, startGame),
    new Scene("win", winScreen, endGame),
    new Scene("lose", loseScreen, endGame),
  ];
  const sceneManager = new SceneManager(scenes);
  startButton.onclick = (e) => {
    e.preventDefault();
    sceneManager.changeScene("play");
  };
  pauseButton.onclick = (e) => {
    e.preventDefault();
    // We should pause all the game intervals
  };
  loseButton.onclick = (e) => {
    e.preventDefault();
    sceneManager.changeScene("lose");
  };
  winButton.onclick = (e) => {
    e.preventDefault();
    sceneManager.changeScene("win");
  };

  winScreenMenuButton.onclick = (e) => {
    e.preventDefault();
    // TODO: Move this to use scene manager
    // We should hide the winScreen, show the startScreen by resetting its CSS class
    sceneManager.changeScene("start");
  };

  loseScreenMenuButton.onclick = (e) => {
    e.preventDefault();
    // TODO: Move this to use scene manager
    // We should hide the winScreen, show the startScreen by resetting its CSS class
    sceneManager.changeScene("start");
  };

  difficultyPicker.onchange = (e) => {
    const newDifficulty = e.target.value;
    console.log(`Difficulty changed to ${e.target.value}`);
    switch (e.target.value) {
      case "extreme":
        difficulty = 3;
        break;
      case "hard":
        difficulty = 2;
        break;
      case "medium":
        difficulty = 1;
        break;
      default:
        difficulty = 0;
        break;
    }
  };

  // TODO: Move as much as possible below to Game
  const squares = document.querySelectorAll(".square");
  const mole = document.querySelector(".mole");
  const timeLeft = document.querySelector("#time-left");
  const score = document.querySelector("#score");
  const goal = document.querySelector("#goal");
  const livesLeft = document.querySelector("#livesLeft");
  const hitFx = document.querySelector("#hitFx");

  let result = 0;
  let hitPosition;
  let currentTime = 60;
  let timerId = null;
  let difficulty = 0;
  let limit = 30;
  let interval = 0;
  let lives = 5;

  function randomSquare() {
    squares.forEach((square) => {
      square.classList.remove("mole");
    });

    let newID = Math.floor(Math.random() * 16);
    console.log(`Moving mole to ${newID}`)

    let randomSquare = squares[newID];
    randomSquare.classList.add("mole");

    hitPosition = randomSquare.id;
  }

  squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id == hitPosition) {
        console.log(`They hit the mole!`)
        square.style.backgroundImage = 'url("./images/greenSplat.png")';
        square.style.backgroundSize = "90%";
        hitFx.load();
        hitFx.play();
        result++;
        score.textContent = result;
        hitPosition = null;
        clearInterval(timerId);
        setTimeout(() => {
          square.classList.remove("mole");
          square.style = undefined;
          randomSquare()
          moveMole()
        }, 200);
        if (result >= limit) {
          clearInterval(countDownTimerId);
          clearInterval(timerId);
          alert(`YOU DID IT! Your final score is ${result}`);
          sceneManager.changeScene("win");
        }
      } else {
        console.log(`Uh oh... They missed the mole...`)
        lives--;
        if (lives < 0) {
          clearInterval(countDownTimerId);
          clearInterval(timerId);
          alert("GAME OVER! Your final score is " + result);
          sceneManager.changeScene("lose");
        } else {
          livesLeft.textContent = lives;
        }
      }
    });
  });

  function moveMole() {
    clearInterval(timerId)
    timerId = setInterval(randomSquare, interval);
  }

  function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime;
    // livesLeft.textContent = currentTime;

    if (currentTime == 0) {
      clearInterval(countDownTimerId);
      clearInterval(timerId);
      alert("GAME OVER! Your final score is " + result);
      sceneManager.changeScene("lose");
    }
  }
})();
