export default class Background{
    constructor(numStars){
        this.stars = [];
        this.spawnStars();
    }

    moveStars(){
        for(let i = 0; i < 30; i++){
            if(this.stars[i].positionX <-20){
                this.stars[i].positionX = 1050;
            }
            this.stars[i].positionX -= 1;
            /*
            if(Math.random() < 0.5){
                
                if(this.stars[i].canMove == true){
                    //console.log("can move!");
                    this.stars[i].canMove = false;
                }else{
                    this.stars[i].canMove = true;
                    console.log("can move!");
                }
            }
            
            
            if(this.stars[i].canmove == true){
                this.stars[i].positionX -= 1;
                console.log("changed pos");

            }
            */
            
        }
    }

    spawnStars(){
        for(let i = 0; i < 30; i++){
            this.stars.push(new Star(1050, Math.floor(Math.random() * 550)+20, 20, 20, true));
        }
    }
}


class Star{
    constructor(posX, posY, width, height, canMove){
        this.canMove = canMove;
        this.positionX = posX;
        this.positionY = posY;
        this.width = width;
        this.height = height;
    }
}