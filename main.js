//Ryan Crouch Midterm: Suburban Teen Simulator
//Game of character trying to hide smoking weed from mom 

//canvas
let mapCanvas;
let centerX;
let centerY;

//interaction
let clicked = false;

//player
let playerX;
let playerY;
let playerImage;
let highLevel = 50; 
let highModifier = 0;
let canMoveUp = true;
let canMoveDown = true;
let canMoveLeft = true;
let canMoveRight = true;

//players hand
let handX;
let handY;
let handAngle;
let handColor = [0, 255, 0];
let handDistance = 150;
let hand;
let handImageOpen;
let handImageClosed;

//inventory
let inventory = false;
let inventoryItems = [];
let inventorySize = 10;
let inventoryColor = 150;
let spaceMouseOver;
let mouseOverInventory = false;


//map movement
let mapMove;
let maxDistFromMiddle = 100;
let ifMapMoves = false;

//map
let mapX;
let mapY;
let floor = 1; //first floor
let firstFloorImage;
let firstFloorBuffer;
let secondFloorImage;
let secondFloorBuffer;
let buffer;
let floorImage;
let floorBuffer;
let floorFrameCount = 0;


//time
let realTime = [0, 0]; //minutes, seconds
let gameTime = [0, 8]; //days hours: 
let start;
let timeElapsed;
let timePaused = 0;

//clock
let clockImage;
let hourHandAngle; //hour hand
let hourHandX;
let hourHandY;
let minuteHandAngle; //minute hand 
let minuteHandX;
let minuteHandY;

//items
let worldItems = [];
let itemInHand = [0];

//crafting
let spliced = 0;

//item images
let appleImage;
let knifeImage;
let applePipeImage;
let weedImage;
let febreezeImage;
let penImage;
let waterBottleImage;

//animation
let frameCount = 0;
let noiseLocation = 1000;
let smokeArray = [];

//Mom
let mom;
let floor1Smell = 0; 
let floor2Smell = 0;
let paths = [];

//Mom's movement
let nodeList = [
    new DoorNode(1, 325, -460), //front door 0 
    new Node(1, 470, -260), //trash can 1 
    new Node(1, 340, -60), //counter 2   
    new Node(1, 340, 140), //Oven 3
    new Node(1, 340, 300), //sink 4
    new Node(1, 340, 460), //fridge 5
    new Node(1, 220, 140),//6
    new DoorNode(1, 100, -260),//7 Door from entryway/kitchen to living room
    new Node(1, -8, -122),//8
    new Node(1, -195, 400),//9
    new Node(1, -320, 120), //10 couch
    new Node(1, -195, -160), //11
    new DoorNode(1, -460, -400),//12Door from living room to stairs
    new DoorNode(1, -460, -400)//12Door from living room to stairs
];


//states
let state = 0; //0 = start, 1 = playing, 2 = paused, 3 = dead;

function preload(){
    playerImage = loadImage("Assets/player.png");
    handImageOpen = loadImage("Assets/Player_Hand_Open.png");
    hand = handImageOpen;
    handImageClosed = loadImage("Assets/Player_Hand_Closed.png");
    firstFloorImage = loadImage("Assets/first_floor.png");
    firstFloorBuffer = loadImage("Assets/first_floor_hitmap.png");
    secondFloorImage = loadImage("Assets/second_floor.png");
    secondFloorBuffer = loadImage("Assets/second_floor_buffer.png");
    clockImage = loadImage("Assets/clock.png");
    appleImage = loadImage("Assets/apple.png");
    knifeImage = loadImage("Assets/knife.png");
    weedImage = loadImage("Assets/weed.png");
    febreezeImage = loadImage("Assets/fabreeze.png");
    penImage = loadImage("Assets/pen.png");
    waterBottleImage = loadImage("Assets/water_bottle.png");
    
    //craftable images 
    recipes[0][6] = loadImage("Assets/apple_with_hole.png"); //Apple with hole image
    recipes[1][6] = loadImage("Assets/apple_pipe.png"); //loaded apple pipe
    recipes[2][6] = loadImage("Assets/baggy.png"); //baggy
    recipes[3][6] = loadImage("Assets/empty_water_bottle_bong.png"); //empty water bottle bong
    recipes[4][6] = loadImage("Assets/water_bottle_bong.png");
    
    //populates inventory items with 0's 
    for (let i = 0; i < 10; i++){
        inventoryItems[i] = 0;
    }
    
    //
    //gives all the nodes numbers in the list
    for (let i = 0; i < nodeList.length; i++){
        nodeNumber = i;
    }
}

function setup(){
    pixelDensity(1);
    //draws the canvas
    mapCanvas = createCanvas(1200, 750); 
    buffer = createGraphics(1200, 750);
    mapCanvas.parent("canvasDiv");
    background(100);
    
    centerX = width / 2;
    centerY = height / 2;
    
    playerX = mapX = centerX;
    playerY = mapY = centerY;
    
    zeroVector = createVector(1,0);
    setStartTime(); //sets the start time
    
    //some test objects 
    worldItems.push(new Apple(-200, 100, 'apple', 30, appleImage, 1));
    worldItems.push(new Knife(500, -100, 'knife', 50, knifeImage, 1));
    worldItems.push(new Weed(130, -90, 'weed', 45, weedImage, 2));
    worldItems.push(new Febreeze(280, -506, 'febreeze', 45, febreezeImage, 2));
    worldItems.push(new Pen(-257,426, 'pen', 45, penImage, 2));
    worldItems.push(new WaterBottle(-457, -456, 'water bottle', 45, waterBottleImage, 2));
    
    mom = new Mom(nodeList[10]);
}

function draw(){  
    
    //console.log(state);
    //checks to see which floor we are on 
    if (floor == 1){
        floorImage = firstFloorImage;
        floorBuffer = firstFloorBuffer;
    }
    else if (floor == 2){
        floorImage = secondFloorImage;
        floorBuffer = secondFloorBuffer;
        
    }
    playerVector = createVector(playerX, playerY);
    background(0);
    imageMode(CENTER);
    image(floorImage, mapX, mapY, 1500, 1500);
    buffer.imageMode(CENTER);
    buffer.image(floorBuffer, mapX, mapY, 1500, 1500);
    
    stroke(10);
    noFill();
    
    stroke(0)
    rect(mapX, mapY, 1100, 1100);
    //--------------------------------------------------------------TIME-----------------------------------
    if (timeFreeze == false){
        timeElapsed = new Date().getTime() - start + (8 * 60000) - timePaused; //ADD TO TIME ELAPSED TO CHANGE CLOCK
    }
    
    realTime[0] = int(timeElapsed / 60000);
    realTime[1] = int(timeElapsed / 1000) - (60 * realTime[0]);
    
    gameTime[0] = int(timeElapsed / (60000 * 24)); //1 game day = 24 real minutes
    gameTime[1] = int(timeElapsed /  60000) - (24 * gameTime[0]); //1 Game Hour = 1 minute
    
    
    //text(timeElapsed, 40, 20);
    //text("Real Time: " + realTime[0] + ": " + realTime[1], 40, 40);
    //text("Game Time: Day " + gameTime[0] + ", Hour " + gameTime[1], 40, 60);
    
    //draws the clock
    //clock center: (width -75, 75)
    //radius = 75;
    image(clockImage, width - 75, 75, 150, 150, 0, 0, );
    //draws the hour hand
    angleMode(DEGREES);
    
    //calculates the hour hand 
    hourHandAngle = 15 * (timeElapsed /  30000); //goes up by fifteen degrees every hour
    hourHandX = (width - 75) + (45 * sin(hourHandAngle));
    hourHandY =  75 - (45 * cos(hourHandAngle));
    
    //calculates the minute hand 
    minuteHandAngle = (180 * (timeElapsed /  30000));
    minuteHandX = (width - 75) + (60 * sin(minuteHandAngle));
    minuteHandY =  75 - (60 * cos(minuteHandAngle));
    angleMode(RADIANS);
    
    //draws the clock
    stroke(0);
    strokeWeight(5);
    line(width - 75, 75, hourHandX, hourHandY); //draws the hour hand 
    line(width - 75, 75, minuteHandX, minuteHandY); //draws the minute hand
    strokeWeight(1);
    
    
    
    
    
    //-----------------------------------------------------------PLAYER MOVEMENT---------------------
    //draws the character
    rectMode(CENTER);
    fill(255,0,0);
    noStroke();
    image(playerImage, playerX, playerY, 80, 80);
    stroke(0);
    
    //Player Movement
    if (timeFreeze != true && inventory != true){ //stops player from moving during time freeze
        canMoveUp = true;
        canMoveDown = true;
        canMoveLeft = true;
        canMoveRight = true;
        if (dist(playerX, playerY, centerX, centerY) >= 99){
            ifMapMove = true;
        }
        else {
            ifMapMove = false;
        }

        if (keyIsDown(87)){ //W
            //if the pixels above the player are black on the buffer, stops the player from moving
            if(buffer.get(playerX - 20, playerY - 40)[0] == 0 || buffer.get(playerX + 20, playerY - 40)[0] == 0){
                canMoveUp = false;
            }
            if (ifMapMove && canMoveUp){
                mapY += mapMove;
            }
            if(canMoveUp){
                playerY -= 5;
            }
        }
        if (keyIsDown(83)){ //S
            if(buffer.get(playerX - 20, playerY + 40)[0] == 0 || buffer.get(playerX + 20, playerY + 40)[0] == 0){
                canMoveDown = false;
            }
            if (ifMapMove && canMoveDown){
                mapY -= mapMove;
            }
            if(canMoveDown){
                playerY += 5;  
            }
        }

        if (keyIsDown(65)){ //A
            if(buffer.get(playerX - 40, playerY - 20)[0] == 0 || buffer.get(playerX - 40, playerY + 20)[0] == 0){
                canMoveLeft= false;
            }
            if (ifMapMove && canMoveLeft){
                mapX += mapMove;
            }
            
            if(canMoveLeft){
                playerX -= 5;   
            }
        }

        if (keyIsDown(68)){ //D
            if(buffer.get(playerX + 40, playerY - 20)[0] == 0 || buffer.get(playerX + 40, playerY + 20)[0] == 0){
                canMoveRight = false;
            }
            if (ifMapMove && canMoveRight){
                mapX -= mapMove;
            }
            
            if(canMoveRight){
                playerX += 5;
            }
        }
    }
    
    mapMove = dist(playerX, playerY, centerX, centerY) / 20;
    mapMove = constrain(mapMove, 0, 5);
    
    //angleMode(DEGREES);
    angle = atan(-(playerY - centerY) / (playerX - centerX));
    
    //constrains the player's character within a certain part of the screen
    if(dist(playerX, playerY, centerX, centerY) > 100){
        if (playerX >= centerX){
            playerY = centerY + (100 * sin(-angle));
            playerX = centerX + (100 * cos(angle));
        }
        if (playerX < centerX){
            playerY = centerY - (100 * sin(-angle));
            playerX = centerX - (100 * cos(angle)); 
        }
    }
    
    
    //------------------------------------------------------------FLOORS-------------------------
    //detects if the player is inside hitmap
    //if player is
    if(playerX > mapX - 40 && playerX < mapX + 80 && playerY > mapY - 530 && playerY < mapY - 400){
        //add one to floorChangeCounter
        floorChangeCounter++;
        //if floor change counter crosses threshold
        if (floorChangeCounter > 20){
            //changes the floor
            if(floor == 1){
                floor = 2;
                //floorChangeCounter = 0;
            }
            else if (floor == 2){
                floor = 1;
                //floorChangeCounter = 0;
            }
            console.log("floor: " + floor);
            floorChangeCounter = 0;
        }
    }
    //if player is not
    else{
        floorChangeCounter = 0;
    }
        //-----------------------------------------------------------ITEMS-----------------------------
    for (let i = 0; i < worldItems.length; i++){
        
        //makes sure that none of the items in the world are in the player's inventory
        if (worldItems[i].floor == floor){
            
            //checks item i against every other item
            for(let j = 0; j < worldItems.length; j++){
                
                //if they are close enough together
                if (dist(worldItems[i].positionX, worldItems[i].positionY, worldItems[j].positionX, worldItems[j].positionY) < 20 && j != i){
                    //checks to see if they craft together
                    let canCraft = false;
                    spliced = 0;
                    for (let k = 0; k < worldItems[i].craftsWith.length; k++){
                        if(worldItems[i].craftsWith[k] == worldItems[j].name){
                            canCraft = true;
                        }
                    }
                    if(canCraft){
                        //crafts the two items
                        console.log("craft");
                        craft(worldItems[i], worldItems[j]);
                    }
                    
                    else{
                    }
                    if (spliced > 1){
                        i--;
                        j++;
                    }
                }
            }
            worldItems[i].draw();
            worldItems[i].move();
        }
    }
    
    
    //draws the high level
    fill(50);
    rect(centerX, height - 25, 600, 25);
    fill(0, 255, 0);
    rect(centerX, height - 25, (600 * (highLevel / 100)), 20);
    
    //
    highLevel = (-hourHandAngle / 1.2) + (250 + highModifier);
    
    //-----------------------------------------------------------INVENTORY--------------------------
    if (inventory == true){ //draws inventory box
        //fill(150);
        imageMode(CORNERS);
        //mouseOverInventory = false;
        for (let i = 0; i < (inventorySize / 2); i++){
            for (let j = 0; j < (inventorySize / 5);  j++){
                
                //tracks mouse over inventory squares
                if (dist(handX, handY, (centerX - ((inventorySize / 5) * 80)+ (80 * i)), (centerY + (80 * j) + 40) - 80) < 40){
                    inventoryColor = 100;
                    spaceMouseOver = i + (j * 5);
                    if (clicked){//if the inventory square is clicked
                        inventoryColor = 50;
                    }
                }
                else{
                    inventoryColor = 150;
                }
                
                //draws the inventory
                stroke(0);
                fill(inventoryColor);
                textSize(12);
                rect((centerX - ((inventorySize / 5) * 80)+ (80 * i)), (centerY + (80 * j) + 40) - 80, 80, 80);
                fill(0);
                text(j + " " + i, (centerX - ((inventorySize / 5) * 80)+ (80 * i)), (centerY + (80 * j) + 40) - 80, 80, 80);
                noStroke()
                
                //draws the items in the inventory 
                if(inventoryItems[i + (j * 5)] != 0){
                    inventoryItems[i + (j * 5)].x = (centerX - ((inventorySize / 5) * 80)+ (80 * i));
                    inventoryItems[i + (j * 5)].y = (centerY + (80 * j) + 40) - 80;
                    inventoryItems[i + (j * 5)].draw(); 
                    inventoryItems[i + (j * 5)].move();  
                }
            }
        }
        stroke(0);
    }
    
    //draws the items that are in the player's hand 
    if (itemInHand[0] != 0){
        itemInHand[0].draw();
        itemInHand[0].move();
    }
    //-----------------------------------------------------------PLAYER'S HAND---------------------
    handAngle = atan2(mouseY - playerY, mouseX - playerX);
    
    if (dist(playerX, playerY, mouseX, mouseY) < handDistance || inventory){
        handX = mouseX;
        handY = mouseY;
    }
    
    else{
        
        handX = playerX + (handDistance * cos(handAngle));
        handY = playerY + (handDistance * sin(handAngle));
    }
    
    fill(handColor[0], handColor[1], handColor[2]);
    imageMode(CENTER);
    push();
    translate(handX, handY);
    rotate(handAngle + PI /2);
    image(hand, 0, 0, -30, 30);
    pop();
    
    //------------------------------------------------------------------MOM-------------------------------

    //draws Mom
    mom.draw();
    

    //draws the nodes
    for (let i = 0; i < nodeList.length; i++){
        nodeNumber = i;
        nodeList[i].draw();
    }

    
    //if (paths.length < 1){
        //path(nodeList[10], nodeList[7], paths);
    //}
    //console.log(paths);
    
    for (let i = 0; i < paths.length - 1; i++){
        stroke(1);
        if (lineOfSight(paths[i].x,paths[i].y,paths[i+1].x, paths[i+1].y)){
            line(paths[i].x, paths[i].y, paths[i+1].x, paths[i+1].y);
            stroke(0);
            textSize(12);
            //text(i, paths[i + 1].x, paths[i + 1].y + 20); //order of the path
        }
    }
    
}
    
//detects key pressed
function keyPressed(){
    if (keyCode == 73 && inventory == false){
        inventory = true;
        holdInventory = true;
        //stops the clock
        //pauseTime(new Date().getTime()); //delete this eventually <-- Syntax for pauseTime() function
    }
    else if (keyCode == 73 && inventory == true){
        inventory = false; 
        holdInventory = false
        //starts clock
        //startTime(new Date().getTime()) //delete this eventually <-- Syntax for startTime() function
    }
}

//------------------------------------------------------FUNCTIONS----------------------------------------------
let timeOfPause;
let timeFreeze = false;


function pauseTime(time){ // freezes the clock and stores the time frozen
    timeOfPause = time;
    timeFreeze = true;
}

function startTime(time){ //starts the clock and calculates how much time was paused for
    timePaused += time - timeOfPause;
    timeFreeze = false;
}
function mousePressed(){ //when the mouse is pressed
    handColor = [255, 0, 0];
    clicked = true;
    
    if(dist(mouseX, mouseY, playerX, playerY) < 40 && inventory == false){
        inventory = true;
    }
    
    if(inventory){
        if (mouseX < 400 || mouseX > 800){
            inventory = false;
        }
        if (mouseY < 300 || mouseY > 460){
            inventory = false;
        }
    }
    
    hand = handImageClosed;
    //console.log(buffer.get(mouseX, mouseY));
    //firstFloorImage = firstFloorBuffer;
    
    
    /*
    //paths test
    if (paths.length == 0){
        path(nodeList[10], nodeList[7], paths);
        path(nodeList[7], nodeList[0], paths);
    }
    */
    
    //mom.move(10,12);
}

function mouseReleased(){ //when the mouse is released 
    handColor = [0, 255, 0];
    clicked = false;
    
    //clears the hand if released outside of the inventory area
    if(inventory){
        if (mouseX < 400 || mouseX > 800){
            
            if (itemInHand != 0){
                worldItems.push(itemInHand[0]);
            }
            itemInHand[0] = 0;
            
        }
        if (mouseY < 300 || mouseY > 460){
            if (itemInHand != 0){
                worldItems.push(itemInHand[0]);
            }
            itemInHand[0] = 0;
        }
    }
    
    hand = handImageOpen;
    
    //firstFloorImage = loadImage("Assets/first_floor.png");
}

function setStartTime(){//sets the start time
    start = new Date().getTime();
}

//function smoke
function smoke(x, y, frameCount){
    //fill(150, 150, 150, 50);
    //circle(x + v, y + frameCount, frameCount);
    //smokeArray.push([x, y + frameCount, frameCount]);
    
    fill(150, 150, 150, -frameCount + 150);
    circle(x, y, frameCount * 2);
    
    //frameCount ++;
    //noiseLocation += 0.01;

    //line(x, y, x+v, y+frameCount);
}




//--------------------------------------------------------CRAFTING -------------------------------------------
let recipes = [
    //format:
    //item1, item2, item created, item created name, item destroyed in creation, item destroyed in creation, image, size
    ['apple', 'knife', AppleWithHole, 'apple with hole', 'apple', null, 0, 30], //Apple with hole
    ['apple with hole', 'weed', ApplePipe, 'apple pipe', 'apple with hole', 'weed', 0, 30], //Apple Pipe Recipe
    ['apple with hole', 'weed', Baggy, 'baggy', null, null, 0, 45], //plastic bag created when weed used in 
    ['water bottle', 'pen', EmptyWaterBottleBong, 'empty water bottle bong', 'water bottle', 'pen', 0, 45], 
    ['weed', 'empty water bottle bong', WaterBottleBong, 'water bottle bong', 'empty water bottle bong', 'weed', 0, 45]
]

function craft(item1, item2){
    //finds the right combination
    for (let i = 0; i < recipes.length; i++){
        console.log(item1.name);
        console.log(item2.name);
        //makes sure which recipe to use
        if(item1.name == recipes[i][0] || item1.name == recipes[i][1]){
            if(item2.name == recipes[i][0] || item2.name == recipes[i][1]){
                
                //console.log("You created an " + recipes[i][3] + " with " + item1.name + " " + item2.name);

                //deletes any consumable items from the game 
                
                //creates the new item 
                worldItems.push(new recipes[i][2](item1.positionX + 40, item1.positionY, recipes[i][3], recipes[i][7], recipes[i][6], floor));
                
                //finds which items are consumed (if any) and deletes them
                if(item1.name == recipes[i][4] || item1.name == recipes[i][5]){
                    let worldIndex = worldItems.indexOf(item1);
                    worldItems.splice(worldIndex, 1);
                    spliced++;
                }
                
                if(item2.name == recipes[i][4] || item2.name == recipes[i][5]){
                    let worldIndex = worldItems.indexOf(item2);
                    worldItems.splice(worldIndex, 1);
                    spliced++;
                }
            }
        }
    }
}