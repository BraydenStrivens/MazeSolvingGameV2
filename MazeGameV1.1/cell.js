import { Colors } from "./utilities.js";

class Cell {
  constructor(rowNumber, columnNumber, parentGrid, parentSize, wallLength) {
    this.rowNumber = rowNumber;
    this.columnNumber = columnNumber;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;

    this.wallLength = wallLength;

    this.visited = false;
    this.walls = {
      topWall: {
        isShown: true,
        isRotating: false,
        theta: 0,
        maxTheta: 90,
      },
      bottomWall: {
        isShown: true,
        isRotating: false,
        theta: 180,
        maxTheta: 270,
      },
      leftWall: {
        isShown: true,
        isRotating: false,
        theta: 270,
        maxTheta: 360,
      },
      rightWall: {
        isShown: true,
        isRotating: false,
        theta: 90,
        maxTheta: 180,
      },
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

  drawTopWall(context, x, y, theta) {
    let x1 = x;
    let y1 = y;
    let x2 = x1 + this.wallLength * Math.cos((Math.PI * theta) / 180.0);
    let y2 = y1 + this.wallLength * Math.sin((Math.PI * theta) / 180.0);
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  drawBottomWall(context, x, y, theta) {
    let x1 = x + this.wallLength;
    let y1 = y + this.wallLength;
    let x2 = x1 + this.wallLength * Math.cos((Math.PI * theta) / 180.0);
    let y2 = y1 + this.wallLength * Math.sin((Math.PI * theta) / 180.0);
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  drawRightWall(context, x, y, theta) {
    let x1 = x + this.wallLength;
    let y1 = y;
    let x2 = x1 + this.wallLength * Math.cos((Math.PI * theta) / 180.0);
    let y2 = y1 + this.wallLength * Math.sin((Math.PI * theta) / 180.0);
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  drawLeftWall(context, x, y, theta) {
    let x1 = x;
    let y1 = y + this.wallLength;
    let x2 = x1 + this.wallLength * Math.cos((Math.PI * theta) / 180.0);
    let y2 = y1 + this.wallLength * Math.sin((Math.PI * theta) / 180.0);
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  // Highlights the current cell on the grid. Columns is once again passed in to set the size of the grid.
  highlight(context, columns) {
    // Additions and subtractions added so the highlighted cell does cover the walls
    let x = (this.columnNumber * this.parentSize) / columns + 1;
    let y = (this.rowNumber * this.parentSize) / columns + 1;

    context.fillStyle = "";
    context.fillRect(
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
  }

  getCurrentCellCords(columns) {
    let cellSize = this.parentSize / columns;

    let x = this.columnNumber * cellSize;
    let y = this.rowNumber * cellSize;

    return [x, y];
  }

  removeWalls(cell1, cell2) {
    // compares to two cells on x axis
    let x = cell1.columnNumber - cell2.columnNumber;
    // Removes the relevant walls if there is a different on x axis
    if (x === 1) {
      cell1.walls.leftWall.isShown = false;
      cell2.walls.rightWall.isShown = false;
    } else if (x === -1) {
      cell1.walls.rightWall.isShown = false;
      cell2.walls.leftWall.isShown = false;
    }
    // compares to two cells on y axis
    let y = cell1.rowNumber - cell2.rowNumber;
    // Removes the relevant walls if there is a different on y axis
    if (y === 1) {
      cell1.walls.topWall.isShown = false;
      cell2.walls.bottomWall.isShown = false;
    } else if (y === -1) {
      cell1.walls.bottomWall.isShown = false;
      cell2.walls.topWall.isShown = false;
    }
  }

  // Draws each of the cells on the maze canvas
  show(context, wallColor, size, rows, columns) {
    let x = (this.columnNumber * size) / columns;
    let y = (this.rowNumber * size) / rows;
    // console.log(`x =${x}`);
    // console.log(`y =${y}`);
    if (wallColor == "mixed-animated") {
      let randomColor = Colors[Math.floor(Math.random() * Colors.length)];
      context.strokeStyle = randomColor;
    } else {
      context.strokeStyle = wallColor;
    }
    context.fillStyle = "black";
    context.lineWidth = 3;

    if (this.walls.topWall.isShown)
      this.drawTopWall(context, x, y, this.walls.topWall.theta);
    if (this.walls.rightWall.isShown)
      this.drawRightWall(context, x, y, this.walls.rightWall.theta);
    if (this.walls.bottomWall.isShown)
      this.drawBottomWall(context, x, y, this.walls.bottomWall.theta);
    if (this.walls.leftWall.isShown)
      this.drawLeftWall(context, x, y, this.walls.leftWall.theta);

    if (this.isGoal) {
      context.fillStyle = "rgb(83, 247, 43)";
      context.fillRect(x + 5, y + 5, size / columns - 10, size / rows - 10);
    }
  }

  rotateTopWall() {
    let topCellRow = this.rowNumber - 1;
    let topCellColumn = this.columnNumber;
    let topCell = this.parentGrid[topCellRow][topCellColumn];
    topCell.walls.bottomWall.isShown = false;

    let leftCell
    if (this.columnNumber !== 0) {
      let leftCellRow = this.rowNumber;
      let leftCellColumn = this.columnNumber - 1;
      leftCell = this.parentGrid[leftCellRow][leftCellColumn];
    }

    if (this.walls.topWall.theta <= 90) {
      this.walls.topWall.isRotating = true;
      this.walls.topWall.theta++;
    } else {
      this.walls.topWall.isRotating = false;
      this.walls.topWall.isShown = false;
      this.walls.topWall.theta = 0;
      this.walls.leftWall.theta = 270
      this.walls.leftWall.isShown = true;
      if (this.columnNumber !== 0) leftCell.walls.rightWall.isShown = true;
    }
  }
  rotateRightWall() {
    let rightCellRow = this.rowNumber;
    let rightCellColumn = this.columnNumber + 1;
    let rightCell = this.parentGrid[rightCellRow][rightCellColumn];
    rightCell.walls.leftWall.isShown = false;

    let topCell
    if (this.rowNumber !== 0) {
      let topCellRow = this.rowNumber - 1;
      let topCellColumn = this.columnNumber;
      topCell = this.parentGrid[topCellRow][topCellColumn];
    }
   
    if (this.walls.rightWall.theta <= 180) {
      this.walls.rightWall.isRotating = true;
      this.walls.rightWall.theta++;
    } else {
      this.walls.rightWall.isRotating = false;
      this.walls.rightWall.isShown = false;
      this.walls.rightWall.theta = 90;
      this.walls.topWall.theta = 0
      this.walls.topWall.isShown = true;
      if (this.rowNumber !== 0) topCell.walls.bottomWall.isShown = true;
    }
  }
  rotateBottomWall() {
    let bottomCellRow = this.rowNumber + 1;
    let bottomCellColumn = this.columnNumber;
    let bottomCell = this.parentGrid[bottomCellRow][bottomCellColumn];
    bottomCell.walls.topWall.isShown = false;

    let rightCell
    if (this.rowNumber !== this.parentGrid.length - 1) {
      let rightCellRow = this.rowNumber;
      let rightCellColumn = this.columnNumber + 1;
      rightCell = this.parentGrid[rightCellRow][rightCellColumn];
    }

    if (this.walls.bottomWall.theta <= 270) {
      this.walls.bottomWall.isRotating = true;
      this.walls.bottomWall.theta++;
    } else {
      this.walls.bottomWall.isRotating = false;
      this.walls.bottomWall.isShown = false;
      this.walls.bottomWall.theta = 180;
      this.walls.rightWall.theta = 90
      this.walls.rightWall.isShown = true;
      if (this.rowNumber !== this.parentGrid.length - 1) rightCell.walls.leftWall.isShown = true;
    }
  }
  rotateLeftWall() {
    let leftCellRow = this.rowNumber;
    let leftCellColumn = this.columnNumber - 1;
    let leftCell = this.parentGrid[leftCellRow][leftCellColumn];
    leftCell.walls.rightWall.isShown = false;

    let bottomCell
    if (this.rowNumber !== this.parentGrid.length - 1) {
      let bottomCellRow = this.rowNumber + 1;
      let bottomCellColumn = this.columnNumber;
      bottomCell = this.parentGrid[bottomCellRow][bottomCellColumn];
    }

    if (this.walls.leftWall.theta <= 360) {
      this.walls.leftWall.isRotating = true;
      this.walls.leftWall.theta++;
    } else {
      this.walls.leftWall.isRotating = false;
      this.walls.leftWall.isShown = false;
      this.walls.leftWall.theta = 270;
      this.walls.bottomWall.theta = 180
      this.walls.bottomWall.isShown = true;
      if (this.rowNumber !== this.parentGrid.length - 1) bottomCell.walls.topWall.isShown = true;
    }
  }

  rotateWall(cell, wallToRotate) {
    switch (wallToRotate) {
      // Rotate Top Wall
      case 0:
        if (cell.walls.topWall.theta < 90) {
          cell.walls.topWall.theta++;
        } else {
          cell.walls.topWall.isShown = false;
          cell.walls.topWall.theta = 0;
          cell.walls.leftWall.isShown = true;
        }
        break;

      // Rotate Right Wall
      case 1:
        cell.walls.rightWall.isRotating = true;
        if (cell.walls.rightWall.theta < 180) {
          cell.walls.rightWall.theta++;
        } else {
          cell.walls.rightWall.isRotating = false;
          cell.walls.rightWall.isShown = false;
          cell.walls.rightWall.theta = 90;
          cell.walls.topWall.isShown = true;
        }
        break;

      // Rotate Bottom Wall
      case 2:
        cell.walls.bottomWall.isRotating = true;
        if (cell.walls.bottomWall.theta < 270) {
          cell.walls.bottomWall.theta++;
        } else {
          cell.walls.bottomWall.isRotating = false;
          cell.walls.bottomWall.isShown = false;
          cell.walls.bottomWall.theta = 180;
          cell.walls.rightWall.isShown = true;
        }
        break;

      // Rotate Left Wall
      case 3:
        cell.walls.leftWall.isRotating = true;
        if (cell.walls.leftWall.theta < 360) {
          cell.walls.leftWall.theta++;
        } else {
          cell.walls.leftWall.isRotating = false;
          cell.walls.leftWall.isShown = false;
          cell.walls.leftWall.theta = 270;
          cell.walls.bottomWall.isShown = true;
        }
        break;
    }
  }

  getShownWalls() {
    let tWall = true ? this.walls.topWall.isShown : false;
    let rWall = true ? this.walls.rightWall.isShown : false;
    let bWall = true ? this.walls.bottomWall.isShown : false;
    let lWall = true ? this.walls.leftWall.isShown : false;

    let shownWalls = [tWall, rWall, bWall, lWall];

    return shownWalls;
  }

  equals(otherCell) {
    if (
      this.rowNumber == otherCell.rowNumber &&
      this.columnNumber == otherCell.columnNumber
    ) {
      return true;
    }

    return false;
  }

  toString() {
    let string = `Position: ${this.rowNumber}, ${this.columnNumber}
                  Visited: ${this.visited}
                  Walls: ${this.walls}`;

    return string;
  }
}

export default Cell;
