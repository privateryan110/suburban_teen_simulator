//objects for the Suburban Teen Simulator
class Item{
    constructor(positionX, positionY, name, size, picture, floor){
        this.x = 0;
        this.y = 0;
        
        this.positionX = positionX;
        this.positionY = positionY;
        this.name = name;
        this.size = size;
        this.picture = picture;
        this.floor = floor;
        
        this.counter = 0;
        this.overlaySize = 15;
        this.overlayColor = [200,200,200];
        
        this.displayName = false;
        this.inInventory = false;
        this.currentInventory;
        
        this.craftsWith = [];
    }
    draw = function (){
        
        if(this.inInventory == false){
            this.x = mapX + this.positionX;
            this.y = mapY + this.positionY;
        }
        
        //draws the light box around the item when the mouse is close
        if (dist(handX, handY, this.x, this.y) < this.size){
            fill(this.overlayColor[0], this.overlayColor[1],this.overlayColor[2], 50);
            noStroke();
            rect(this.x, this.y, this.size + this.overlaySize, this.size + this.overlaySize);
            if(this.inInventory == false){
                fill(0);
                textSize(20);
                text(this.name, this.x + this.size, this.y);
                textSize(12);
            }
        }
        
        //draws the item
        imageMode(CENTER);
        image(this.picture, this.x, this.y);
        this.picture.resize(this.size, this.size);
    }
    
    move = function(){
        
        //if there isn't an item in hand and this item is clicked on
        if (clicked && (itemInHand[0] == this || itemInHand[0] == 0) && (dist(handX, handY, this.x, this.y) < (this.size + 15) / 2) && this.inInventory == false){
            
            //console.log(1);
            
            //removes the item from the world list 
            let worldIndex = worldItems.indexOf(this);
            
            if(itemInHand[0] != this){
                itemInHand[0] = this;
                worldItems.splice(worldIndex, 1);
                //console.log("Is this it too");
                //console.log(this.positionX, this.positionY);
            }
            
            
            this.positionX = handX - mapX; //hand drags this item
            this.positionY = handY - mapY; 
                
            //opens inventory if dragged over player for 15 frames
            if(dist(this.x, this.y, playerX, playerY) < this.size){
                this.overlaySize = 25;
                this.overlayColor = [0, 255, 0];
                this.counter++;
                if(this.counter > 15){
                    inventory = true;
                }
            }
                
            else{
                this.overlaySize = 15;
                this.overlayColor = [200,200,200];
                this.counter = 0;
            }
        }
        
        //if item is let go
        else if (clicked == false && this.inInventory == false){
            //console.log(2);
            this.overlaySize = 15;
            this.overlayColor = [200,200,200];
            //if it is let go in the inventory
            if (inventory){
                //checks which square it is over
                for (let i = 0; i < (inventorySize / 2); i++){
                    for (let j = 0; j < (inventorySize / 5);  j++){
                        //tracks mouse over inventory squares
                        if (this == itemInHand[0] && dist(this.x, this.y, (centerX - ((inventorySize / 5) * 80)+ (80 * i)), (centerY + (80 * j) + 40) - 80) < 40){
                                //if the inventory space is open
                                if(inventoryItems[spaceMouseOver] == 0){ //if square is empty
                                   inventoryItems[spaceMouseOver] = this; //places item in inventory
                                    this.currentInventory = i + (5*j);
                                    this.inInventory = true; 
                                }
                            
                                //if the inventory space is already taken
                                else if (inventoryItems[spaceMouseOver] != 0){
                                    //finds empty inventory space and puts the item in it
                                    for (let k = 0; k < inventoryItems.length; k++){
                                        if (inventoryItems[k] == 0){
                                            this.currentInventory = k;
                                            this.inInventory = true;
                                            inventoryItems[k] = this;
                                            break;
                                        }
                                    }
                                }
                                itemInHand[0] = 0; //need to have this changed later
                                //what happens if the inventory is full????
                        }
                    }
                }
            }
        }
        
        //if clicked when no item in hand while inside the inventory
        if (clicked && itemInHand[0] == 0 && this.inInventory && inventory && spaceMouseOver == this.currentInventory){
            //console.log(4);
            inventoryItems[this.currentInventory] = 0;
            itemInHand[0] = this;
            this.positionX = handX - mapX;
            this.positionY = handY - mapY;
            //worldItems.push(this);
            this.floor = floor;
            this.inInventory = false;
            //console.log("Is this it");
        }
        
        if(clicked == false && itemInHand[0] == this){
            //console.log(5);
            this.floor = floor;
            worldItems.push(this);
            itemInHand[0] = 0;
            this.inInventory = false;
        }
        
        if(inventory && clicked == false && this.inInventory == false && itemInHand[0] == this){
            //console.log(6);
            console.log(this.name + "gottem");
        }
        
        
        //triggers the item's use function when shift is held
        if(keyIsDown(16) && itemInHand[0] == this){
            this.use();
        }
    }
    
    use = function(){
        //to be overridden by actual use functions
    }
}

//-------------------------------------------------------------ITEMS-------------------------------------------------
class Weed extends Item{
    constructor(positionX, positionY, name, size, picture, thefloor){
        super(positionX, positionY, name, size, picture, thefloor);
        this.craftsWith = ['apple pipe'];
    }
}

class Apple extends Item{
    constructor(positionX, positionY, name, size, picture, thefloor){
        super(positionX, positionY, name, size, picture, thefloor);
        this.craftsWith = ['knife'];
        this.consumable = true;
    }
}

class Knife extends Item{
    constructor(positionX, positionY, name, size, picture, thefloor){
        super(positionX, positionY, name, size, picture, thefloor);
        this.craftsWith = ['apple'];
    }
}

class AppleWithHole extends Item{
    constructor (positionX, positionY, name, size, picture, thefloor){
        super(positionX, positionY, name, size, picture, thefloor);
        this.craftsWith = ['weed'];
    }
}

class Baggy extends Item{
    constructor (positionX, positionY, name, size, picture, thefloor){
        super(positionX, positionY, name, size, picture, thefloor);
        this.craftsWith = [];
    }
}

class ApplePipe extends Item{
    constructor (positionX, positionY, name, size, picture, thefloor){
        super(positionX, positionY, name, size, picture, thefloor);
        this.craftsWith = [];
        this.use = function(){
            //freezes the time 
            if (dist(this.x, this.y, playerX, playerY + 30) < 40){
                if (frameCount == 0){
                    pauseTime(new Date().getTime());
                    frameCount ++;
                }
                //play sound
                //create smoke
                frameCount++;
                if(frameCount > 120 && frameCount < 360){
                    smoke(this.x, this.y, frameCount - 120);
                    frameCount++;
                }
                if (frameCount == 360){
                    startTime(new Date().getTime());
                    frameCount = 0;
                    highModifier +=  25;
                    //gets rid of the apple pipe 
                    itemInHand[0] = 0;
                    this.inInventory = false;  
                    //creates new apple with a hole in it
                    worldItems.push(new AppleWithHole(this.positionX, this.positionY, 'apple with hole', 30, recipes[0][6], floor));
                    //smokeArray = [];
                    if(floor == 1){
                        floor1Smell += 2;
                    }
                    else if(floor == 2){
                        floor2Smell += 2;
                    }
                }
            }
            
        }
    }
}

class Febreeze extends Item{
    constructor (positionX, positionY, name, size, picture, thefloor){
        super(positionX, positionY, name, size, picture, thefloor);
        this.craftsWith = [];
        this.use = function(){
            //plays the animation 
            frameCount++;
            //draws the spray
            if (frameCount < 120){
                fill(150, 20);
                smokeArray.push([this.x, this.y, 20]);
                for (let i = 0; i < smokeArray.length; i++){
                    circle(smokeArray[i][0], smokeArray[i][1] - 23, smokeArray[i][2]);
                    smokeArray[i][2]++;
                }
            }
            
            //ends the animation and reduces the smell by half
            if(frameCount == 120){
                frameCount = 0;
                smokeArray = [];
                
                if (floor == 1){
                    floor1Smell  = floor1Smell / 2;
                }
                else if (floor == 2){
                    floor2Smell  = floor2Smell / 2;
                }
                //creates a new used frabreeze object. 
                itemInHand[0] = 0;
                this.inInventory = false;
                worldItems.push(new UsedFrebreeze(this.positionX, this.positionY, 'Used Febreeze', 45 , febreezeImage, floor));
            }
        }
    }
}
                                
class UsedFrebreeze extends Item{
    constructor (positionX, positionY, name, size, picture, floor){
        super(positionX, positionY, name, size, picture, floor);
        this. craftstWith = [];
    }
}

class Pen extends Item{
    constructor(positionX, positionY, name, size, picture, thefloor){
        super(positionX, positionY, name, size, picture, thefloor);
        this.craftsWith = ['water bottle'];
    }
}

class WaterBottle extends Item{
    constructor(positionX, positionY, name, size, picture, thefloor){
        super(positionX, positionY, name, size, picture, thefloor);
        this.craftsWith = ['pen'];  
    }
}

class EmptyWaterBottleBong extends Item{
    constructor(positionX, positionY, name, size, picture, thefloor){
        super(positionX, positionY, name, size, picture, thefloor);
        this.craftsWith = ['weed'];
    }
}

class WaterBottleBong extends Item{
    constructor(positionX, positionY, name, size, picture, thefloor){
        super(positionX, positionY, name, size, picture, thefloor);
        this.craftsWith = ['pen']; 
        this.use = function(){
            //freezes the time 
            if (dist(this.x, this.y, playerX, playerY + 30) < 40){
                if (frameCount == 0){
                    pauseTime(new Date().getTime());
                    frameCount ++;
                }
                //play sound
                //create smoke
                frameCount++;
                if(frameCount > 120 && frameCount < 360){
                    smoke(this.x, this.y, frameCount - 120);
                    frameCount++;
                }
                if (frameCount == 360){
                    startTime(new Date().getTime());
                    frameCount = 0;
                    highModifier +=  50;
                    //gets rid of the apple pipe 
                    itemInHand[0] = 0;
                    this.inInventory = false;  
                    //creates new apple with a hole in it
                    worldItems.push(new EmptyWaterBottleBong(this.positionX, this.positionY, 'empty water bottle bong', 45, recipes[3][6], floor));
                    if(floor == 1){
                        floor1Smell += 4;
                    }
                    else if(floor == 2){
                        floor2Smell += 4;
                    }
                }
            } 
        }
    }
}
                                
                    



