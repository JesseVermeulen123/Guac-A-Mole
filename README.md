# Guac-A-Mole

[Play it here!](https://jessevermeulen123.github.io/Guac-A-Mole/)


## Description

Guac-A-Mole is a game where the objective is to make enough guacamole for a party you have been invited to. 
To do this a mallet that will be used to smash avocados in a whac-a-mole manner. 
The player loses when they have missed five avocados. 
The player wins when they collect the required amount of avocados in the given time and have at least one life remaining. 



## MVP

- game has a mallet cursor
- avocados spawn randomly on the grid
- you win by collecting the required amount of avocados as possible during the time alloted. 
- time countdown 
- missing an avocado will make you lose a "life" 
- if you lose all five lives, you lose the game
- increased difficulty levels

## Backlog

- Randomise ingredients 
- Add health-bar 


## Data structure

# main.js 

- buildSplashScreen () {}
- buildGameScreen () {}
- buildGameOverScreen () {}
- buildWinScreen () {}

# game.js

- Game () {}
- starLoop () {}
- checkCollisions () {}
- addTentacle () {}
- clearCanvas () {}
- updateCanvas () {}
- drawCanvas () {}
- GameOver () {}

## States y States Transitions

- splashScreen
- gameScreen
- gameoverScreen
- winScreen


## Task

- main - buildDom
- main - buildSplashScreen
- main - addEventListener
- main - buildGameScreen
- main - buildGameOverScreen
- main - buildWinScreen
- main - changeCursor
- game - startLoop
- game - addAvocado
- game - checkScore
- game - timeLeft
- game - addEventListener

### Trello (Actually GitHub Project)
[Guac-A-Mole Project](https://github.com/JesseVermeulen123/Guac-A-Mole/projects/1)


### Slides
[Guac-A-Mole Presentation](https://docs.google.com/presentation/d/1EoPjQ0tQImXnU_Hrr_7SnjuBWYLYrL3Y8OFowSrWEco/edit?usp=sharing)
