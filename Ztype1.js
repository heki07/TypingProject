const WORDS = [ "apple","zebra","chair","sky","dog","banana","book","ocean","lamp","guitar","car","mountain","flower","computer","table","cat","sun","window","pen","keyboard","phone","house","tree","bird","coffee","moon","garden","fish","door","bed","music","shirt","river","camera","horse","painting","cloud","key","shoes","hat","cookie","bicycle","couch","soccer","ball","piano","radio","snake","television","clock","orange","cup","desk","chair","computer","sky","guitar","banana","book","apple","lamp","dog","ocean","mountain","table","flower","car","bird","sun","keyboard","fish","pen","phone","window","cat","house","tree","music","river","door","coffee","bed","camera","cloud","shirt","painting","key","bicycle","hat","shoes","cookie","soccer","couch","ball","snake","piano","television","radio","clock","orange","cup","desk","chair","computer","sky","guitar","banana","book","apple","lamp","dog","ocean","mountain","table","flower","car","bird","sun","keyboard","fish","pen","phone","window","cat","house","tree","music","river","door","coffee","bed","camera","cloud","shirt","painting","key","bicycle","hat","shoes","cookie","soccer","couch","ball","snake","piano","television","radio","clock","orange","cup","desk","chair","computer","sky","guitar","banana","book","apple","lamp","dog","ocean","mountain","table","flower","car","bird","sun","keyboard","fish","pen","phone","window","cat","house","tree","music","river","door","coffee","bed","camera","cloud","shirt","painting","key","bicycle","hat","shoes","cookie","soccer","couch","ball","snake","piano","television","radio","clock","orange","cup","desk","chair","computer","sky","guitar","banana","book","apple","lamp","dog","ocean","mountain","table","flower","car","bird","sun","keyboard","fish","pen","phone","window","cat","house","tree","music","river","door","coffee","bed","camera","cloud","shirt","painting","key","bicycle","hat","shoes","cookie","soccer","couch","ball","snake","piano","television","radio","clock","orange","cup","desk","chair","computer","sky","guitar","banana","book","apple","lamp","dog","ocean","mountain","table","flower","car","bird","sun","keyboard","fish","pen","phone","window","cat","house","tree","music","river","door","coffee","bed","camera","cloud","shirt","painting","key","bicycle","hat","shoes","cookie","soccer","couch","ball","snake","piano","television","radio","clock","orange","cup","desk" ];
 const usedWords = [];
var focus; // Astroid the player is currently typing out
var field = [];

var score = 0;

var planetCrust; // color of crust
var planetMantle; // color of mantle

var ship; // color of ship
var groundControlImage;

function preload() {
  groundControlImage = loadImage('tank.png'); // Replace with the path to your ground control image
}
let bestScore = 0;

function setup() {

  createCanvas(windowWidth, windowHeight);

  planetCrust = randomColor();
  planetMantle = randomColor();
  ship = randomColor();

  field.push(new Asteroid(random(width - 150) + 75, 0, random(WORDS), randomColor()));

  focus = null;
}

function draw() {

  background(51);

  drawBase();
  drawLazer();
	drawScore();

  handleField();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Adjust canvas size when the window is resized
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
}
/**
 * updates & draws Astroids
 * manages field array
 * increments score
 * manages focus
 * creates Asteroids
 */
function handleField() {
  for (var i = field.length - 1; i >= 0; i--) {
    field[i].update();
    if (field[i].intact) {
      field[i].draw();
    } else {
      score += field[i].text.length;
      usedWords.push(field[i].text);
      field.splice(i, 1);
      focus = null;
    }
  }

  /* attempt new Asteroid */
  if (frameCount % 30 === 0) {
    if (random() > map(score, 0, 1000, 0.8, 0.01)) {
      if (usedWords.length < WORDS.length) {
        let newWord;
        do {
          newWord = random(WORDS);
        } while (usedWords.includes(newWord));
  
        let newX, newY;
        // Ensure the new asteroid does not overlap with existing ones
        do {
          newX = random(width - 150) + 75;
          newY = 0;
        } while (isOverlap(newX, newY));
  
        // Remove the color argument
        field.push(new Asteroid(newX, newY, newWord));
      }
    }
}
// Check if a point (x, y) overlaps with any existing asteroid
function isOverlap(x, y) {
  for (let i = 0; i < field.length; i++) {
    let d = dist(x, y, field[i].position.x, field[i].position.y);
    if (d < field[i].size) {
      return true;
    }
  }
  return false;
}
}
/**
 * handles user input
 */
function keyPressed() {

  if (focus) {
		// if we have honed in on a specific Asteroid

    focus.erode(keyCode);
  } else {
		// find the astroid to target

    focus = findAsteroid(keyCode, field);

    if (focus) {
      focus.erode(keyCode);
    }
  }
}

/**
 * draws planet as a rectangle
 * draws "ground control" as a triangle
 */
function drawBase() {

  /* planet */
  fill(planetMantle);
  stroke(planetCrust);
  strokeWeight(5);
  rect(0, height - 15, width, height);

  /* ground control */
   image(groundControlImage, width / 2 - 50, height - 100, 100, 100);}

/**
 * draws "lazer" between ground control and Asteroid
 */
function drawLazer() {

  if (!focus)
    return;
  
  stroke(randomColor());
  strokeWeight(focus.completedText.length); // width of line depends on progress

	// point of ground control
  line(width / 2, height - 80 , focus.position.x, focus.position.y);
}

/**
 * draws the score
 */
function drawScore() {

  textAlign(RIGHT);
  noStroke();
  textSize(30);
  fill(255);
  text(score, 50, height / 2);
}

/**
 * Generates a random color
 */
function randomColor() {

  return color(random(255), random(255), random(255));
}
function resetGame() {
  // Reset game-related variables
  score = 0;
  usedWords.length = 0; // Clear the usedWords array
  field.length = 0; // Clear the field array
  focus = null;

  // Reset other initialization as needed
  planetCrust = randomColor();
  planetMantle = randomColor();
  ship = randomColor();

  // Create a new asteroid to start the game
  field.push(new Asteroid(random(width - 150) + 75, 0, random(WORDS), randomColor()));

  // Resume the game loop
  loop();
  var resetButton = document.getElementById('resetButton');
  resetButton.style.display = 'none';
  var exitButton = document.getElementById('exitButton');
  exitButton.style.display = 'none';
}
function exitHandler() {
  window.location.href = 'home.html';
}
function exitGame() {
  exitHandler();
}
/**
 * stops loop, draws game over message
 */
function endGame() {
  noLoop();

  // Show the "Exit" and "Reset" buttons
  var exitButton = document.getElementById('exitButton');
  var resetButton = document.getElementById('resetButton');
  if (exitButton && resetButton) {
    exitButton.style.display = 'inline';
    resetButton.style.display = 'inline';
  }

} 
