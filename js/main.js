

//----------------------------------------------------vars---------------------------------------------------
var myGamePiece;
var myObstacles = [];
var myScore;
var gameover;
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 350;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0; //a property for counting frames
        this.interval = setInterval(updateGameArea, 10);//run this function every 20th millisecond
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
            myGamePiece.width = 40;
            myGamePiece.height = 40;
            myGamePiece.image.src = "img/bird2.png";
            accelerate(-0.05);
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false; 
            myGamePiece.width = 45;
            myGamePiece.height = 45;
            myGamePiece.image.src = "img/bird1.png";
            accelerate(0.05);
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function(){
        clearInterval(this.interval);
    }
}

//--------------------------------------------------functions-------------------------------------------------
function startGame() {
    myGamePiece = new component(45, 45, "img/bird1.png", 10, 10, "image");
    myScore = new component("18px", "Consolas", "black", 250, 20, "text");
    myBackground = new component(800, 520, "img/background.png", 0, 0, "background");
    gameover = new component(100, 100, "img/gameover.png", 120, 200, "image");
    myGameArea.start();
}

function component(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;

    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }

    this.speedX = 0;//horizontal speed
    this.speedY = 0;//vertical speed

    this.gravity = 0.05;   //gravity
    this.gravitySpeed = 0;

    this.bounce = 0.4;

    this.update = function(){
        ctx = myGameArea.context;
        if(type == 'text'){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }else if (type == 'image' || type == 'background'){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if(type == 'background'){
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }                  
        }else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);                    
        }
    }

    this.newPos = function(){
        if(this.type == "image"){
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;  
            this.hitTop();
            this.hitBottom();
        }else if (this.type == "background"){
            this.x += this.speedX;
            this.y += this.speedY;    
            if(this.x == -(this.width)){
                this.x = 0;
            }
        }else{
            this.x += this.speedX;
            this.y += this.speedY;                    
        }
    }

    this.crashWith = function(otherobj){
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
         if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;               
    }

    this.hitTop = function(){
        var rocktop = 0;
        if (this.y < rocktop) {
            this.y = rocktop;
        }
    }

    this.hitBottom = function(){
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }                
    }
}

function updateGameArea() {
    var x, y;
    for(i = 0; i < myObstacles.length; i += 1){
        if(myGamePiece.crashWith(myObstacles[i])){
            gameover.update();
            myGameArea.stop();
            return;
        }
    }
    myGameArea.clear();
    myBackground.speedX = -1;//moving background
    myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 2 || everyinterval(200)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 300;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight); //random obstacle height
        minGap = 100;
        maxGap = 400;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap); //random gap in between
        y = myGameArea.canvas.height;
        myObstacles.push(new component(20, height, "green", x, 0));
        myObstacles.push(new component(20, y - height - gap, "green", x, height + gap));
    }           
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }            
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0; 

    myScore.text="SCORE: " + Math.floor(myGameArea.frameNo/20);
    myScore.update();

    myGamePiece.newPos();
    myGamePiece.update();

    myObstacle.x += -1;
    myObstacle.update();                
}

function everyinterval(n){//this function returns true if the current framenumber corresponds with the given interval.
    if((myGameArea.frameNo / n) % 1 == 0){return true;}
    return false;
}

function accelerate(n){
    myGamePiece.gravity = n;
}