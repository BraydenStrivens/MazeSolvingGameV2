
import Game from "./game.js"
import { PlayerColors } from "./utilities.js"

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

    document.addEventListener("keydown", (event) => {
        game.maze.move(event, context)
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
        let ids = ["defaultMode", "franticMode"];

        ids.forEach((button) => {
            if ($(this).attr("id") == button) {
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
        
        selectModeState.hide()
        playState.show()
    });

    /*
    PLAY STATE ITEMS
    */
    let pauseButton = $("#pauseButton");

    pauseButton.click(function() {
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
        pauseState.hide()
    });
    restartButton.click(function() {
        // TODO
        console.log("TODO")
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

    customizeBackArrow.click(function() {
        customizeState.hide()
        mainMenuState.show()
    });
    iconSelectBox.on('change', function() {
        console.log("TODO")
        
        PlayerColors.forEach((color) => {
            if (color == $(this).val()) {
                game.maze.updatePlayerColor(color)
                console.log($(this).val())
            }
        })
        // TODO
    });
    mazeColorSelectBox.on('change', function() {
        // TODO
        console.log("TODO")
    });
    mazeBackgroundColorSelectBox.on('change', function() {
        // TODO
        console.log("TODO")
    });
    customizeSaveButton.click(function() {
        // TODO
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
