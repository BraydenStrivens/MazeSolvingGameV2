
import { PlayerIcons } from "./utilities.js"

class Player {
    constructor(game) {
        this.game = game

        // this.x = (this.game.maze.size / this.game.maze.rows)
        // this.y = (this.game.maze.size / this.game.maze.rows)
        this.x = 0
        this.y = 0
        this.xVelocity = 0
        this.yVelocity = 0
        this.speed = 1

        

        this.playerWidth = 100
        this.playerHeight = 100

        // this.playerRadius = (this.game.maze.size / this.game.maze.rows) / 2
        this.playerRadius = (this.game.maze.size / this.game.maze.rows) / 3


        this.spriteWidth = 200
        this.spriteHeight = 200
        this.cellSize = this.game.maze.size / this.game.maze.rows
        this.playerImage = new Image(this.spriteWidth, this.spriteHeight)
        this.playerImage.src = "./assets/playerIcons/default-icon.png"
        

        this.keys = {
            arrowUp: false,
            arrowDown: false,
            arrowLeft: false,
            arrowRight: false
        }

        // Mouse Down Detection
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.keys.arrowUp = true
                    break
                case 'ArrowDown':
                    this.keys.arrowDown = true
                    break
                case 'ArrowRight':
                    this.keys.arrowRight = true
                    break
                case 'ArrowLeft':
                    this.keys.arrowLeft = true
                    break
            }
        })

        // Mouse Up Detection
        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.keys.arrowUp = false
                    break
                case 'ArrowDown':
                    this.keys.arrowDown = false
                    break
                case 'ArrowRight':
                    this.keys.arrowRight = false
                    break
                case 'ArrowLeft':
                    this.keys.arrowLeft = false
                    break
            }
        })
    }

    updateRadius(newRadius) {
        this.playerRadius = newRadius
    }

    updateCellHeight(newCellHeight) {
        this.cellSize = newCellHeight
    }

    updatePlayerIcon(newIcon) {
        let iconPath = PlayerIcons[newIcon]
        this.playerImage = new Image(this.cellSize)
        this.playerImage.src = `./assets/playerIcons/${iconPath}`
    }

    setPosition(x, y) {
        this.x = x 
        this.y = y
    }

    update() {
        // Player Movement
        // if (this.keys.arrowUp && this.keys.arrowDown) {
        //     this.yVelocity = 0

        // } else if (this.keys.arrowLeft && this.keys.arrowRight) {
        //     this.xVelocity = 0

        // } else if (this.keys.arrowUp) {
        //     this.yVelocity = this.speed * -1

        // } else if (this.keys.arrowDown) {
        //     this.yVelocity = this.speed 

        // } else if (this.keys.arrowLeft) {
        //     this.xVelocity = this.speed * -1

        // } else if (this.keys.arrowRight) {
        //     this.xVelocity = this.speed
        
        // } else {
        //     this.xVelocity = 0
        //     this.yVelocity = 0
        // } 

        // this.x += this.xVelocity
        // this.y += this.yVelocity
    }

    render(context) {
        this.drawPlayer(context)
    }

    drawPlayer(context) {

        context.drawImage(this.playerImage, 
            0, 0, this.spriteWidth, this.spriteHeight, 
            this.x + (this.cellSize / 6), this.y + (this.cellSize / 6), this.cellSize * 2/3, this.cellSize * 2/3)
    }
}

export default Player