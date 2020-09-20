export default class Enemy{
    constructor(xpos, ypos, health, movetype, enemyType, shootspeed, color){
        
        switch(enemyType){
            case "Laser": this.width = 50; this.height = 50; this.ammo = "Laser"; break;
            case "Shotgun": this.width = 30; this.height = 30; this.ammo = "Shotgun"; break;
            case "Splitter": this.width = 70; this.height = 70; this.ammo = "Laser"; break;
            case "Spawner": this.width = 20; this.height = 20; this.ammo = "Spawner"; break;
            case "Suicider": this.width = 100; this.height = 100; this.color = "red"; break;
            case "Energy": this.width = 50; this.height = 50; this.ammo = "Energy"; this.color = "yellow"; break;
        }
        
        this.lifetime = 0;
        this.baseX = xpos;
        this.baseY = ypos;
        this.type = enemyType;
        this.color = color;
        this.positionX = xpos;
        this.positionY = ypos;
        this.movetype = movetype;
        this.health = health;
        this.shootspeed = shootspeed;

        this.zigzagMovementSwitch=0;
        this.zigzagLockXMovement=false;
        this.lockJellyMovement=false;
        this.zigzagLifeTime=0;
        this.lockSnakeMovement=false;
        this.snakeMovementSwitchY=0;
    }
    

    tryShoot(){
        if(this.lifetime%this.shootspeed == 0){
            return true;  //tells generator to spawn projectile
        }else{
            return false;
        }
    }

    move(){
        switch(this.movetype){
            case "Circle": this.circleMove(); break;
            case "Zigzag": this.zigzagMove(); break;
            case "Jellyfish": this.jellyfishMove(); break;
            case "Snake": this.snakeMove(); break;
        }
    }

    circleMove(){
        
        this.positionX = (this.baseX + 50 * Math.cos(this.lifetime/10))-this.lifetime;
        this.positionY = this.baseY + 50 * Math.sin(this.lifetime/10);
    }

    zigzagMove(){
 
        this.positionX = this.baseX -3*this.lifetime;

        if(this.lifetime%65==0){
            this.zigzagMovementSwitch = 0;
        }
        if(this.lifetime%65==15){
            this.zigzagMovementSwitch = 2;
        }
        if(this.lifetime%65==35){
            this.zigzagMovementSwitch = 1;
        }
        if(this.lifetime%65==50){
            this.zigzagMovementSwitch = 2;
        }
        if(this.zigzagMovementSwitch == 0){
            this.positionY = this.positionY+10;
            this.zigzagLockXMovement = false;
        }
        if(this.zigzagMovementSwitch == 1){
            this.positionY = this.positionY-10;
            this.zigzagLockXMovement = false;
        }
        if(this.zigzagMovementSwitch==2){
            this.positionY = this.positionY;
            this.zigzagLockXMovement = true;
        }
        
    }

    jellyfishMove(){

        if(this.lockJellyMovement==false){
            this.positionX = 1100;
            this.positionY = this.baseY;
            this.lockJellyMovement = true;
        }      
        this.positionX = (this.positionX-1) - Math.sin(this.lifetime/25);
        this.positionY = this.positionY - Math.cos(this.lifetime/10);
    }

    snakeMove(){
        
        if(this.lockSnakeMovement==false){
            this.positionX = this.baseX+this.width;
            this.positionY = this.baseY;
            this.lockSnakeMovement = true;
        }
        if(this.positionY == 0){
            this.positionX = this.positionX-30-this.width;
            this.snakeMovementSwitchY = 1;
        }
        if(this.positionY == 600-this.width){
            this.positionX = this.positionX-30-this.width;
            this.snakeMovementSwitchY = 0;
        }


        if(this.snakeMovementSwitchY == 0){
            this.positionY = this.positionY-5;
        }
        if(this.snakeMovementSwitchY == 1){
            this.positionY = this.positionY+5;
        }

    }

    lineMove(){
        this.positionX = this.positionX - 1;
    }

    getCenterX(){
        return (this.positionX + 0.5 * this.width);
    }

    getCenterY(){
        return (this.positionY + 0.5 * this.height); 
    }
}