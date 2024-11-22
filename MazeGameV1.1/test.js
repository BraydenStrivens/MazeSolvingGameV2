

const testCanvas = document.getElementById("testCanvas")
const context = testCanvas.getContext("2d")

testCanvas.width = 1500
testCanvas.height = 1500

let width = testCanvas.width
let height = testCanvas.height


var x1 = width / 2;
var y1 = height / 2;
var r =  width / 3;
var theta = 0;

let fps = 70
var timer = 0
var interval = 1000 / fps
let lastTime = 0


context.fillStyle = "rgb(83, 247, 43)"
context.strokeStyle = "rgb(83, 247, 43)"
context.lineWidth = 3;



function render(context, deltaTime) {
    // Renders game at defined frames per second
    if (timer > interval) {
        timer = 0
        context.clearRect(0, 0, width, height)
        
        if (theta != 360) theta += 1
        // console.log(theta)

        let x2 = x1 + r *  Math.cos(Math.PI * theta / 180.0)
        let y2 = y1 + r * Math.sin(Math.PI * theta / 180.0)
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();

        // console.log(`Start: ${x1}, ${y1} End: ${x2}, ${y2}`)
        
    }

    timer += deltaTime
}


function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp

    render(context, deltaTime)

    requestAnimationFrame(gameLoop)
}

gameLoop(0)