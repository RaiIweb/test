import React, { useEffect , useState } from "react";

function Game() {

  const [ DIRECTION , ] = useState({
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
  })

  const [ rounds ,] = useState([5])
  const [ colors  , ] = useState(["#1abc9c", "#2ecc71", "#3498db", "#e74c3c", "#9b59b6"])

  useEffect(() => {
    
    // The ball object (The cube that bounces back and forth)
    var Ball = {
      new: function (incrementedSpeed) {
        return {
          width: 18,
          height: 18,
          x: this.canvas.width / 2 - 9,
          y: this.canvas.height / 2 - 9,
          moveX: DIRECTION.IDLE,
          moveY: DIRECTION.IDLE,
          speed: incrementedSpeed || 9,
        };
      },
    };

    // The paddle object (The two lines that move up and down)
    var Paddle = {
      new: function (side) {
        return {
          width: 18,
          height: 70,
          x: side === "left" ? 150 : this.canvas.width - 150,   // x position of paddle
          y: this.canvas.height / 2 - 35,                 // y position of paddle
          score: 0,
          move: DIRECTION.IDLE,
          speed: 8,
        };
      },
    };

    var Game = {

      initialize: function () {
        this.canvas = document.querySelector("canvas");
        this.context = this.canvas.getContext("2d");

        this.canvas.width = 1400;          // *****************
        this.canvas.height = 1000;         // *****************

        this.canvas.style.width = this.canvas.width / 2 + "px";   // *****************
        this.canvas.style.height = this.canvas.height / 2 + "px"; // *****************

        this.player = Paddle.new.call(this, "left");   // **********
        this.paddle = Paddle.new.call(this, "right");   // **********
        this.ball = Ball.new.call(this);

        this.paddle.speed = 8;            // **********
        this.running = this.over = false;     // **********
        this.turn = this.paddle;      

        console.log(this.turn);          // **********
        this.timer = this.round = 0;       // **********
        this.color = "#2c3e50";            // **********

        Game.menu();
        Game.listen();
      },

      endGameMenu: function (text) {
        // Change the canvas font size and color
        Game.context.font = "50px Courier New";
        Game.context.fillStyle = this.color;

        // Draw the rectangle behind the 'Press any key to begin' text.
        Game.context.fillRect(
          Game.canvas.width / 2 - 350,
          Game.canvas.height / 2 - 48,
          700,
          100
        );

        // Change the canvas color
        Game.context.fillStyle = "#ffffff";

        // Draw the end game menu text ('Game Over' and 'Winner')
        Game.context.fillText(
          text,
          Game.canvas.width / 2,
          Game.canvas.height / 2 + 15
        );

        setTimeout(function () {
          Game = Object.assign({}, Game);
          Game.initialize();
        }, 3000);
      },

         // **********
      menu: function () {
        // Draw all the Game objects in their current state
        console.log(Game);
        Game.draw();

        // Change the canvas font size and color
        this.context.font = "50px Courier New";
        this.context.fillStyle = this.color;

        // Draw the rectangle behind the 'Press any key to begin' text.
        this.context.fillRect(
          this.canvas.width / 2 - 350,
          this.canvas.height / 2 - 48,
          700,
          100
        );

        // Change the canvas color
        this.context.fillStyle = "#ffffff";

        // Draw the 'press any key to begin' text
        this.context.fillText(
          "Press any key to begin",
          this.canvas.width / 2,
          this.canvas.height / 2 + 15
        );
      },    // **********

      // Update all objects (move the player, paddle, ball, increment the score, etc.)
      update: function () {
        if (!this.over) {
          // If the ball collides with the bound limits - correct the x and y coords.
          if (this.ball.x <= 0)
            Game._resetTurn.call(this, this.paddle, this.player);
          if (this.ball.x >= this.canvas.width - this.ball.width)
            Game._resetTurn.call(this, this.player, this.paddle);
          if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
          if (this.ball.y >= this.canvas.height - this.ball.height)
            this.ball.moveY = DIRECTION.UP;

          // Move player if they player.move value was updated by a keyboard event
          if (this.player.move === DIRECTION.UP)
            this.player.y -= this.player.speed;
          else if (this.player.move === DIRECTION.DOWN)
            this.player.y += this.player.speed;

          // On new serve (start of each turn) move the ball to the correct side
          // and randomize the direction to add some challenge.
          if (Game._turnDelayIsOver.call(this) && this.turn) {
            this.ball.moveX =
              this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
            this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][
              Math.round(Math.random())
            ];
            this.ball.y =
              Math.floor(Math.random() * this.canvas.height - 200) + 200;
            this.turn = null;
          }

          // If the player collides with the bound limits, update the x and y coords.
          if (this.player.y <= 0) this.player.y = 0;
          else if (this.player.y >= this.canvas.height - this.player.height)
            this.player.y = this.canvas.height - this.player.height;

          // Move ball in intended direction based on moveY and moveX values
          if (this.ball.moveY === DIRECTION.UP)
            this.ball.y -= this.ball.speed / 1.5;
          else if (this.ball.moveY === DIRECTION.DOWN)
            this.ball.y += this.ball.speed / 1.5;
          if (this.ball.moveX === DIRECTION.LEFT)
            this.ball.x -= this.ball.speed;
          else if (this.ball.moveX === DIRECTION.RIGHT)
            this.ball.x += this.ball.speed;

          // Handle paddle (AI) UP and DOWN movement
          if (this.paddle.y > this.ball.y - this.paddle.height / 2) {
            if (this.ball.moveX === DIRECTION.RIGHT)
              this.paddle.y -= this.paddle.speed / 1.5;
            else this.paddle.y -= this.paddle.speed / 4;
          }
          if (this.paddle.y < this.ball.y - this.paddle.height / 2) {
            if (this.ball.moveX === DIRECTION.RIGHT)
              this.paddle.y += this.paddle.speed / 1.5;
            else this.paddle.y += this.paddle.speed / 4;
          }

          // Handle paddle (AI) wall collision
          if (this.paddle.y >= this.canvas.height - this.paddle.height)
            this.paddle.y = this.canvas.height - this.paddle.height;
          else if (this.paddle.y <= 0) this.paddle.y = 0;

          // Handle Player-Ball collisions
          if (
            this.ball.x - this.ball.width <= this.player.x &&
            this.ball.x >= this.player.x - this.player.width
          ) {
            if (
              this.ball.y <= this.player.y + this.player.height &&
              this.ball.y + this.ball.height >= this.player.y
            ) {
              this.ball.x = this.player.x + this.ball.width;
              this.ball.moveX = DIRECTION.RIGHT;
            }
          }

          // Handle paddle-ball collision
          if (
            this.ball.x - this.ball.width <= this.paddle.x &&
            this.ball.x >= this.paddle.x - this.paddle.width
          ) {
            if (
              this.ball.y <= this.paddle.y + this.paddle.height &&
              this.ball.y + this.ball.height >= this.paddle.y
            ) {
              this.ball.x = this.paddle.x - this.ball.width;
              this.ball.moveX = DIRECTION.LEFT;
            }
          }
        }

        // Handle the end of round transition
        // Check to see if the player won the round.
        console.log(this.player.score);

        if (this.player.score === rounds[this.round]) {
          // Check to see if there are any more rounds/levels left and display the victory screen if
          // there are not.
          if (!rounds[this.round + 1]) {
            this.over = true;

            console.log(this.player.score);
            setTimeout(function () {
              Game.endGameMenu("Winner!");
            }, 1000);
          } else {
            // If there is another round, reset all the values and increment the round number.
            this.color = this._generateRoundColor();
            this.player.score = this.paddle.score = 0;
            this.player.speed += 0.5;
            this.paddle.speed += 1;
            this.ball.speed += 1;
            this.round += 1;
          }
        }
        // Check to see if the paddle/AI has won the round.
        else if (this.paddle.score === rounds[this.round]) {
          this.over = true;
          console.log(this.player.score);
          setTimeout(function () {
            Game.endGameMenu("Game Over!");
          }, 1000);
        }
      },

      // Draw the objects to the canvas element
      draw: function () {
        // Clear the Canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Set the fill style to black
        this.context.fillStyle = this.color;

        // Draw the background
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set the fill style to white (For the paddles and the ball)
        this.context.fillStyle = "#fff";

        // Draw the Player
        this.context.fillRect(         // **********
          this.player.x,
          this.player.y,
          this.player.width,
          this.player.height
        );

        // Draw the Paddle
        this.context.fillRect(         // **********
          this.paddle.x,
          this.paddle.y,
          this.paddle.width,
          this.paddle.height
        );

        // Draw the Ball
        if (Game._turnDelayIsOver.call(this)) {
          this.context.fillRect(
            this.ball.x,                   // **********
            this.ball.y,                     // **********
            this.ball.width,             // **********
            this.ball.height
          );
        }

        // Draw the net (Line in the middle)
        this.context.beginPath();
        this.context.setLineDash([7, 15]);
        this.context.moveTo(this.canvas.width / 2, this.canvas.height - 120);
        this.context.lineTo(this.canvas.width / 2, 140);
        this.context.lineWidth = 10;
        this.context.strokeStyle = "#ffffff";
        this.context.stroke();        

        // Set the default canvas font and align it to the center
        this.context.font = "100px Courier New";
        this.context.textAlign = "center";

        // Draw the players score (left)
        this.context.fillText(
          this.player.score.toString(),
          this.canvas.width / 2 - 300,
          200
        );

        // Draw the paddles score (right)
        this.context.fillText(
          this.paddle.score.toString(),
          this.canvas.width / 2 + 300,
          200
        );

        // Change the font size for the center score text
        this.context.font = "30px Courier New";

        // Draw the winning score (center)
        this.context.fillText(
          "Round " + (Game.round + 1),
          this.canvas.width / 2,
          35
        );

        // Change the font size for the center score value
        this.context.font = "40px Courier";

        // Draw the current round number
        this.context.fillText(
          rounds[Game.round] ? rounds[Game.round] : rounds[Game.round - 1],
          this.canvas.width / 2,
          100
        );
      },

      loop: function () {
        Game.update();
        Game.draw();

        // If the game is not over, draw the next frame.
        if (!Game.over) requestAnimationFrame(Game.loop);
      },

      listen: function () {
        document.addEventListener("keydown", function (key) {
          // Handle the 'Press any key to begin' function and start the game.
          if (Game.running === false) {
            Game.running = true;
            window.requestAnimationFrame(Game.loop);
          }

          // Handle up arrow and w key events
          if (key.keyCode === 38 || key.keyCode === 87)
            Game.player.move = DIRECTION.UP;

          // Handle down arrow and s key events
          if (key.keyCode === 40 || key.keyCode === 83)
            Game.player.move = DIRECTION.DOWN;
        });

        // Stop the player from moving when there are no keys being pressed.
        document.addEventListener("keyup", function (key) {
          Game.player.move = DIRECTION.IDLE;
        });
      },

      // Reset the ball location, the player turns and set a delay before the next round begins.
      _resetTurn: function (victor, loser) {
        this.ball = Ball.new.call(this, this.ball.speed);
        this.turn = loser;
        this.timer = new Date().getTime();

        victor.score++;
      },

      // Wait for a delay to have passed after each turn.
      _turnDelayIsOver: function () {
        return new Date().getTime() - this.timer >= 1000;
      },

      // Select a random color as the background of each level/round.
      _generateRoundColor: function () {
        var newColor = colors[Math.floor(Math.random() * colors.length)];
        if (newColor === this.color) return Game._generateRoundColor();
        return newColor;
      },
    };

    Game.initialize();

  }, [])

  return <canvas></canvas>;
}

export default Game;
