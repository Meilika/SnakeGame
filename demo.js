const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const MAX_X = CANVAS_SIZE/CELL_SIZE;
const MAX_Y = CANVAS_SIZE/CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
const MOVE_INTERVAL = 80;

function initPosition() {
    return {
        x: Math.floor(Math.random() * MAX_X),
        y: Math.floor(Math.random() * MAX_Y),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
    }
}
let snake1 = initSnake("purple");
let snake2 = initSnake("blue");
let snake3 = initSnake("green");

let apple1 = {
    position: initPosition(),
}
let apple2 = {
    position: initPosition(),
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
    let scoreCanvas;
    if(snake.color == snake1.color) {
        scoreCanvas=document.getElementById("snake1ScoreBoard");
    } else if (snake.color == snake2.color) {
        scoreCanvas=document.getElementById("snake2ScoreBoard");
    } else {
        scoreCanvas=document.getElementById("snake3ScoreBoard");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0,0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight/2);
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color);
        for (let i = 1; i < snake1.body.length; i++) {
            drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
        }
        drawCell(ctx, snake2.head.x, snake2.head.y, snake2.color);
        for (let i = 1; i < snake2.body.length; i++) {
            drawCell(ctx, snake2.body[i].x, snake2.body[i].y, snake2.color);
        }
        drawCell(ctx, snake3.head.x, snake3.head.y, snake3.color);
        for (let i = 1; i < snake3.body.length; i++) {
            drawCell(ctx, snake3.body[i].x, snake3.body[i].y, snake3.color);
        }
        let image = document.getElementById("apple");
        ctx.drawImage(image, apple1.position.x * CELL_SIZE, apple1.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.drawImage(image, apple2.position.x * CELL_SIZE, apple2.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        
        drawScore(snake1);
        drawScore(snake2);
        drawScore(snake3);
    }, REDRAW_INTERVAL);
}

function teleport(snake){
    if (snake.head.y == -1) {
        snake.head.y = MAX_Y - 1;
    }
    if (snake.head.y == MAX_Y) {
        snake.head.y = 0;
    }
    if (snake.head.x == -1) {
        snake.head.x = MAX_X - 1;
    }
    if (snake.head.x == MAX_X) {
        snake.head.x = 0;
    }
}

function moveUp(snake) {
    snake.head.y = snake.head.y - 1;
    teleport(snake);
    eat(snake,apple1,apple2);
}

function moveDown(snake) {
    snake.head.y = snake.head.y + 1;
    teleport(snake);
    eat(snake,apple1,apple2);
}

function moveLeft(snake) {
    snake.head.x = snake.head.x - 1;
    teleport(snake);
    eat(snake,apple1,apple2);
}

function moveRight(snake) {
    snake.head.x = snake.head.x + 1;
    teleport(snake);
    eat(snake,apple1,apple2);
}

function checkCollision(snakes) {
    let isCollide = false;
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    return isCollide;
}


function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake1, snake2, snake3])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        console.log("collide", snake.color);
        if (snake == snake1) {
            snake1 = initSnake("purple");
            setTimeout(function() {
                move(snake1);
            }, MOVE_INTERVAL);
        } else if (snake == snake2) {
            snake2 = initSnake("blue");
            setTimeout(function() {
                move(snake2);
            }, MOVE_INTERVAL);
        } else {
            snake3 = initSnake("green");
            setTimeout(function() {
                move(snake3);
            }, MOVE_INTERVAL);
        }
    }
}

function eat(snake, apple1, apple2) {
    if (snake.head.x == apple1.position.x && snake.head.y == apple1.position.y) {
        //position sama -> sedang makan
        snake.score = snake.score + 1;
        apple1.position = initPosition();
        snake.body.push({x: snake.head.x, y: snake.head.y});
    } else if (snake.head.x == apple2.position.x && snake.head.y == apple2.position.y) {
        //position sama -> sedang makan
        snake.score = snake.score + 1;
        apple2.position = initPosition();
        snake.body.push({x: snake.head.x, y: snake.head.y});
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function(event){
    console.log(event.key);
    if (event.key === "ArrowUp") {
        snake1.direction = DIRECTION.UP;
    } else if (event.key === "ArrowDown") {
        snake1.direction = DIRECTION.DOWN;
    } else if (event.key === "ArrowLeft") {
        snake1.direction = DIRECTION.LEFT;
    } else if (event.key === "ArrowRight") {
        snake1.direction = DIRECTION.RIGHT;
    }

    if (event.key === "w") {
        snake2.direction = DIRECTION.UP;
    } else if (event.key === "s") {
        snake2.direction = DIRECTION.DOWN;
    } else if (event.key === "a") {
        snake2.direction = DIRECTION.LEFT;
    } else if (event.key === "d") {
        snake2.direction = DIRECTION.RIGHT;
    }

    if (event.key === "i") {
        snake3.direction = DIRECTION.UP;
    } else if (event.key === "k") {
        snake3.direction = DIRECTION.DOWN;
    } else if (event.key === "j") {
        snake3.direction = DIRECTION.LEFT;
    } else if (event.key === "l") {
        snake3.direction = DIRECTION.RIGHT;
    }
})

function initGame() {
    move(snake1);
    move(snake2);
    move(snake3);
}

initGame();
