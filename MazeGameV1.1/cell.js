
let current;
let goal;

class Cell {
    constructor(rowNumber, columnNumber, parentGrid, parentSize, playerColor) {
      this.rowNumber = rowNumber;
      this.columnNumber = columnNumber;
      this.parentGrid = parentGrid;
      this.parentSize = parentSize;

      this.playerColor = playerColor
  
      this.visited = false;
      this.walls = {
        topWall: true,
        bottomWall: true,
        leftWall: true,
        rightWall: true
      };
      this.isGoal = false;
    }
  
    checkNeighbors() {
      let grid = this.parentGrid;
      let row = this.rowNumber;
      let column = this.columnNumber;
      let neighbors = [];

      // Pushes all available neighbors to the neighbors array
      // undefined is returned where the index is out of bounds
      let top = row !== 0 ? grid[row - 1][column] : undefined;
      let bottom = row !== grid.length - 1 ? grid[row + 1][column] : undefined;
      let right = column !== grid.length - 1 ? grid[row][column + 1] : undefined;
      let left = column !== 0 ? grid[row][column - 1] : undefined;
  
      // If not 'undefined', push to neighbors array
      if (top && !top.visited) neighbors.push(top);
      if (bottom && !bottom.visited) neighbors.push(bottom);
      if (right && !right.visited) neighbors.push(right);
      if (left && !left.visited) neighbors.push(left);
  
      // Chooses a random neighbor from the neighbors array
      if (neighbors.length !== 0) {
        let randomIndex = Math.floor(Math.random() * neighbors.length);
        return neighbors[randomIndex];
      } else {
        return undefined;
      }
    }
  
    drawTopWall(context, x, y, size, columns, rows) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + size / columns, y);
      context.stroke()
    }
  
    drawBottomWall(context, x, y, size, columns, rows) {
      context.beginPath();
      context.moveTo(x, y + size / rows);
      context.lineTo(x + size / columns, y + size / rows);
      context.stroke()
    } 
  
    drawRightWall(context, x, y, size, columns, rows) {
      context.beginPath();
      context.moveTo(x + size / columns, y);
      context.lineTo(x + size / columns, y + size / rows);
      context.stroke()
    }
  
    drawLeftWall(context, x, y, size, columns, rows) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y + size / rows);
      context.stroke()
    }
  
    // Highlights the current cell on the grid. Columns is once again passed in to set the size of the grid.
    highlight(context, columns) {
      // Additions and subtractions added so the highlighted cell does cover the walls
      let x = (this.columnNumber * this.parentSize) / columns + 1;
      let y = (this.rowNumber * this.parentSize) / columns + 1;

      context.fillStyle = this.playerColor
      context.fillRect(
        x,
        y,
        this.parentSize / columns - 3,
        this.parentSize / columns - 3
      );
    }

    getCurrentCellCords(columns) {
      let cellSize = this.parentSize / columns
      let cellCenter = cellSize / 2

      console.log("CELL SIZE: ", cellSize)

      let x = this.columnNumber * cellSize;
      let y = this.rowNumber * cellSize;

      return [x, y]
    }
  
    removeWalls(cell1, cell2) {
      // compares to two cells on x axis
      let x = cell1.columnNumber - cell2.columnNumber;
      // Removes the relevant walls if there is a different on x axis
      if (x === 1) {
        cell1.walls.leftWall = false;
        cell2.walls.rightWall = false;
      } else if (x === -1) {
        cell1.walls.rightWall = false;
        cell2.walls.leftWall = false;
      }
      // compares to two cells on x axis
      let y = cell1.rowNumber - cell2.rowNumber;
      // Removes the relevant walls if there is a different on x axis
      if (y === 1) {
        cell1.walls.topWall = false;
        cell2.walls.bottomWall = false;
      } else if (y === -1) {
        cell1.walls.bottomWall = false;
        cell2.walls.topWall = false;
      }
    }
  
    // Draws each of the cells on the maze canvas
    show(context, size, rows, columns) {
      let x = (this.columnNumber * size) / columns;
      let y = (this.rowNumber * size) / rows;
      // console.log(`x =${x}`);
      // console.log(`y =${y}`);
      context.strokeStyle = "#ffffff";
      context.fillStyle = "black";
      context.lineWidth = 5;
      if (this.walls.topWall) this.drawTopWall(context, x, y, size, columns, rows);
      if (this.walls.rightWall) this.drawRightWall(context, x, y, size, columns, rows);
      if (this.walls.bottomWall) this.drawBottomWall(context, x, y, size, columns, rows);
      if (this.walls.leftWall) this.drawLeftWall(context, x, y, size, columns, rows);
      // if (this.visited) {
      //     context.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
      // }
      if (this.isGoal) {
          context.fillStyle = "rgb(83, 247, 43)";
          context.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
      }
    }

    toString() {
      let string = `Position: ${this.rowNumber}, ${this.columnNumber}
                  Visited: ${this.visited}
                  Walls: ${this.walls}`

      return string
    }
  }
  
  export default Cell
  