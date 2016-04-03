"use strict"

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var lastTime = Date.now();
var N = 30, M = 50, K = 2;
var grid; // 0:empty, 1:snake, 2:block
var snake = {
    dir : 0, // 0:right, 1:up, 2:left, 3:down
    vel : 1,
    tiles : [{x:0,y:0}],
    append : 0,
};
var cellSize = 10;
var powerup = 0; // 0: none, 3:bolcsesseg, 4:tukor, 5:ford, 6:mohosag, 7:lustasag, 8:falanksag

init();
gameLoop();

function genPickup() {
    var roll = veletlen(100,0);
    var pickup = 0;
    if(roll<80){
        pickup=3;
    }
    else if(roll<84){
        pickup=4;
    }
    else if(roll<88){
        pickup=5;
    }
    else if(roll<92){
        pickup=6;
    }
    else if(roll<96){
        pickup=7;
    }
    else{
        pickup=8;
    }
    
    var pos;
    var failed=true;
    while(failed){
        failed = false;
        pos = {x:veletlen(N,1), y:veletlen(M,1)}
        if(grid[pos.x][pos.y] != 0)
            failed=true;
    }
    grid[pos.x][pos.y] = pickup;
}
function init() {
    snake.dir = 0;
    snake.vel = 1;
    snake.tiles = [{x:0,y:0}];
    snake.append = 0;
    powerup = 0;
    
    grid = new Array(N);
    for(var i=0; i<N; i++){
        grid[i]=new Array(M);
        for(var j=0; j<M; j++){
            grid[i][j] = 0;
        }
    }
    grid[snake.tiles[0].x][snake.tiles[0].y] = 1;
    
    var blocks = [{x:veletlen(N,1),y:veletlen(M,1)}];
    grid[blocks[0].x][blocks[0].y] = 2;
    for(var i=0; i<K-1; i++){
        var x=veletlen(N,1);
        var y=veletlen(M,1);
        var placeable = true;
        blocks.forEach(function(element) {
            if(element.x == x && element.y == y){
                i -= 1;
                placeable=false;
            }
        }, this);
        if(placeable)
            grid[x][y] = 2;
        else
            i -= 1;
    }
    
    genPickup();
}
function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    update();
    draw();
}

function update(){
    var dt = Date.now() - lastTime;
    
    if(dt<100)
        return;
    
    lastTime += dt;
    dt /= 1000.0;
    
    var move={x:0,y:0};
    
    if(snake.dir==0)
        move.x += snake.vel;
    else if(snake.dir==1)
        move.y += snake.vel;
    else if(snake.dir==2)
        move.x -= snake.vel;
    else if(snake.dir==3)
        move.y -= snake.vel;
    
    var tailX = snake.tiles[snake.tiles.length-1].x;
    var tailY = snake.tiles[snake.tiles.length-1].y;
    
    
    // tail mozg
    for(var i=snake.tiles.length-1;i>0;i--){
        snake.tiles[i].x=snake.tiles[i-1].x;
        snake.tiles[i].y=snake.tiles[i-1].y;
    }
    
    // fej mozg
    snake.tiles[0].x+=move.x;
    snake.tiles[0].y+=move.y;
    if(snake.tiles[0].x<0 || snake.tiles[0].y<0 
    || snake.tiles[0].x>=N || snake.tiles[0].y>=M){
        init();
        return; // fallal utk
    }
    
    var eat = grid[snake.tiles[0].x][snake.tiles[0].y];
    if(eat == 2 || eat == 1){
        init();
        return; // akadallyal/farokkal utk
    }
    else if(eat!=0){
        // pickuppal utk
        genPickup();
        powerup = eat;
        switch(eat){
            case 3:
                snake.append += 4;
                break;
            default: break;
        };
    }
    
    // griden jeloles
    for(var i=0; i<N;i++){
        for(var j=0;j<M;j++){
            if(grid[i][j]==1){
                grid[i][j]=0;
            }
        }
    }
    snake.tiles.forEach(function(element) {
        grid[element.x][element.y]=1;
    }, this);

    // kigyo noveles
    if(snake.append>0){
        snake.tiles.push({x:tailX,y:tailY});
        snake.append -= 1;
    }
    
}

function draw(){
    ctx.fillStyle = 'yellow';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(var i=0; i<N; i++){
        for(var j=0; j<M; j++){
            if(grid[i][j] == 0) // tabla
                ctx.fillStyle = "green";
            else if(grid[i][j] == 1) // kigyo
                ctx.fillStyle = "red";
            else if(grid[i][j] == 2) // akadaly
                ctx.fillStyle = "black";
            else if(grid[i][j] == 3) // tekercs
                ctx.fillStyle = "purple";
            else if(grid[i][j] == 4) // tekercs
                ctx.fillStyle = "white";
            else if(grid[i][j] == 5) // tekercs
                ctx.fillStyle = "orange";
            else if(grid[i][j] == 6) // tekercs
                ctx.fillStyle = "yellow";
            else if(grid[i][j] == 7) // tekercs
                ctx.fillStyle = "magenta";
            else if(grid[i][j] == 8) // tekercs
                ctx.fillStyle = "gray";
            ctx.fillRect(i*cellSize,j*cellSize,cellSize,cellSize);
        }
    }
    
    ctx.fillStyle = 'cyan';
    ctx.font="20px Georgia";
    ctx.fillText('Score: '+snake.tiles.length,0,20);
}


function veletlen(to, from){
    return Math.floor( Math.random() * (to-from) ) + from;
}

function isCollision(a,b) {
    return !( a.y+a.height < b.y || a.x > b.x+b.width || a.y > b.y+b.height || a.x+a.width < b.x );
}


function onKeyDown(e){
    var code = e.which;
    if(code==39)
        snake.dir=0;
    if(code==40)
        snake.dir=1;
    if(code==37)
        snake.dir=2;
    if(code==38)
        snake.dir=3;
}
function onKeyUp(e){
    //ship.dir=0;
}