export default class Enemy{
    lifetime = 0;
    constructor(xpos, ypos, height, width, moveShape){

        this.baseX = xpos;
        this.baseY = ypos;
        this.moveShape = moveShape;
        this.postionX = xpos;
        this.postionY = ypos;
        this.height = height;
        this.width = width;
        this.color = "rgb(200,200,0)";

        this.bullets = [];
    }
    //TODO: 
    spawnBullet(){
        this.bullets.push(New EnemyBullet)
    }

    move(){
        switch(this.moveShape){
            case "circle": this.circleMove(); break;
        }
    }

    circleMove(){
        if(this.lifetime > 200){
            this.lifetime = 0;
        }
        this.positionX = this.baseX + 50 * Math.cos(this.lifetime/10);
        this.positionY = this.baseY + 50 * Math.sin(this.lifetime/10);  
    }









    setPosition(x, y){
        this.baseX = x;
        this.baseY = y;
    }

    getCenterX(){
        return (this.positionX + 0.5 * this.width);
    }

    getCenterY(){
        return (this.positionY + 0.5 * this.height); 
    }

    getColor(){
        return this.color;
    }

    getX(){
        return this.positionX;
    }
    getY(){
        return this.positionY;
    }
    getBaseX(){
        return this.baseX;
    }
    getBaseY(){
        return this.baseY;
    }
    getHeight(){
        return this.height;
    }
    getWidth(){
        return this.width;
    }
}