class Mom{
    constructor(node){
        this.x = 0;
        this.y = 0;
        this.speed = 5;
        this.positionX = node.positionX;
        this.positionY = node.positionY;
        this.floor = node.floor;
        this.moving = false;
        this.angle;
        this.destinationNode;
        this.movementStep;
    }
    draw = function(){
        this.x = this.positionX + mapX;
        this.y = this.positionY + mapY;
            
        if (floor == this.floor){
            fill(0);
            rect(this.x, this.y, 30, 30);    
        }
        
        if(this.moving == true){
            this.positionX += this.speed * cos(this.angle);
            this.positionY += this.speed * sin(this.angle);
            
            
            if(dist(this.positionX, this.positionY, paths[this.movementStep].positionX, paths[this.movementStep].positionY) < 10){
                this.positionX = paths[this.movementStep].positionX;
                this.positionY = paths[this.movementStep].positionY;
                //if this is the final node
                if (paths[this.movementStep] == this.destinationNode){
                    this.moving = false;
                }
                //if it is not
                else{
                    //adds one to movementStep
                    this.movementStep--;
                    //finds angle to the next one
                    this.angle = mommyMovement(paths[this.movementStep+1], paths[this.movementStep]);
                }
            }
        }
    }
        
    move = function(i1,i2){
        //finds the path from the current node to the destination node
        this.destinationNode = nodeList[i2];
        paths = [];
        path(nodeList[i1], nodeList[i2], paths);
        if(paths.length > 2){
            paths.pop();
        }
        else if (paths.length == 2){
            //flips it around
            let temp = paths[1];
            paths[1] = paths[0];
            paths[0] = temp;
            console.log(paths);
        }
        this.moving = true;
        this.movementStep = paths.length - 1;
        this.angle = mommyMovement(paths[this.movementStep], paths[this.movementStep - 1]);
    }
}

function mommyMovement(currentNode, nextNode){
    return atan2(nextNode.positionY - currentNode.positionY, nextNode.positionX - currentNode.positionX);
}

class Node{
    constructor(theFloor, x, y){
        this.floor = theFloor;
        this.positionX = x;
        this.positionY = y;
        this.x = 0;
        this.y = 0;
    }
    
    draw = function(){
        this.x = mapX + this.positionX;
        this.y = mapY + this.positionY;
        if (floor == this.floor){
            noStroke();
            fill(255,0,0);
            rect(this.x, this.y, 10, 10);
            text(nodeNumber, this.x + 20, this.y);
            stroke(1);
        }
    }
}

class DoorNode extends Node{
    constructor(theFloor, x, y){
    super(theFloor, x, y);
        this.draw = function(){
            this.x = mapX + this.positionX;
            this.y = mapY + this.positionY;
            if (floor == this.floor){
                noStroke();
                fill(255,0,0);
                rect(this.x, this.y, 10, 10);
                stroke(0);
                noFill();
                circle(this.x, this.y, 30);
                text(nodeNumber, this.x + 20, this.y);
            }
        }
    }
}

function path(node1, node2, pathList){
    if(lineOfSight(node1.x, node1.y, node2.x, node2.y)){
        pathList.push(node1);
        pathList.push(node2);
        //console.log("returned");
        return;
    }
    else{
        //finds the closest node to node1 with line of sight to node2
        closestNodeWSight = new Node (1, 1000, 1000);
        for (let i = 0; i < nodeList.length; i++){
            if (nodeList[i] != node1){
                if (dist(node1.x, node1.y, nodeList[i].x, nodeList[i].y) < dist(node1.x, node1.y, closestNodeWSight.x, closestNodeWSight.y) &&  lineOfSight(nodeList[i].x, nodeList[i].y, node2.x, node2.y)){
                    closestNodeWSight = nodeList[i];
                }
            }
        }
        //console.log(pathList1);
        pathList.push(node2, closestNodeWSight);
        path(node1, closestNodeWSight, pathList);
        //console.log(pathList1);
    }
}

//checks whether or not two nodes have a clear path between them
function lineOfSight(x1,y1,x2, y2){
    //angleMode(DEGREES);
    x = x1;
    y = y1;
    nodeAngle = atan2(y2 - y1, x2 - x1);
    //console.log(nodeAngle);
    
    //iterates along each pixel between node1 and node2
    for (let i = 0; i < dist(x1, y1, x2, y2); i++){
        //checks against the buffer to see whether that pixel is white or black
        x += cos(nodeAngle);
        y += sin(nodeAngle);
        if (buffer.get(x, y)[0] == 0){
            return false;
            break;
        }
    }
    return true;
    
}