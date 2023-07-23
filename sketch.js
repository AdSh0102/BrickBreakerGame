// declaring ball attributes
var ball_x;
var ball_y;
var ball_dx;
var ball_dy;
var ball_radius;

// declaring paddle attributes
var paddle_x;
var paddle_y;
var paddle_width;
var paddle_height;
var paddle_dx;

// declaring player attributes
var score;
var lives;
var alive;

// declaring brick grid attributes
var bricks;
var brick_height;
var brick_width;
var brick_rows;
var brick_columns;
var offset_x;
var offset_y;
var margin;

function setup() {
  // creating canvas
  createCanvas(400, 400);

  // initialising ball attributes
  ball_x = width / 2;
  ball_y = height / 2;
  ball_radius = 25 / 2;
  ball_dx = 3;
  ball_dy = 3;

  // initialising paddle attributes
  paddle_width = 90;
  paddle_height = 15;
  paddle_x = width / 2 - paddle_width / 2;
  paddle_y = height - 30;
  paddle_dx = 10;

  // initialising player attributes
  score = 0;
  lives = 3;
  alive = true;

  // initialising grid attributes
  brick_height = 20;
  brick_width = 50;
  brick_rows = 7;
  brick_columns = 4;
  bricks = [];
  offset_x = 10;
  offset_y = 10;
  margin = 5;
  for (var i = 0; i < brick_rows; ++i) {
    var brick_row = [];
    for (var j = 0; j < brick_columns; ++j) {
      const current_brick = {
        x: offset_x + brick_width * i + margin * i,
        y: offset_y + brick_height * j + margin * j,
        exists: true,
      };
      brick_row.push(current_brick);
    }
    bricks.push(brick_row);
  }

  render_elements();
}

// function to load score card when game is over
function score_card() {
  clear();
  background("black");
  fill("blue");
  textSize(32);
  text("GAME OVER", width / 2 - 100, height / 2 - 100);
  text("Score: " + score, width / 2 - 70, height / 2);
  textSize(16);
  text("Press any key to start a new game", width / 2 - 130, height / 2 + 100);
}

// function to load when game is over
function game_over() {
  ball_dx = 0;
  ball_dy = 0;
  score_card();
}

function reset_game() {
  // reset ball attributes
  ball_x = width / 2;
  ball_y = height / 2;
  ball_dx = 3;
  ball_dy = 3;

  // reset bricks
  for (var i = 0; i < brick_rows; ++i) {
    for (var j = 0; j < brick_columns; ++j) {
      bricks[i][j].exists = true;
    }
  }

  // reset paddle attributes
  paddle_x = width / 2 - paddle_width / 2;
  paddle_y = height - 30;

  // reset player attributes
  score = 0;
  lives = 3;
  alive = true;
}

// function to move the ball
function move_ball() {
  ball_x = ball_x + ball_dx;
  ball_y = ball_y + ball_dy;
}

// function to render elements onto the screen
function render_elements() {
  clear();
  background("grey");

  // ball
  fill("orange");
  circle(ball_x, ball_y, ball_radius * 2);

  // paddle
  fill("purple");
  rect(paddle_x, paddle_y, paddle_width, paddle_height);

  // bricks
  fill("yellow");
  for (var i = 0; i < brick_rows; ++i) {
    for (var j = 0; j < brick_columns; ++j) {
      if (!bricks[i][j].exists) continue;
      rect(bricks[i][j].x, bricks[i][j].y, brick_width, brick_height);
    }
  }

  textSize(16);
  fill("red");
  text("Score: " + score, 70, height - 100);
  text("Lives: " + lives, width - 150, height - 100);
}

function ball_hits_right_wall() {
  return ball_x + ball_radius >= width;
}

function ball_hits_left_wall() {
  return ball_x - ball_radius <= 0;
}

function ball_hits_bottom() {
  return ball_y + ball_radius >= width;
}

function ball_hits_top() {
  return ball_y <= ball_radius;
}

function move_paddle() {
  if (keyIsDown(RIGHT_ARROW)) {
    if (paddle_x + paddle_width <= width) paddle_x += paddle_dx;
  }
  if (keyIsDown(LEFT_ARROW)) {
    if (paddle_x > 0) paddle_x -= paddle_dx;
  }
}

function check_collision_with_paddle() {
  if (
    ball_x + ball_radius >= paddle_x &&
    ball_x - ball_radius <= paddle_x + paddle_width &&
    ball_y + ball_radius >= paddle_y &&
    ball_y - ball_radius <= paddle_y + paddle_height
  ) {
    var paddle_center = paddle_x + paddle_width / 2;
    var deviation = ball_x - paddle_center;
    ball_dy = -ball_dy; // Reverse the ball's vertical direction
    ball_dx = map(deviation, -paddle_width / 2, paddle_width / 2, -3, 3); // Adjust the ball's horizontal direction based on deviation from the center of the paddle 
  }
}

function check_collision_with_bricks() {
  for (var i = 0; i < brick_rows; i++) {
    for (var j = 0; j < brick_columns; j++) {
      var brick = bricks[i][j];
      if (brick.exists) {
        var brickLeft = brick.x;
        var brickRight = brick.x + brick_width;
        var brickTop = brick.y;
        var brickBottom = brick.y + brick_height;

        // Check for collision in x-direction
        if (
          ball_x + ball_radius >= brickLeft &&
          ball_x - ball_radius <= brickRight &&
          ball_y >= brickTop &&
          ball_y <= brickBottom
        ) {
          brick.exists = false; // The brick is hit, so it no longer exists
          ball_dx = -ball_dx; // Reverse the ball's horizontal direction
          score += 10; // Increase the player's score
        }

        // Check for collision in y-direction
        if (
          ball_y + ball_radius >= brickTop &&
          ball_y - ball_radius <= brickBottom &&
          ball_x >= brickLeft &&
          ball_x <= brickRight
        ) {
          brick.exists = false; // The brick is hit, so it no longer exists
          ball_dy = -ball_dy; // Reverse the ball's vertical direction
          score += 10; // Increase the player's score
        }
      }
    }
  }
}

function you_won() {
  ball_dx = 0;
  ball_dy = 0;
  score_card();
  clear();
  fill("green");
  textSize(32);
  text("YOU WON!", width / 2 - 90, height / 2 - 100);
  textSize(16);
  text("Press any key to start a new game", width / 2 - 130, height / 2 + 100);
}

function draw() {
  if(score == 280){
    you_won();
    if (keyIsPressed) {
      reset_game();
    }
    return;
  }
  // check to see if player is alive or dead and then render scorecard if dead
  if (!alive) {
    game_over();
    if (keyIsPressed) {
      alive = true;
      reset_game();
    }
    return;
  }

  // move ball to its new location
  move_ball();
  // check to see if the ball is being hit by a wall
  if (ball_hits_right_wall() || ball_hits_left_wall()) {
    ball_dx = -ball_dx;
  }

  // reduce lives by one and then check if there are any more lives remaining
  if (ball_hits_bottom()) {
    ball_dy = -ball_dy;
    lives -= 1;
    if (lives == 0) {
      alive = false;
      game_over();
    } else {
      ball_x = width / 2;
      ball_y = height / 2;
    }
  }
  if (ball_hits_top()) {
    ball_dy = -ball_dy;
  }

  // move the paddle
  move_paddle();

  // check to see if the ball hits the paddle
  check_collision_with_paddle();

  // function to check if the ball hits any bricks, if so brick make the brick vanish update score and change the ball direction
  check_collision_with_bricks();

  // draw the paddle, ball, score, and, bricks
  render_elements();
  return;
}
