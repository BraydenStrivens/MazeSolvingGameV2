
import Cell from "./cell.js"
import { Colors, DifficultyDimensions } from "./utilities.js"

let generation = false

class Maze {
    constructor(game, size, rows, columns, wallColor) {
        this.game = game
        this.size = size
        this.rows = rows
        this.columns = columns
        this.cellWallLength = this.size / this.rows

        this.grid = []
        this.stack = []

        this.cellsToRotate = []

        this.currentCell;

        this.randomColors = []
        this.wallColor = wallColor
    }

    verifyUniqueRandomCell(randomCell) {
      if (this.cellsToRotate.length === 0) return true

      this.cellsToRotate.forEach((cell) => {
        if (randomCell.equals(cell)) return false
      })

      return true
    }

    verifyNoRotatingNeighbors(randomCell) {
      if (this.cellsToRotate.length === 0) return true

      let randomRow = randomCell.rowNumber
      let randomColumn = randomCell.columnNumber

      this.cellsToRotate.forEach((cell) => {
        let currentRow = cell.rowNumber
        let currentColumn = cell.columnNumber

        if (Math.abs(randomRow - currentRow) === 1) return false
        if (Math.abs(randomColumn - currentColumn) === 1) return false
      })

      return true
    }

    getRandomCell() {
      let randomRowIndex = Math.floor(Math.random() * this.rows)
      let randomColumnIndex = Math.floor(Math.random() * this.columns)

      var randomCell = this.grid[randomRowIndex][randomColumnIndex]

      if (this.verifyUniqueRandomCell(randomCell) === false || this.verifyNoRotatingNeighbors(randomCell) === false) {
        randomCell = this.getRandomCell()
      }

      return randomCell
    }

    selectCellsToRotate() {
      this.cellsToRotate = []
      let numberOfRotatingCells = DifficultyDimensions[this.game.difficulty][0]

        for (let index = 0; index < numberOfRotatingCells; index++) {
          let randomCell = this.getRandomCell()
          this.cellsToRotate.push(randomCell)
        }
    }

    setupMaze() {
        for (let row = 0; row < this.rows; row++) {
            let currentRow = []

            for (let column = 0; column < this.columns; column++) {

                let cell = new Cell(row, column, this.grid, this.size, this.cellWallLength)
                currentRow.push(cell)

                if (this.wallColor == "mixed") {
                  let randomColor = Colors[Math.floor(Math.random() * Colors.length)]
                  this.randomColors.push(randomColor)
              }
            }
            this.grid.push(currentRow)
        }

        // Starting and end point
        this.currentCell = this.grid[0][0]
        this.grid[this.rows - 1][this.columns - 1].isGoal = true
    }

    rotateCellWalls() {
      
      this.cellsToRotate.forEach((cell) => {
        let availableWalls = cell.getShownWalls()
        // console.log(availableWalls)
        
        if (availableWalls[0]) {
          if (cell.rowNumber !== 0) cell.rotateTopWall()
          return
        }
        if (availableWalls[1]) {
          if (cell.columnNumber !== cell.parentGrid.length - 1) cell.rotateRightWall()
          return
        }
        if (availableWalls[2]) { 
          if (cell.rowNumber !== cell.parentGrid.length - 1) cell.rotateBottomWall()
          return  
        }
        if (availableWalls[3]) {
          if (cell.columnNumber !== 0) cell.rotateLeftWall()
          return
        }
      })
    }

    drawGeneratedMaze(context) {
      if (generation) {
        for (let row = 0; row < this.columns; row++) {
          for (let column = 0; column < this.rows; column++) {
            if (this.wallColor == "mixed") {
              this.grid[row][column].show(context, this.randomColors[(row * this.columns) + column], this.size, this.rows, this.columns)
            } else {
              this.grid[row][column].show(context, this.wallColor, this.size, this.rows, this.columns)
            }
          }
        }
      }
    }

    draw(context) {
        // this.canvas.style.background = "black"
        // mazeCanvas.css("background", "black")

        // Set the first cell as visited
        this.currentCell.visited = true
        
        // Loop through the 2d grid array and call the show method for each cell instance
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                let grid = this.grid
                if (this.wallColor == "mixed") {
                  grid[row][column].show(context, this.randomColors[(row * this.columns) + column], this.size, this.rows, this.columns)
                } else {
                  grid[row][column].show(context, this.wallColor, this.size, this.rows, this.columns)
                }
            }
        }
        
        // Assigns the variable 'next' to a random cell out of the current cell's
        // available neighboring cells
        let next = this.currentCell.checkNeighbors()

        // If there is a non-visited neighbor cell
        if (next) {
            next.visited = true

            // Add current cell to the stack for backtracking
            this.stack.push(this.currentCell)

            // Highlights the current cell on the grid
            // this.currentCell.highlight(context, this.columns)

            // Compares the current cell to the next cell and removes the relevant walls 
            this.currentCell.removeWalls(this.currentCell, next)

            // Sets the next cell to the current cell
            this.currentCell = next

        // Else if there are no available neighbors start backtracking
        } else if (this.stack.length > 0) {
            let cell = this.stack.pop()
            this.currentCell = cell
            this.currentCell.highlight(context, this.columns)
        }

        // If there are no more items in the stack then all the cells have been visited and the function is complete
        if (this.stack.length === 0) {
            this.game.setMazeGenerationComplete(true)
            generation = true
            return
        }
        // window.requestAnimationFrame(() => {
        //     this.draw(context);
        //   });
    }

    move(e, context) {
        if (!generation || this.game.isGameOver) return;
        let key = e.key;
        let row = this.currentCell.rowNumber;
        let col = this.currentCell.columnNumber;
      
        switch (key) {
          case "ArrowUp":
            if (!this.currentCell.walls.topWall.isShown) {
              let next = this.grid[row - 1][col];
              if (next.isGoal) {
                this.game.gameOver()
              }
              this.currentCell = next;

              let cords = this.currentCell.getCurrentCellCords(this.columns)
              this.game.player.setPosition(cords[0], cords[1])
            }
            break;
      
          case "ArrowRight":
            if (!this.currentCell.walls.rightWall.isShown) {
              let next = this.grid[row][col + 1];
              if (next.isGoal) {
                this.game.gameOver()
              }
              this.currentCell = next;

              let cords = this.currentCell.getCurrentCellCords(this.columns)
              this.game.player.setPosition(cords[0], cords[1])
            }
            break;
      
          case "ArrowDown":
            if (!this.currentCell.walls.bottomWall.isShown) {
              let next = this.grid[row + 1][col];
              if (next.isGoal) {
                this.game.gameOver()
              }
              this.currentCell = next;

              let cords = this.currentCell.getCurrentCellCords(this.columns)
              this.game.player.setPosition(cords[0], cords[1])
            }
            break;
      
          case "ArrowLeft":
            if (!this.currentCell.walls.leftWall.isShown) {
              let next = this.grid[row][col - 1];
              if (next.isGoal) {
                this.game.gameOver()
              }
              this.currentCell = next;

              let cords = this.currentCell.getCurrentCellCords(this.columns)
              this.game.player.setPosition(cords[0], cords[1])
            }
            break;
        }
      }
}

export default Maze