////////////////////////////////////////////////////////////////////////////////
// Actor - this is the base class for things that move around on the field
////////////////////////////////////////////////////////////////////////////////

var Actor = function(sprite) {
  // sprite - the image file depicting this actor
  this.sprite = sprite;

  // (xt,yt) - the target position, i.e. where to move to
  this.xt = 0;
  this.yt = 0;

  // (x,y) - current position
  this.x = 0;
  this.y = 0;

  // (vx,vy) - current velocity
  this.vx = 0;
  this.vy = 0;

  // velocity - how fast this actor moves
  this.velocity = 0;

  this.init();
};

// init() - customize the actor's initial state
Actor.prototype.init = function() {
  // nothing to do
};

// update(dt) - update the actor's position after a delta of time
Actor.prototype.update = function(dt) {
  this.x = this.x + dt * this.vx;
  this.y = this.y + dt * this.vy;

  this.afterUpdate();

  if (Math.abs(this.x - this.xt) < Math.abs(dt * this.vx)) {
    // we are at the target x
    this.x = this.xt;
    this.vx = 0;
  }

  if (Math.abs(this.y - this.yt) < Math.abs(dt * this.vy)) {
    // we are at the target y
    this.y = this.yt;
    this.vy = 0;
  }

  if (this.vx == 0 && this.vy == 0) {
    this.afterStop();
  }
};

// afterUpdate() - called after the actor updates position
Actor.prototype.afterUpdate = function() {
  //
};

// afterStop() - called after the actor stops its move
Actor.prototype.afterStop = function() {
  //
};

// render() - render the sprite in the current position
Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// setPos() - set the actor's current location and stop it
Actor.prototype.setPos = function(row, col) {
  this.x = col * 101;
  this.y = row * 83;
  this.xt = this.x;
  this.yt = this.y;

  this.vx = this.yv = 0;
};

// moveTo() - set the actor's target location
Actor.prototype.moveTo = function(row, col) {
  this.xt = col * 101;
  this.yt = row * 83;

  this.vx = this.vy = 0;

  var dx = this.xt - this.x;
  var dy = this.yt - this.y;

  var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  if (distance > 0) {
    this.vx = this.velocity * dx / distance;
    this.vy = this.velocity * dy / distance;
  }
};

// moveBy() - set the actor's target relative to the existing target
Actor.prototype.moveBy = function(deltaRow, deltaCol) {
  this.moveTo(this.getRow() + deltaRow, this.getCol() + deltaCol);
};

// getRow() - get the target row
Actor.prototype.getRow = function() {
  return this.yt / 83;
}

// getCol() - get the target columns
Actor.prototype.getCol = function() {
  return this.xt / 101;
}

// collidesWith() - true if the actor is colliding with another
Actor.prototype.collidesWith = function(actor) {
  if (this === actor) {
    return false;
  }
  if (Math.abs(this.x - actor.x) < 80 &&
      Math.abs(this.y - actor.y) < 20) {
        return true;
  } else {
    return false;
  }
};

// log() - log the actor's position
Actor.prototype.log = function(name) {
  console.log(this);
};

////////////////////////////////////////////////////////////////////////////////
// Enemy - this represents the bad guys
////////////////////////////////////////////////////////////////////////////////

var Enemy = function() {
  Actor.call(this, 'images/enemy-bug.png');
};
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

// init() - randomly pick the starting row and speed, start off screen
Enemy.prototype.init = function() {
  var row = Math.floor(Math.random() * 3) + 1,
      col = -1,
      velocity = Math.random() * 500 + 100;

  this.setPos(row, col);
  this.velocity = velocity;
  this.moveTo(row, 6);
};

// afterUpdate() - check to see if we collide with the player
Enemy.prototype.afterUpdate = function() {

  if (this.collidesWith(player)) {
    Engine.stop("YOU LOSE!");
  }

  // if we collide with another enemy, swap their speed.
  allEnemies.forEach(function(enemy) {
    if (this.collidesWith(enemy)) {
      var t = this.vx;
      this.vx = enemy.vx;
      enemy.vx = t;
      this.vy = enemy.vy;
    }
  }, this);
};

// afterStop() - reset after running off the end
Enemy.prototype.afterStop = function() {
  this.init();
};

////////////////////////////////////////////////////////////////////////////////
// Player - this is the player
////////////////////////////////////////////////////////////////////////////////

var Player = function() {
  Actor.call(this, 'images/char-boy.png');
};
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

// init() - set player on the home square
Player.prototype.init = function() {
  this.setPos(5, 2);
  this.velocity = 1000;

  document.addEventListener('keyup', this);
};

// afterUpdate() - check for a win
Player.prototype.afterUpdate = function() {
  if (this.y <= 0) {
    // player wins
    //this.log("player");
    document.removeEventListener('keyup', this);
    Engine.stop("YOU WIN!");
  }
};

// moveUp()
Player.prototype.moveUp = function() {
  if (this.getRow() > 0) {
    this.moveBy(-1, 0);
  }
};

// moveDown()
Player.prototype.moveDown = function() {
  if (this.getRow() < 5) {
    this.moveBy(1, 0);
  }
};

// moveLeft()
Player.prototype.moveLeft = function() {
  if (this.getCol() > 0) {
    this.moveBy(0, -1);
  }
};

// moveRight()
Player.prototype.moveRight = function() {
  if (this.getCol() < 4) {
    this.moveBy(0, 1);
  }
};

Player.prototype.handleEvent = function(event) {
  switch (event.type) {
    case 'keyup':
    var allowedKeys = {
          37: this.moveLeft,
          38: this.moveUp,
          39: this.moveRight,
          40: this.moveDown
        };
      var move = allowedKeys[event.keyCode];
      if (move) {
        move.call(this);
      }
      break;
    default:
      // ignore
  }
};
