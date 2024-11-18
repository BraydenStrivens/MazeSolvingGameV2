
import Cell from "./cell.js"
import { PlayerColors } from "./utilities.js"

let generation = false

class Maze {
    constructor(game, size, rows, columns) {
        this.game = game
        this.size = size
        this.rows = rows
        this.columns = columns

        this.grid = []
        this.stack = []

        this.currentCell;

        this.playerColor = PlayerColors[0]

        // this.canvas = this.game.canvas
    }

    updatePlayerColor(newColor) {
        this.playerColor = newColor
    }

    setupMaze() {
        for (let row = 0; row < this.rows; row++) {
            let currentRow = []

            for (let column = 0; column < this.columns; column++) {

                let cell = new Cell(row, column, this.grid, this.size, this.playerColor)
                currentRow.push(cell)
            }
            this.grid.push(currentRow)
        }

        // Starting and end point
        this.currentCell = this.grid[0][0]
        this.grid[this.rows - 1][this.columns - 1].isGoal = true
    }

    drawGeneratedMaze(context) {
      if (generation) {
        for (let row = 0; row < this.columns; row++) {
          for (let column = 0; column < this.rows; column++) {
            this.grid[row][column].show(context, this.size, this.rows, this.columns)
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
                grid[row][column].show(context, this.size, this.rows, this.columns)
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
            this.currentCell.highlight(context, this.columns)

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
        if (!generation) return;
        let key = e.key;
        let row = this.currentCell.rowNumber;
        let col = this.currentCell.columnNumber;
      
        switch (key) {
          case "ArrowUp":
            if (!this.currentCell.walls.topWall) {
              let next = this.grid[row - 1][col];
              this.currentCell = next;

              let cords = this.currentCell.getCurrentCellCords(this.columns)
              this.game.player.setPosition(cords[0], cords[1])
              
              this.draw(context);
              // this.currentCell.highlight(context, this.columns);
              // not required if goal is in bottom right
            //   if (this.currentCell.goal) complete.style.display = "block";
            }
            break;
      
          case "ArrowRight":
            if (!this.currentCell.walls.rightWall) {
              let next = this.grid[row][col + 1];
              this.currentCell = next;

              let cords = this.currentCell.getCurrentCellCords(this.columns)
              this.game.player.setPosition(cords[0], cords[1])

              this.draw(context);
              // this.currentCell.highlight(context, this.columns);
            //   if (this.currentCell.goal) complete.style.display = "block";
            }
            break;
      
          case "ArrowDown":
            if (!this.currentCell.walls.bottomWall) {
              let next = this.grid[row + 1][col];
              this.currentCell = next;

              let cords = this.currentCell.getCurrentCellCords(this.columns)
              this.game.player.setPosition(cords[0], cords[1])

              this.draw(context);
              // this.currentCell.highlight(context, this.columns);
            //   if (this.currentCell.goal) complete.style.display = "block";
            }
            break;
      
          case "ArrowLeft":
            if (!this.currentCell.walls.leftWall) {
              let next = this.grid[row][col - 1];
              this.currentCell = next;

              let cords = this.currentCell.getCurrentCellCords(this.columns)
              this.game.player.setPosition(cords[0], cords[1])

              this.draw(context);
              // this.currentCell.highlight(context, this.columns);
              // not required if goal is in bottom right
            //   if (this.currentCell.goal) complete.style.display = "block";
            }
            break;
        }
        this.game.player.drawPlayer(context)
      }
}

export default Maze