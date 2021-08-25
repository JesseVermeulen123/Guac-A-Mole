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
    constructor(scoreLimit, timeLimit, moleSpawnInterval, splatTime) {
      if (scoreLimit === undefined) {
        throw new Error("Game: scoreLimit is required")
      }
      if (timeLimit === undefined) {
        throw new Error("Game: timeLimit is required")
      }
      if (moleSpawnInterval === undefined) {
        throw new Error("Game: moleSpawnInterval is required")
      }
      if (splatTime === undefined) {
        throw new Error("Game: splatTime is required")
      }
      this.lives = new Lives();
      this.score = new Score(scoreLimit);
      this.timer = new Timer(timeLimit);
      this.moleSpawnInterval = moleSpawnInterval;
      this.splatTime = splatTime;
      this.timerId = null;
      this.countDownTimerId = null;
      this.hitPosition = null;
    }

    start() {
      // We shouldn't need these, since we're creating the game each time we start
      // game.score.reset();
      // this.lives.reset();
      // this.timer.reset();
      score.textContent = this.score.currentScore();
      timeLeft.textContent = this.timer.currentTime();
      livesLeft.textContent = this.lives.currentLives();
      goal.textContent = this.score.limit();
      // Start the game
      this.moveMole();
      this.countDownTimerId = setInterval(this.countDown, 1000);
    }

    end() {
      // Giving up so lets stop the timers
      console.log("Ending game timers");
      clearInterval(this.countDownTimerId);
      clearInterval(this.timerId);
    }

    win() {
      this.end();
      winResult.textContent = `Your final score was ${this.score.currentScore()} with ${this.lives.currentLives()} lives and ${this.timer.currentTime()}s left.`;
      sceneManager.changeScene("win");
    }

    lose() {
      this.end()
      loseResult.textContent = `Your final score was ${this.score.currentScore()}/${this.score.limit()}.`;
      sceneManager.changeScene("lose");
    }

    randomSquare() {
      squares.forEach((square) => {
        square.classList.remove("mole");
      });

      let newID = Math.floor(Math.random() * 16);
      console.log(`Moving mole to ${newID}`)

      let randomSquare = squares[newID];
      randomSquare.classList.add("mole");

      this.hitPosition = randomSquare.id;
    }

    moveMole() {
      clearInterval(this.timerId)
      this.timerId = setInterval(() => {this.randomSquare()}, this.moleSpawnInterval);
    }
  
    countDown() {
      game.timer.decreaseTimer();
      timeLeft.textContent = game.timer.currentTime();
  
      if (game.timer.currentTime() == 0) {
        game.lose()
      }
    }

    hitMole(square) {
      console.log(`They hit the mole!`)
      square.style.backgroundImage = 'url("./images/greenSplat.png")';
      square.style.backgroundSize = "90%";
      hitFx.load();
      hitFx.play();
      this.score.increaseScore();
      score.textContent = this.score.currentScore();
      this.hitPosition = null;
      clearInterval(this.timerId);
      setTimeout(() => {
        square.classList.remove("mole");
        square.style = undefined;
        this.randomSquare()
        this.moveMole()
      }, this.splatTime);
      if (this.score.currentScore() >= this.score.limit()) {
        this.win();
      }
    }

    missMole() {
      console.log(`Uh oh... They missed the mole...`)
      this.lives.decreaseLives();
      if (this.lives.currentLives() < 0) {
        this.lose();
      } else {
        livesLeft.textContent = this.lives.currentLives();
      }
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

    decreaseLives() {
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

    limit() {
      return this.goal
    }

    increaseScore() {
      this.score++;
    }

    reset() {
      this.score = 0;
    }
  }

  /*
  Timer
  - 
  */
  class Timer {
    constructor(value) {
      this.value = value
    }

    currentTime() {
      return this.value
    }

    decreaseTimer() {
      this.value--
    }

    reset(value) {
      if (value === undefined) {
        throw new Error("Timer.reset: value is required")
      }
      this.value = value
    }
  }

  const mainMusic = document.getElementById("mainMusic");
  const startButton = document.getElementById("startButton");
  const difficultyPicker = document.getElementById("difficulty");
  const winScreenMenuButton = document.getElementById("winScreenMenuButton");
  const loseScreenMenuButton = document.getElementById("loseScreenMenuButton");
  const startScreen = document.getElementById("startScreen");
  const playScreen = document.getElementById("playScreen");
  const winScreen = document.getElementById("winScreen");
  const loseScreen = document.getElementById("loseScreen");
  const winResult = document.getElementById("winResult");
  const loseResult = document.getElementById("loseResult");
  // TODO: Move this to Game class
  const startGame = () => {
    // TODO: Move this into Game
    // Start music
    if (mainMusic.paused) {
      console.log("Starting paused music");
      mainMusic.play();
    }

    // Reset scores, in case we're restarting
    let limit;
    let currentTime;
    let interval;
    let splatTime = 200;
    console.log("Resetting scores");
    switch (difficulty) {
      case 3:
        limit = 120;
        currentTime = 60;
        interval = 600;
        splatTime = 25;
        break;
      case 2:
        limit = 90;
        currentTime = 60;
        interval = 800;
        splatTime = 50;
        break;
      case 1:
        limit = 30;
        currentTime = 30;
        interval = 1000;
        break;
      default:
        limit = 20;
        currentTime = 30;
        interval = 1000;
        break;
    }
    game = new Game(limit, currentTime, interval, splatTime);
    game.start();
  };
  const scenes = [
    new Scene("start", startScreen),
    new Scene("play", playScreen, startGame),
    new Scene("win", winScreen),
    new Scene("lose", loseScreen),
  ];
  const sceneManager = new SceneManager(scenes);
  startButton.onclick = (e) => {
    e.preventDefault();
    sceneManager.changeScene("play");
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
    console.log(`Difficulty changed to ${newDifficulty}`);
    switch (newDifficulty) {
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
  const timeLeft = document.querySelector("#time-left");
  const score = document.querySelector("#score");
  const goal = document.querySelector("#goal");
  const livesLeft = document.querySelector("#livesLeft");
  const hitFx = document.querySelector("#hitFx");

  let game;
  let difficulty = 0;

  squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === game.hitPosition) {
        game.hitMole(square);
      } else {
        game.missMole();
      }
    });
  });
})();
