import Enemy from "./enemy.js";
import EnemyBullet from "./EnemyBullet.js";

export default class ProjectileGenerator{
    constructor(){
        this.enemies = [];
        this.bullets = [];
        this.upgrades = [];
        this.lifetime = 0;
        //this.spawnWaveOne();
        //this.spawnWaveTwo();
        //this.spawnWaveThree();
        //this.spawnWaveFour();
        //this.spawnWaveFive();
        this.trySpawn();
        this.haveWavesSpawned = [false, false, false, false, false];
        //this.haveWavesSpawned = [true, true, true, true, true];


        this.haveBossWavesSpawned = [false, false, false, false, false];
        this.spawnWall();
    }

    spawnWall(){
        if(this.lifetime > 2000){
            if(this.lifetime%60 == 0 && this.lifetime < 2600 && !this.haveBossWavesSpawned[this.lifetime/60-1]){
                this.haveBossWavesSpawned[this.lifetime/60-1] = true;
                this.SuiciderWall();
            }
        }
    }

    SuiciderWall(){
        for(let i = 0; i < 6; i++){
            this.enemies.push(new Enemy(1100,i * 50, 15, "Zigzag", "Suicider", 200, "red"));
            this.enemies.push(new Enemy(1200,(i * 50)+100, 15, "Zigzag", "Suicider", 200, "red"));

        }
    }

    spawnWaveOne(){
        for(let i = 0; i < 5; i++){
            this.enemies.push(new Enemy(1100,200 + i * 60, 3, "Circle", "Energy", 200, "red"));
        }
    }
    
    spawnWaveTwo(){
        for(let i = 0; i < 5; i++){
            this.enemies.push(new Enemy(1100, 200 + i * 40, 10, "Snake","Laser", 50, "yellow"));
        }
    }

    spawnWaveThree(){
        for(let i = 0; i < 3; i++){
            this.enemies.push(new Enemy(1100,200 + i * 80, 10, "Jellyfish","Splitter", 50, "orange"));
        }
    }

    spawnWaveFour(){
        for(let i = 0; i < 1; i++){
            this.enemies.push(new Enemy(1100,200 + i * 80, 10, "Circle","Spawner", 150, "green"));
        }
    }
    
    spawnWaveFive(){
        for(let i = 0; i < 1; i++){
            this.enemies.push(new Enemy(1100,200 + i * 80, 10, "Jellyfish","Suicider", 100, "red"));
        }
    }

    onSplitterDestroyed(posX, posY){
        this.enemies.push(new Enemy(posX, posY, 5, "Circle","Shotgun", 200, "red"));
        this.enemies.push(new Enemy(posX + 40, posY, 5, "Circle","Shotgun", 200, "red"));
        this.enemies.push(new Enemy(posX+ 40,posY+ 40,5, "Circle","Shotgun", 200, "red"));
        this.enemies.push(new Enemy(posX,posY+ 40,5, "Circle","Shotgun", 200, "red"));
    }
    onSuiciderDestroyed(posX, posY){
        for(let i = 0; i < 75; i++){
            let newBullet = new EnemyBullet(posX, posY, 5,5, "red", Math.floor(Math.random() * 10)+ 6, -1, Math.random() -0.5, "Laser");
            this.bullets.push(newBullet);
        }
    }

    update(){
        this.lifetime ++;
        this.trySpawn();
        this.spawnWall();
        for(let i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].tryShoot()){
                //console.log(""+this.enemies.length);
                switch(this.enemies[i].ammo){
                    case "Laser": this.shootLaser(this.enemies[i]); break;
                    case "Shotgun": this.shootShotgun(this.enemies[i]); break;
                    case "Spawner": this.summonEnemy(this.enemies[i]); break;
                    case "Energy": this.shootEnergy(this.enemies[i]); break;
                }
                //this.bullets.push((new EnemyBullet(this.enemies[i].getCenterX(), this.enemies[i].getCenterY(), 10, 10, "red", 2, -1, 0, "Laser")));
            }
        }
    }

    tryGeneratePickup(enemytype, posX, posY){
        
        if(enemytype == "Suicider"){
            this.upgrades.push(new Upgrade(posX, posY, "Damage", 1));
            console.log("generated pickup" + posX + " "+posY);
        }else{
            if(Math.random() < 0.3){
                this.upgrades.push(new Upgrade(posX, posY, "Health", 5));
            }
            if(Math.random() < 0.3){
                this.upgrades.push(new Upgrade(posX, posY, "Damage", 1));
            }
        }
    }


    trySpawn(){
        if(this.lifetime > 250 && !this.haveWavesSpawned[0]){
            this.haveWavesSpawned[0] = true;
            this.spawnWaveOne();
        }else if (this.lifetime > 250 && !this.haveWavesSpawned[1]){
            this.haveWavesSpawned[1] = true;
            this.spawnWaveTwo();
        }
        else if (this.lifetime > 1000 && !this.haveWavesSpawned[2]){
            this.haveWavesSpawned[2] = true;
            this.spawnWaveThree();
        }
        else if (this.lifetime > 1500 && !this.haveWavesSpawned[3]){
            this.haveWavesSpawned[3] = true;
            this.spawnWaveFour();
        }
        else if (this.lifetime > 1250 && !this.haveWavesSpawned[4]){
            this.haveWavesSpawned[4] = true;
            this.spawnWaveFive();
        }
        else if (this.lifetime == 3000){
            window.location.href = "gameover.html"
        }
    }

    shootShotgun(enemy){
        for(let i = 0; i < 5; i++){
            let newBullet = new EnemyBullet(enemy.getCenterX(), enemy.getCenterY(), 5,5, "red", Math.floor(Math.random() * 10)+ 6, -1, Math.random() -0.5, "Shotgun");
            this.bullets.push(newBullet);
        }
    }
    shootLaser(enemy){
        this.bullets.push((new EnemyBullet(enemy.getCenterX(), enemy.getCenterY(), 10, 10, "red", 7, -1, 0, "Laser")));
    }

    summonEnemy(enemy){
        this.enemies.push(new Enemy(enemy.getCenterX()- 50 ,enemy.getCenterY(),1, "Zigzag","Shotgun", 50, "red"));
    }

    shootEnergy(enemy){
        this.bullets.push((new EnemyBullet(enemy.getCenterX(), enemy.getCenterY(), 10, 10, "yellow", 7, -1, 0, "Energy")));
    }

    removeBullet(index){
        this.bullets.splice(index,1);
    }

    moveBullets(){
        for(let j = 0; j < this.bullets.length;j++){
            this.bullets[j].move();
            if(this.bullets[j].speed <= 0){
                this.removeBullet(j);
            }
        }
    }

    moveEnemies(){
        for(let j = 0; j < this.enemies.length;j++){
            if(this.enemies[j].positionX + this.enemies[j].width <= 0){
                this.removeEnemy(j);
            }else{
                this.enemies[j].move();
            }
        }
    }

    moveEnemy(projObj, x, y){
        projObj.setPosition(projObj.getX() + x,projObj.getY() + y);
    }

    removeEnemy(index){
        this.enemies.splice(index, 1);
    }

    removeUpgrade(index){
        this.upgrades.splice(index, 1);
    }
}

class Upgrade{
        constructor(posX, posY, type, amount){
            this.width = 18;
            this.height = 18;
            this.positionX = posX;
            this.positionY = posY;
            this.type = type;
            this.amount = amount;
            if(this.type == "Health"){
                this.color = "rgb(100, 240, 120)";
            }else{
                this.color = "brown"
            }
        }

        getCenterX(){
            return (this.positionX + 0.5 * this.width);
        }
    
        getCenterY(){
            return (this.positionY + 0.5 * this.height); 
        }
}
