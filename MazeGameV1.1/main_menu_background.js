// const starColors = [
//   "rgb(255, 255, 255)",
//   "rgb(66, 236, 245)",
//   "rgb(125, 179, 189)",
//   "rgb(247, 5, 5)",
//   "rgb(107, 45, 41)",
//   "rgb(223, 230, 34)",
// ];
// let numColors = starColors.length;

// const states = [
//   "mainMenu",
//   "selectMode",
//   "customizeState",
//   "pauseGame"
// ]

// var currentState = "mainMenu"

// function getRandomColor() {
//   let randomIndex = Math.floor(Math.random() * numColors)
//   return starColors[randomIndex]
// }

// function generateRandomPercent(min = 0, max = 100) {
//   const randomInteger = Math.floor(Math.random() * (max + 1));
//   return `${randomInteger}%`;
// }

// function generateRadomDelay(interval = 3) {
//   const randomInteger = Math.random() * (interval + 1);
//   return `${randomInteger}s`;
// }

// function createStar() {
//   const star = document.createElement("div");
//   star.classList.add("star");
//   let randomColor = getRandomColor();
//   star.style.backgroundColor = `${randomColor}`;
//   star.style.border = `${randomColor} 0px solid`;
//   star.style.top = generateRandomPercent();
//   star.style.left = generateRandomPercent();
//   star.style.animationDelay = generateRadomDelay();
//   return star;
// }

// function renderStars(amount = 1000) {
//   const container = document.getElementById(currentState);
//   const placeholdersArray = Array(amount).fill("star_placeholder");
//   const starsArray = placeholdersArray.map((starPlacholder, index) =>
//     createStar()
//   );
//   container.append(...starsArray);
// }

// renderStars();