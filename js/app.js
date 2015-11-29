var Actor = function(sprite) {
  this.sprite = sprite;
  this.vx = 0;
  this.vy = 0;
};

Actor.prototype.update = function(dt) {
  this.x = this.x + dt * this.vx;
  this.y = this.y + dt * this.vy;
};

Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function() {
  Actor.call(this, 'images/enemy-bug.png');
  this.init();
};
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.init = function() {
  this.x = -101;
  var row = Math.floor(Math.random() * 3) + 1;
  this.y = row * 83 - 20;
  this.vx = Math.random() * 200 + 100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // update the position based on standard movement rules
  Actor.prototype.update.call(this, dt);

  this.checkPlayer();

  // if we go off the end. re-initialize
  if (this.x > 515) {
    this.init();
  }

  // if we are about to bump anyone, slow down.
  allEnemies.forEach(function(e) {
    if (this !== e) {
      // not looking at ourself
      if (this.y == e.y) {
        // on the same row
        if (Math.abs(this.x - e.x) < 101 && this.vx > e.vx) {
          // we are about to collide and we are faster
          // make sure we are not touching
          this.x = e.x - 101;
          // and slow down
          this.vx = e.vx;
        }
      }
    }
  }, this);
};

Enemy.prototype.checkPlayer = function() {
  if (Math.abs(this.x - player.x) < 101 && Math.abs(this.y - player.y) < 83) {
    console.log("YOU LOSE!");
  }
};

var Player = function() {
  Actor.call(this, 'images/char-boy.png');

  this.row = 4;
  this.col = 2;
  this.speed = 300;

  // initial position
  this.x = this.col * 101;
  this.y = this.row * 83 - 20;
};
Player.prototype = Object.create(Actor.prototype);
Player.prototype.contructor = Player;

Player.prototype.update = function(dt) {
  Actor.prototype.update.call(this, dt);

  // stop moving when you get to the goal square
  if (Math.abs(this.x - this.col * 101) < Math.abs(dt * this.vx)) {
    this.x = this.col * 101;
    this.vx = 0;
  }
  if (Math.abs(this.y - (this.row * 83 - 20)) < Math.abs(dt * this.vy)) {
    this.y = this.row * 83 - 20;
    this.vy = 0;
  }

  this.checkSuccess();
};

Player.prototype.checkSuccess = function() {
  if (this.y < 63) {
    //console.log("YOU WIN!");
  }
};

Player.prototype.handleInput = function(key) {
  switch (key) {
    case 'left':
      this.col = Math.max(this.col - 1, 0);
      this.vx = -this.speed;
      this.vy = 0;
      break;
    case 'right':
      this.col = Math.min(this.col + 1, 4);
      this.vx = this.speed;
      this.vy = 0;
      break;
    case 'up':
      this.row = Math.max(this.row - 1, 0);
      this.vx = 0;
      this.vy = -this.speed;
      break;
    case 'down':
      this.row = Math.min(this.row + 1, 4);
      this.vx = 0;
      this.vy = this.speed;
      break;
    default:
      // ignore
  }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var i;
for (i = 0; i < 3; i++) {
  allEnemies.push(new Enemy());
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
