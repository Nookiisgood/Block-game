var brickImg;
var ball;
var ballImg;
var paddle;
var brick = [];
var k = 0;
var edges;
var brickGroup;
var t = 0;

var life = 3;
var gameState = 'start';
var score = 0;


function preload() {
  brickImg = loadImage("brickImg.png");
  ballImg = loadImage("circle.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  paddle = createSprite(windowWidth / 2, windowHeight - 100, 135, 20)
  edges = createEdgeSprites()

  ball = createSprite(windowWidth / 2, windowHeight - 150, 10, 10)
  ball.addImage(ballImg)
  ball.scale = 0.03

  brickGroup = new Group();

  //inverted pyramid pattern
  for (var y = 75; y < 800; y = y + 35) {
    for (var x = 345 + y; x < 1200 - y; x = x + 66) {
      brick[k] = createSprite(x, y, 50, 25)
      brick[k].addImage(brickImg)
      brickGroup.add(brick[k])

      k = k + 1
    }
  }
}

function draw() {
  background(200);
  textSize(24)
  fill("black")
  text("Lives: " + life, windowWidth / 2 + 525, windowHeight / 2 - 240)

  text("Score: " + score, windowWidth / 2 - 600, windowHeight / 2 - 240)

  if (ball.y > windowHeight - 50) {
    life = life - 1;
    ball.x = windowWidth / 2;
    ball.y = windowHeight - 150;
    ball.velocityX = 0;
    ball.velocityY = 0;
    gameState = 'start'
    paddle.x = windowWidth / 2
  }

  if (life < 1) {
    gameState = 'end';
    textSize(50)
    fill("black")
    text("Game Over, You Suck", windowWidth / 2 - 100, windowHeight / 2 + 150)
    paddle.x = windowWidth / 2
  }

  if (score === 132) {
    gameState = 'end'
    textSize(50)
    fill("black")
    text("You Win", windowWidth / 2 - 100, windowHeight / 2)
  }

  if (gameState === 'start') {
    if (keyDown("space") && life >= 1) {
      ball.velocityX = 9
      ball.velocityY = -9
      gameState = 'served'
    }
  }
  if (gameState === "served") {
    if (ball.x > paddle.x + 25 && ball.isTouching(paddle)) {
      ball.velocityX = 9;
    }
    if (ball.x < paddle.x - 25 && ball.isTouching(paddle)) {
      ball.velocityX = -9;
    }
    if (ball.x > paddle.x - 25 && ball.x < paddle.x + 25 && ball.isTouching(paddle)) {
      ball.velocityY = 10.5;
      if (ball.isTouching(paddle) && t % 2 === 0) {
        ball.velocityX = 4.5;
        t++;
      } else {
        ball.velocityX = -4.5;
        t++
      }
    }
    for (var i = 0; i < brickGroup.length; i++) {
      if (brickGroup.get(i).isTouching(ball)) {
        ball.bounceOff(brickGroup)
        brickGroup.get(i).destroy();
        score = score + 2;

      }
    }
    paddle.x = mouseX
    paddle.collide(edges)

    ball.bounceOff(edges[0]);
    ball.bounceOff(edges[1]);
    ball.bounceOff(edges[2]);
    ball.bounceOff(paddle)
  }

  drawSprites();
}
