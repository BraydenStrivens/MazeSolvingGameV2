
import Game from "./game.js"
import { GameModes, PlayerIcons, MazeColors, MazeBackgrounds, GameModeDescriptions } from "./utilities.js"

let game;


window.addEventListener("load", function () {
    /*
    GAME CANVAS
    */
    // const mazeCanvas = $("#gameCanvas");
    // const context = mazeCanvas[0].getContext('2d');
    const mazeCanvas = document.getElementById("gameCanvas")
    const context = mazeCanvas.getContext('2d')
    
    mazeCanvas.width = 1080
    mazeCanvas.height = 1080

    /*
    Game
    */

    game = new Game(mazeCanvas, context)
    game.init()

    $("#modeDescription").html(GameModeDescriptions[game.gameMode])

    document.addEventListener("keydown", (event) => {
        if (game.isPaused == false) game.maze.move(event, context)
    });

    /* 
    GAME STATE ITEMS 
    */
   let mainMenuState = $("#mainMenu");
   let selectModeState = $("#selectMode");
   let playState = $("#playState");
   let pauseState = $("#pauseGame");
   let customizeState = $("#customizeState");

    /* 
    MAIN MENU STATE ITEMS
    */
    let menuPlayButton = $("#playButton");
    let menuCustomizeButton = $("#customizeButton");
    let menuSettingsButton = $("#settingsButton");

    menuPlayButton.click(function() {
        mainMenuState.hide();
        selectModeState.show();
    });
    menuCustomizeButton.click(function() {
        mainMenuState.hide();
        customizeState.show();
    });
    menuSettingsButton.click(function() {
        // TODO
        console.log("TODO")
    });

    /*
    MODE SELECT STATE ITEMS
    */
    // Back Arrow
    let modeSelectBackArrow = $("#selectBackArrow");

    modeSelectBackArrow.click(function() {
        selectModeState.hide()
        mainMenuState.show()
    });

    // Difficulties
    let difficultyButton = $(".difficulty-button")
    
    difficultyButton.click(function() {
        let ids = ["easyButton", "mediumButton", "hardButton", "impossibleButton"];

        ids.forEach((button) => {
            if ($(this).attr("id") == button) {
                $(`#${button}`).css("opacity", "0.5");
                game.changeDifficulty(button.split("B")[0])
              } else {
                $(`#${button}`).css("opacity", "1");
              }
        });
    });

    // Game Modes
    let gameModeButton = $(".game-mode-button")

    gameModeButton.click(function() {
        let ids = ["defaultMode", "memoryMode", "franticMode"];

        ids.forEach((button) => {
            if ($(this).attr("id") == button) {
                let newGameMode = GameModes[button]
                $("#modeDescription").html(GameModeDescriptions[newGameMode])
                game.changeGameMode(newGameMode)
                $(`#${button}`).css("opacity", "0.5");
            } else {
                $(`#${button}`).css("opacity", "1");
            }
        });
    });

    // Navigation Buttons
    let modeSelectPlayButton = $("#modePlayButton");

    modeSelectPlayButton.click(function() {
        game.setupMaze(context)
        game.startGame()
        
        selectModeState.hide()
        playState.show()
    });

    /*
    PLAY STATE ITEMS
    */
    let pauseButton = $("#pauseButton");

    pauseButton.click(function() {
        game.pauseTimer()
        pauseState.show()
    });

    /*
    PAUSE STATE ITEMS
    */
    let resumeButton = $("#pauseResumeButton");
    let restartButton = $("#pauseRestartButton");
    let pauseSettingsButton = $("#pauseSettingsButton");
    let helpButton = $("#pauseHelpButton");
    let quitButton = $("#pauseQuitButton");

    resumeButton.click(function() {
        game.startTimer()
        pauseState.hide()
    });
    restartButton.click(function() {
        pauseState.hide()
        game.restartGame(context)
    });
    pauseSettingsButton.click(function() {
        // TODO
        console.log("TODO")
    });
    helpButton.click(function() {
        // TODO
        console.log("TODO")
    });
    quitButton.click(function() {
        game.endGame()
        location.reload();
        pauseState.hide()
        playState.hide()
        mainMenuState.show()
    });

    /*
    CUSTOMIZE STATE ITEMS
    */
    let customizeBackArrow = $("#customizeBackArrow");
    let iconSelectBox = $("#playerIconSelect");
    let mazeColorSelectBox = $("#mazeColorSelect");
    let mazeBackgroundColorSelectBox = $("#mazeBackgroundColorSelect");
    let customizeSaveButton = $("#customizeSaveButton");
    let backgroundImage = document.getElementById("backgroundImage")
    let iconPreview = document.getElementById("iconPreview")
    let colorPreview = document.getElementById("mazeColorPreview")
    let backgroundPreview = document.getElementById("backgroundPreview")

    customizeBackArrow.click(function() {
        customizeState.hide()
        mainMenuState.show()
    });
    iconSelectBox.on('change', function() {
        let keys = Object.keys(PlayerIcons)

        keys.forEach((icon) => {
            if (icon == $(this).val()) {
                let path = `./assets/playerIcons/${PlayerIcons[icon]}`
                iconPreview.src = path
                game.player.updatePlayerIcon(icon)
            }
        })
    });
    mazeColorSelectBox.on('change', function() {
        let keys = Object.keys(MazeColors)

        keys.forEach((color) => {
            if (color == $(this).val()) {
                let path = `./assets/previews/${color}.PNG`
                colorPreview.src = path
                game.updateWallColor(color)
            }
        })
    });
    mazeBackgroundColorSelectBox.on('change', function() {
        let keys = Object.keys(MazeBackgrounds)

        keys.forEach((background) => {
            if (background == $(this).val()) {
                let path = `./assets/backgroundImages/${MazeBackgrounds[background]}`
                backgroundImage.src = path
                backgroundPreview.src = path
            }
        })
    });
    customizeSaveButton.click(function() {
        customizeState.hide()
        selectModeState.show()
    });

    let lastTime = 0

    function gameLoop(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp

        game.update()
        game.render(context, deltaTime)

        if (game.isRunning) requestAnimationFrame(gameLoop)
    }

    gameLoop(0)
});
