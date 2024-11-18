
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
        console.log("PLAYER RADIUS: ", this.playerRadius)


        this.spriteWidth = 200
        this.spriteHeight = 200
        this.cellSize = this.game.maze.size / this.game.maze.rows
        this.playerImage = new Image(this.cellSize)
        this.playerImage.src = "./assets/playerIcons/rainbow-dot.png"
        

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
        // let radius = 30
        // console.log("RADIUS:", radius)
        let centerX = this.x
        let centerY = this.y
        // let centerX = this.x
        // let centerY = this.y
        // console.log(`CORDS: ${centerX}, ${centerY}`)
        // context.beginPath()
        // context.arc(centerX, centerY, this.playerRadius, 0, 2 * Math.PI, false)
        // context.fillStyle = 'green'
        // context.fill()
        // context.lineWidth = 5
        // context.strokeStyle = "#003300"

        context.drawImage(this.playerImage, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.cellSize, this.cellSize)
    }
}

export default Player