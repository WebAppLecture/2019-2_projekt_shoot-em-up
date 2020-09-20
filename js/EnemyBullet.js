export default class EnemyBullet{
    constructor(positionX, positionY, height, width, color, speed, directionX, directionY, type){
        
        this.positionX = positionX;
        this.positionY = positionY;
        this.height = height;
        this.width = width;
        this.color = color;
        this.speed = speed;
        this.directionX = directionX;
        this.directionY = directionY;

        
        this.lifetime = 0;
        this.type = type;
        
        switch(this.type){
            case "Laser": this.bulletDamage = 5; break;
            case "Shotgun": this.bulletDamage = 1; break;
            case "Energy": this.bulletDamage = 1; break;
        }
    }

    move(){
        this.lifetime ++;
        switch(this.type){
            case "Laser": this.speed = this.speed; break;
            case "Shotgun": this.speed -=Math.random() / 2; break;
        }
        this.positionX = this.positionX + this.speed * this.directionX;
        this.positionY = this.positionY + this.speed * this.directionY;
    }
    getCenterX(){
        return (this.positionX + 0.5 * this.width);
    }

    getCenterY(){
        return (this.positionY + 0.5 * this.height); 
    }
}