function Asteroid(x, y, text) {
  this.position = createVector(x, y);

  // Set color to white
  this.color = color(0,0,255);

  this.text = text;
  this.size = 1;
  this.completedText = "";
  this.intact = true;
}

/**
 * moves Astroid down the screen
 */
Asteroid.prototype.update = function() {
  // Base falling speed
  let fallingSpeed = map(score, 0, 1000, 1, 15) + 0.20;

  // If there are more than 5 words on the screen, reduce falling speed
  if (field.length >= 5) {
    fallingSpeed *= 0.5; // You can adjust the multiplier as needed
  }

  this.position.y += fallingSpeed;

  if (this.position.y > height) {
    endGame();
  }
};


/**
 * based upon keyCode, will add to the completedText
 */
Asteroid.prototype.erode = function(keyCode) {
  var inputChar = String.fromCharCode(keyCode).toLowerCase();
  var length = this.completedText.length + 1;

  if (this.text.substring(0, length) === this.completedText + inputChar) {
    this.completedText += inputChar;

    // Knockback effect: Move the asteroid up
    this.position.y -= 10; // You can adjust the knockback distance as needed
  }

  this.intact = (this.completedText !== this.text);
};


/**
 * draws Astroid
 */
Asteroid.prototype.draw = function() {
  fill(0,0,255); // Set fill color to white
  stroke(0);
  strokeWeight(1);
  ellipse(this.position.x, this.position.y, this.size);

  textAlign(CENTER, CENTER);

  textSize(20);

  for (let i = 0; i < this.text.length; i++) {
    if (i < this.completedText.length) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }

    text(this.text.charAt(i), this.position.x - this.size / 2 + i * 15, this.position.y);
  }
};



/**
 * figures out which Astroid within the field array
 * should be targeted
 */
function findAsteroid(code, field) {

  var char = String.fromCharCode(code).toLowerCase();

  for (var i = 0; i < field.length; i++) {
    if (field[i].text.startsWith(char)) {

      return field[i];
    }
  }

  return null;
}
