export default class Bullet{
    speed = 10;
    constructor(spawnX, spawnY, height, width, damage){
        this.positionX = spawnX;
        this.positionY = spawnY;
        this.height = height;
        this.width = width;
        this.damage = damage;
    }

    move(){
        this.positionX += this.speed;
    }
    


    getX(){
        return this.positionX;
    }
    getY(){
        return this.positionY;
    }
    getHeight(){
        return this.height;
    }
    getWidth(){
        return this.width;
    }
    getCenterX(){
        return (this.positionX + 0.5 * 30);
    }

    getCenterY(){
        return (this.positionY + 0.5 * 30); 
    }

}