import Game from "./game.js";
import {
  GameModes,
  PlayerIcons,
  MazeColors,
  MazeBackgrounds,
  GameModeDescriptions,
} from "./utilities.js";

let game;
var renderAnimatedBackground = true

window.addEventListener("load", function () {
  /*
    GAME CANVAS
    */
  // const mazeCanvas = $("#gameCanvas");
  // const context = mazeCanvas[0].getContext('2d');
  const mazeCanvas = document.getElementById("gameCanvas");
  const context = mazeCanvas.getContext("2d");

  mazeCanvas.width = 1080;
  mazeCanvas.height = 1080;

  /*
    Game
    */

  game = new Game(mazeCanvas, context);
  game.init();

  $("#modeDescription").html(GameModeDescriptions[game.gameMode]);

  document.addEventListener("keydown", (event) => {
    if (game.isPaused == false) {
      game.maze.move(event, context);
    }
  });

  const starColors = [
    "rgb(255, 255, 255)",
    "rgb(66, 236, 245)",
    "rgb(125, 179, 189)",
    "rgb(247, 5, 5)",
    "rgb(107, 45, 41)",
    "rgb(223, 230, 34)",
  ];
  let numColors = starColors.length;

  function getRandomColor() {
    let randomIndex = Math.floor(Math.random() * numColors);
    return starColors[randomIndex];
  }

  function generateRandomPercent(min = 0, max = 100) {
    const randomInteger = Math.floor(Math.random() * (max + 1));
    return `${randomInteger}%`;
  }

  function generateRadomDelay(interval = 3) {
    const randomInteger = Math.random() * (interval + 1);
    return `${randomInteger}s`;
  }

  function createStar() {
    const star = document.createElement("div");
    star.classList.add("star");
    let randomColor = getRandomColor();
    star.style.backgroundColor = `${randomColor}`;
    star.style.border = `${randomColor} 0px solid`;
    star.style.zIndex = `${-1}`;
    star.style.top = generateRandomPercent();
    star.style.left = generateRandomPercent();
    star.style.animationDelay = generateRadomDelay();
    return star;
  }


  function renderStars(amount = 300) {
    if (renderAnimatedBackground) {
      const container = document.getElementById("animatedBackground");
      const placeholdersArray = Array(amount).fill("star_placeholder");
      const starsArray = placeholdersArray.map((starPlacholder, index) =>
        createStar()
      );
      container.append(...starsArray);
    }
  }

  renderStars();

  /* 
    GAME STATE ITEMS 
    */
  let mainMenuState = $("#mainMenu");
  let selectModeState = $("#selectMode");
  let playState = $("#playState");
  let pauseState = $("#pauseGame");
  let customizeState = $("#customizeState");
  let gameOverState = $("#gameOverState")

  /* 
    MAIN MENU STATE ITEMS
    */
  let menuPlayButton = $("#playButton");
  let menuCustomizeButton = $("#customizeButton");
  let menuSettingsButton = $("#settingsButton");

  menuPlayButton.click(function () {
    mainMenuState.hide();
    selectModeState.show();
  });
  menuCustomizeButton.click(function () {
    mainMenuState.hide();
    customizeState.show();
  });
  menuSettingsButton.click(function () {
    // TODO
    console.log("TODO");
  });

  /*
    MODE SELECT STATE ITEMS
    */
  // Back Arrow
  let modeSelectBackArrow = $("#selectBackArrow");

  modeSelectBackArrow.click(function () {
    selectModeState.hide();
    mainMenuState.show();
  });

  // Difficulties
  let difficultyButton = $(".difficulty-button");

  difficultyButton.click(function () {
    let ids = ["easyButton", "mediumButton", "hardButton", "impossibleButton"];

    ids.forEach((button) => {
      if ($(this).attr("id") == button) {
        $(`#${button}`).css("filter", "brightness(200%)");
        game.changeDifficulty(button.split("B")[0]);
      } else {
        $(`#${button}`).css("filter", "brightness(100%)");
      }
    });
  });

  // Game Modes
  let gameModeButton = $(".game-mode-button");

  gameModeButton.click(function () {
    let ids = ["defaultMode", "memoryMode", "franticMode"];

    ids.forEach((button) => {
      if ($(this).attr("id") == button) {
        let newGameMode = GameModes[button];
        $("#modeDescription").html(GameModeDescriptions[newGameMode]);
        game.changeGameMode(newGameMode);
        $(`#${button}`).css("filter", "brightness(200%)");
      } else {
        $(`#${button}`).css("filter", "brightness(100%)");
      }
    });
  });

  // Navigation Buttons
  let modeSelectPlayButton = $("#modePlayButton");

  modeSelectPlayButton.click(function () {
    game.setupMaze(context);
    game.startGame();

    selectModeState.hide();
    playState.show();
  });

  /*
    PLAY STATE ITEMS
    */
  let pauseButton = $("#pauseButton");

  pauseButton.click(function () {
    game.pauseTimer();
    pauseState.show();
  });

  /*
    PAUSE STATE ITEMS
    */
  let resumeButton = $("#pauseResumeButton");
  let restartButton = $("#pauseRestartButton");
  let pauseSettingsButton = $("#pauseSettingsButton");
  let helpButton = $("#pauseHelpButton");
  let quitButton = $("#pauseQuitButton");

  resumeButton.click(function () {
    game.startTimer();
    pauseState.hide();
  });
  restartButton.click(function () {
    pauseState.hide();
    game.restartGame(context);
  });
  pauseSettingsButton.click(function () {
    // TODO
    console.log("TODO");
  });
  helpButton.click(function () {
    // TODO
    console.log("TODO");
  });
  quitButton.click(function () {
    game.endGame();
    location.reload();
  });

  /*
    CUSTOMIZE STATE ITEMS
    */
  let customizeBackArrow = $("#customizeBackArrow");
  let iconSelectBox = $("#playerIconSelect");
  let mazeColorSelectBox = $("#mazeColorSelect");
  let mazeBackgroundColorSelectBox = $("#mazeBackgroundColorSelect");
  let customizeSaveButton = $("#customizeSaveButton");
  let backgroundImage = document.getElementById("backgroundImage");
  let iconPreview = document.getElementById("iconPreview");
  let colorPreview = document.getElementById("mazeColorPreview");
  let backgroundPreview = document.getElementById("backgroundPreview");

  let newIcon;
  let newColor;
  let newBackground;
  
  customizeBackArrow.click(function () {
    customizeState.hide();
    mainMenuState.show();
    currentState = "mainMenu";

  });
  iconSelectBox.on("change", function () {
    let keys = Object.keys(PlayerIcons);

    keys.forEach((icon) => {
      if (icon == $(this).val()) {
        let path = `./assets/playerIcons/${PlayerIcons[icon]}`;
        iconPreview.src = path;
        newIcon = icon
      }
    });
  });
  mazeColorSelectBox.on("change", function () {
    let keys = Object.keys(MazeColors);

    keys.forEach((color) => {
      if (color == $(this).val()) {
        let path = `./assets/previews/${color}.PNG`;
        colorPreview.src = path;
        newColor = color
        
      }
    });
  });
  mazeBackgroundColorSelectBox.on("change", function () {
    let keys = Object.keys(MazeBackgrounds);

    keys.forEach((background) => {
      if (background == $(this).val()) {
        let path = `./assets/backgroundImages/${MazeBackgrounds[background]}`;
        newBackground = path
        backgroundPreview.src = path;
      }
    });
  });
  customizeSaveButton.click(function () {
    if (newIcon) game.player.updatePlayerIcon(newIcon);
    if (newColor) game.updateWallColor(newColor);
    if (newBackground) backgroundImage.src = newBackground;
    customizeState.hide();
    selectModeState.show();
    currentState = "selectMode"

  });

  /*
  GAME OVER STATE
  */
  let playAgainButton = $("#playAgainButton")
  let mainMenuButton = $("#gameOverMainMenuButton")

  playAgainButton.click(function () {
    gameOverState.hide()
    game.restartGame()
  });

  mainMenuButton.click(function () {
    game.endGame();
    location.reload();
  });

  let lastTime = 0;

  function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.update();
    game.render(context, deltaTime);

    if (game.isRunning) requestAnimationFrame(gameLoop);
  }

  gameLoop(0);
});
