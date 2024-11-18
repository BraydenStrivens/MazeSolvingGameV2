
/** @type {HTMLCanvasElement} */

import Player from "./player.js"
import Maze from "./maze.js"
import { GameModes, Difficulties, DifficultyDimensions } from "./utilities.js"

class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.difficulty = Difficulties.easy
        this.gameMode = GameModes.default

        this.gameWidth = canvas.width 
        this.gameHeight = canvas.height 

        console.log(this.gameWidth, this.gameHeight)

        this.isRunning = false
        this.isPlaying = false

        this.maze
        this.updateMaze() 
        this.player = new Player(this)
        
        this.mazeGenerationComplete = false

        this.fps = 70
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
        console.log(newDifficulty)
        this.difficulty = newDifficulty
        this.updateMaze() 
        // let newPlayerRadius = (this.gameHeight / DifficultyDimensions[this.difficulty][0]) / 3
        // this.player.updateRadius(newPlayerRadius)
        // this.player.setPosition((this.maze.size / this.maze.rows), (this.maze.size / this.maze.rows))
        let newCellSize = (this.maze.size / this.maze.rows)
        this.player.updateCellHeight(newCellSize)
        console.log("CELL SIZE:", this.player.cellSize)
    }

    updateMaze() {
        let dimensions = DifficultyDimensions[this.difficulty]
        this.maze = new Maze(this, this.gameHeight, dimensions[0],  dimensions[1]);
    }

    changeGameMode(newGameMode) {
        this.gameMode = GameModes[newGameMode]
    }

    startGame() {
        this.isPlaying = true
    }

    endGame() {
        this.isPlaying = false
    }

    update() {
        this.player.update()
    }

    render(context, deltaTime) {
        // Renders game at defined frames per second
        if (this.timer > this.interval) {
            this.timer = 0
            context.clearRect(0, 0, this.gameWidth, this.gameHeight)
            
            if (this.mazeGenerationComplete) this.maze.drawGeneratedMaze(context)
            this.player.render(context)
            
        }

        this.timer += deltaTime
    }

    init() {
        this.isRunning = true
    }  
}

export default Game