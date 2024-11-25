
/** @type {HTMLCanvasElement} */

import Player from "./player.js"
import Maze from "./maze.js"
import { GameModes, Difficulties, DifficultyDimensions, MazeColors } from "./utilities.js"

var timer;
var seconds;

var index = 0

class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.difficulty = Difficulties.easy
        this.gameMode = GameModes["defaultMode"]

        this.gameWidth = canvas.width 
        this.gameHeight = canvas.height 

        this.isRunning = false
        this.isPlaying = false
        this.isPaused = false
        this.isGameOver = false
        this.isRotating = false

        this.mazeGenerationComplete = false
        this.mazeWallColor = MazeColors.white
        this.mazeBackground = ""

        this.maze
        this.updateMaze() 
        this.player = new Player(this)

        this.gameDuration = 0
        
        this.fps = 30
        this.timer = 0
        this.interval = 1000 / this.fps

        this.mouse = {
            x: null,
            y: null,
            pressed: false
        }

        // Mouse Down Detection
        window.addEventListener('mousedown', (e) => {
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
            this.mouse.pressed = true
        })

        // Mouse Up Detection
        window.addEventListener('mouseup', (e) => {
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
            this.mouse.pressed = false
        })
    }

    startTimer() {
        if (!this.isPaused) seconds = 0
        this.isPaused = false
        timer = setInterval(function(){
            seconds++
        }, 1000)
    }

    pauseTimer() {
        this.isPaused = true
        clearInterval(timer)
    }
    
    stopTimer() {
        clearInterval(timer)
    }

    setupMaze(context) {
        this.maze.setupMaze()
        while (!this.mazeGenerationComplete) {
            context.clearRect(0, 0, this.gameWidth, this.gameHeight)
            this.maze.draw(context);
        }
    }

    setMazeGenerationComplete(isComplete) {
        this.mazeGenerationComplete = isComplete
    }

    getMazeGenerationComplete() {
        return this.mazeGenerationComplete
    }

    changeDifficulty(newDifficulty) {
        this.difficulty = newDifficulty
        this.updateMaze()

        let newCellSize = (this.maze.size / this.maze.rows)
        this.player.updateCellHeight(newCellSize)
    }

    changeGameMode(newGameMode) {
        this.gameMode = newGameMode
    }
  
    updateWallColor(newColor) {
        this.mazeWallColor = MazeColors[newColor]
        this.updateMaze()
    }

    updateMaze() {
        let dimensions = DifficultyDimensions[this.difficulty]
        this.maze = new Maze(this, this.gameHeight, dimensions[0],  dimensions[1], this.mazeWallColor);
    }

    restartGame(context) {
        this.endGame()
        this.setupMaze(context)
        this.isPaused = false
        this.player.x = 0
        this.player.y = 0
        this.startGame()
    }

    startGame() {
        $("#gameOverState").hide()
        this.startTimer()
        this.isPlaying = true
        this.isGameOver = false
    }

    gameOver() {
        this.playing = false
        this.isGameOver = true
        this.stopTimer()
        $("#gameOverTimer").html(`${this.gameDuration} Seconds`);
        $("#gameOverState").show()
    }

    endGame() {
        this.isPlaying = false
        this.stopTimer()
    }

    update() {
        if (this.isPlaying && !this.isPaused && !this.isGameOver) {
            this.gameDuration = seconds
            $("#timer").html(`${this.gameDuration}`)
            this.player.update()

            if (this.gameMode == GameModes["franticMode"]) {
                if (this.gameDuration !== 0 && this.gameDuration % 3 === 0) {
                    if (index < 90) {
                        if (this.isRotating === false) this.maze.selectCellsToRotate(); // console.log("SELECT CELLS")
                            this.isRotating = true
                            this.maze.rotateCellWalls(); console.log("ROTATE")
                    } else {
                        this.isRotating = false
                    }
                    index++
                } else {
                    index = 0
                }
            }
        }
    }

    renderMazeAndPlayer(context) {
        this.maze.drawGeneratedMaze(context)
        this.player.render(context)
    }

    render(context, deltaTime) {
        // Renders game at defined frames per second
        if (this.timer > this.interval) {
            this.timer = 0
            context.clearRect(0, 0, this.gameWidth, this.gameHeight)

            if (this.gameMode == GameModes["memoryMode"] && this.gameDuration > 3 && !this.isGameOver) {
                if (this.gameDuration % 5 - 3 == 0) {
                    if (this.mazeGenerationComplete) {
                        this.renderMazeAndPlayer(context)
                    }
                }
            } else {
                if (this.mazeGenerationComplete) {
                    this.renderMazeAndPlayer(context)
                }
            }
            
            
        }

        this.timer += deltaTime
    }

    init() {
        this.isRunning = true
    }  
}

export default Game