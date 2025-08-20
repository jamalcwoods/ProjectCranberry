let ypos = 200;
let yvel = 0;
let squish = false;
let squishTimer = 0;
let obstacles = []
let backgroundColor = [255,255,255];
let groundColor = [0,0,0];

function setup(){
    createCanvas(800,300);   
    obstacles.push({
        x:900,
        y: 200,
        h:25,
        w:25,
        speed: 3
    })
    noStroke()
}

function updateSketchColors(){
    getAverageColor(images[currentIndex], function(color) {
        backgroundColor = color;
        groundColor = rgbToComplement(color)
    })
}

function draw(){
    background(backgroundColor[0],backgroundColor[1],backgroundColor[2])

    ypos -= yvel;
    if(ypos >= 200){
        ypos = 200;

        if(yvel < 0){
            yvel = 0 
            squishTimer = millis() + 100;
        }
    }

    if(ypos < 200){
        yvel -= 0.1
    }

    

    if(squish || squishTimer > millis()){
        fill(255,0,0)
        ellipse(100,ypos + 25/2, 50,25)
        rectMode(CENTER)
        fill(0,150,0);
        rect(115,ypos,25,5)
        rect(85,ypos,25,5)
    } else {
        fill(255,0,0)
        ellipse(100,ypos, 50,50)
        rectMode(CENTER)
        fill(0,150,0);
        rect(115,ypos - 30,25,10)
        rect(85,ypos - 30,25,10)
    }

    
    for(o of obstacles){
        o.x -= o.speed;
        rectMode(CENTER)    
        rect(o.x,o.y,o.w,o.h)
        if(o.x < 0){
            o.x = width + 50
        }
    }
    

    rectMode(CORNER)
    fill(groundColor[0],groundColor[1],groundColor[2])
    rect(0,225,800,100)
}

function buttonPressDown(){
    if(ypos == 200){
        squish = true;
    }
}

function triggerJump(){
    if(squish){
        squish = false;
        yvel = 5;
    }
}
