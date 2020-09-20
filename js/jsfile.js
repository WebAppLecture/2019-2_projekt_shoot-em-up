
import Player from "./player.js";
import ProjectileGenerator from "./ProjectileGenerator.js";
import Background from "./background.js";


export default class Jsfile{
    constructor(){
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");  //returns canvasrendering context

        this.overallLifetime = 0;
        this.player = new Player();
        this.generator = new ProjectileGenerator();
        //this.background = new Background();
        this.update();
    }

    update(){
        this.clearRect();
        //this.drawBackground();
        this.overallLifetime +=1;
        this.checkPlayerCollisions();
        this.checkProjectileCollisions();

        this.player.update(); //only for specials;
        this.moveAndDrawPlayer();
        this.moveAndDrawPlayerBullets();
        this.checkBulletOutOfBounds();

        this.moveEnemiesAndBullets();
        this.drawEnemies();
        this.ctx.clearRect(0,600, this.canvas.width, 100);
        this.drawBottomBorder();
        this.drawHealthBar();
        this.drawEnergyBar();
        this.currentlyDamaged=false;



        this.drawEnemyProjectilesAndUpgrades();
        
        if(this.player.health <= 0){
            console.log("GAME OVER");
        }
        requestAnimationFrame(this.update.bind(this));
    }

    moveAndDrawPlayer(){
        this.player.move();
        this.ctx.fillStyle = this.player.currentColor;
        this.ctx.fillRect(this.player.positionX, this.player.positionY, 30, 30);
    }

    moveEnemiesAndBullets(){
        this.generator.update();
        this.generator.moveEnemies();
        this.generator.moveBullets();
        let enemies = this.generator.enemies;

        for(let i = 0; i < enemies.length; i++){
            enemies[i].lifetime += 1;
        }
    }

    moveAndDrawPlayerBullets(){
        let bullets = this.player.getBullets();
        for(let i = 0; i < this.player.bullets.length; i++){
            bullets[i].move();
            this.ctx.fillStyle = 'rgba(0, 0, 200, 1)';
            this.ctx.fillRect(bullets[i].positionX, bullets[i].positionY, bullets[i].height, bullets[i].width);
        }
    }

    checkPlayerCollisions(){
        //this.currentlyDamaged=false;
        let enemies = this.generator.enemies;
        for(let i = 0; i < enemies.length; i++){
            if(this.checkCollision(this.player, enemies[i])){
                if(enemies[i].type = "Suicider"){
                    this.handleDamage(2.5); 
                }else{
                    this.handleDamage(0.5); 
                }
                this.currentlyDamaged=true;
                this.player.currentColor = this.player.damagedColor;
            }
        }

        let enemyBullets = this.generator.bullets;
        for(let i = 0; i < enemyBullets.length; i++){
            if(this.checkCollision(this.player, enemyBullets[i])){
                if(enemyBullets[i].type == "Energy"){
                    this.generator.removeBullet(i);
                    this.player.playerEnergy -= enemyBullets[i].bulletDamage;
                }else{
                    if(!(this.player.powerupMode=="shield")){
                        this.handleDamage(enemyBullets[i].bulletDamage);
                    }
                    this.generator.removeBullet(i);
                    this.currentlyDamaged=true;
                    this.player.currentColor=this.player.damagedColor;
                }
            }
        }

        let upgrades = this.generator.upgrades;
        for(let i = 0; i < upgrades.length; i++){
            if(this.checkCollision(this.player, upgrades[i])){
                switch(upgrades[i].type){
                    case "Damage": this.player.mainDamage += upgrades[i].amount; break;
                    case "Health": this.handleDamage(upgrades[i].amount * -1); break;
                }
                this.generator.removeUpgrade(i);
            }
        }

        //if didnt got hit this frame
        if(this.currentlyDamaged == false) {
            if(this.player.powerupMode != "shield"){
                this.player.currentColor=this.player.mainColor;
            }else{
            this.player.currentColor = this.player.shieldColor;
            }
        }else{
            this.player.currentColor = this.player.damagedColor;
        }
    }
    drawHealthBar(){
        for(let i=0; i<=this.player.playerHealth; i++){
            this.ctx.fillStyle = 'rgb(100, 240, 120)';
            this.ctx.fillRect(15+([i]*25), 655, 20, 40);
        }
    }

    drawEnergyBar(){
        for(let i=0; i<=this.player.playerEnergy; i++){
            if(this.player.powerupMode=="shield" || this.player.lifetime - this.player.lastShieldFrame < this.player.shieldCooldown){
                this.ctx.fillStyle = this.player.shieldCooldownColor;}
            else{this.ctx.fillStyle = 'rgb(30, 100, 240)';}
            this.ctx.fillRect(15+([i]*25), 605, 20, 40);
        }
    }

    handleDamage(amountDamage){
        this.player.playerHealth = this.player.playerHealth- amountDamage; 
        if(this.player.playerHealth > 38){
            this.player.playerHealth = 38;
        }
        if(this.player.playerHealth<=0){
            window.location.href = "gameover.html"
        }   
         
    }        

    drawBottomBorder(){
        this.ctx.fillStyle = 'rgb(50, 50, 50)';
        this.ctx.fillRect(0, 600, 1000, 100);
    }
    // did an enemy get hit by a friendly bullet?
    checkProjectileCollisions(){
        let bullets = this.player.getBullets();
        let enemies = this.generator.enemies;

        for(let i = 0; i < bullets.length; i++){
            let enemydestroyed = false;
            for(let j = 0; j < enemies.length; j++){
                if(this.checkCollision(bullets[i], enemies[j])){
                    if(bullets[i].damage == enemies[j].health){
                        this.player.removeBullet(i);
                        if(enemies[j].type == "Splitter"){
                            this.generator.onSplitterDestroyed(enemies[j].positionX, enemies[j].positionY);
                        }else if(enemies[j].type == "Suicider"){
                            this.generator.onSuiciderDestroyed(enemies[j].getCenterX(), enemies[j].getCenterY());
                        }
                        this.generator.tryGeneratePickup(enemies[j].type, enemies[j].getCenterX(), enemies[j].getCenterY());
                        this.generator.removeEnemy(j);
                        enemydestroyed = true;
                    }else if(bullets[i].damage < enemies[j].health){
                        enemies[j].health = enemies[j].health - bullets[i].damage;
                        this.player.removeBullet(i);
                        enemydestroyed = true;
                    }else{ //if it was an overkill
                        this.player.bullets[i].damage -= enemies[j].health;
                        if(enemies[j].type == "Splitter"){
                            this.generator.onSplitterDestroyed(enemies[j].positionX, enemies[j].positionY);
                        }else if(enemies[j].type == "Suicider"){
                            this.generator.onSuiciderDestroyed(enemies[j].getCenterX(), enemies[j].getCenterY());
                        }
                        this.generator.tryGeneratePickup(enemies[j].type, enemies[j].getCenterX(), enemies[j].getCenterY());
                        this.generator.removeEnemy(j);
                        enemydestroyed = true;
                        console.log("overkill")
                    }
                    
                }
                if(enemydestroyed == true){
                    break;
                }
               
            }
            
        }
    }

    checkBulletOutOfBounds(){
        let playerbullets = this.player.getBullets();
        for(let i = 0; i < playerbullets.length; i++){
            if(playerbullets[i].positionX >= 1000){
                this.player.removeBullet(i);
            }
        } 
        
        let bullets = this.generator.bullets;
        for(let i = 0; i < bullets.length; i++){
            if(bullets[i].positionX >= 1000 || bullets[i].positionX + bullets[i].width < 0 
                || bullets[i].positionY + bullets[i].height < 0 || bullets[i].positionY > 600){
                this.generator.removeBullet(i);
            }
        } 
        
    }

    checkCollision(obj1, obj2){
        let dx = obj1.getCenterX() - obj2.getCenterX();
        let dy = obj1.getCenterY() - obj2.getCenterY();
        let distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < (obj1.width/2 + obj2.width/2)){
            return true;
        }else{
            return false;
        }

    }

    getDistance(playerObj, projObj){
        let dx = playerObj.getCenterX() - projObj.getCenterX();
        let dy = playerObj.getCenterY() - projObj.getCenterY();
        return Math.sqrt(dx*dx + dy*dy);
    }

    clearRect(){
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    drawEnemies(){
        let enemies = this.generator.enemies;
        for(let i = 0; i < enemies.length; i++){
            if(enemies[i].type == "Splitter"){
                this.ctx.fillStyle = enemies[i].color;
                this.ctx.fillRect(enemies[i].positionX, enemies[i].positionY, 30, 30);
                this.ctx.fillRect(enemies[i].positionX+ 40, enemies[i].positionY, 30, 30);
                this.ctx.fillRect(enemies[i].positionX, enemies[i].positionY+40, 30, 30);
                this.ctx.fillRect(enemies[i].positionX+40, enemies[i].positionY+40, 30, 30);
            }else{
                this.ctx.fillStyle = enemies[i].color;
                this.ctx.fillRect(enemies[i].positionX, enemies[i].positionY, enemies[i].height, enemies[i].width);
                //console.log("drawed at " + enemies[i].positionX + "" + enemies[i].positionY);
            }
        }
    }

    drawEnemyProjectilesAndUpgrades(){
        for(let i = 0; i < this.generator.upgrades.length; i++){
            this.ctx.beginPath();
            this.ctx.fillStyle = this.generator.upgrades[i].color;
            this.ctx.arc(this.generator.upgrades[i].getCenterX(), this.generator.upgrades[i].getCenterY(), this.generator.upgrades[i].width/2, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        let bullets = this.generator.bullets;
        for(let j = 0; j < bullets.length; j ++){
            this.ctx.fillStyle = bullets[j].color;
            this.ctx.fillRect(bullets[j].positionX, bullets[j].positionY, bullets[j].height, bullets[j].width);
        }
    }

    drawBackground(){
        this.background.moveStars();
        let stars = this.background.stars;
        for(let i = 0; i < stars.length; i++){
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(stars[i].positionX, stars[i].positionY, stars[i].height, stars[i].width);
        }
    }
    
}

