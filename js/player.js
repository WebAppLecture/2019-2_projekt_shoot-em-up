import Bullet from "./playerBullet.js";
export default class Player{
    constructor(){
        this.positionX = 10;
        this.positionY = 10;

        this.height = 30;
        this.width = 30;
        this.playerHealth = 38;
        this.playerEnergy = 38;
        this.mainColor= "cyan";
        this.damagedColor = "red";
        this.shieldColor = 'rgb(30, 100, 240)'
        this.currentColor = this.mainColor;

        window.addEventListener("keydown", this.onKeydown.bind(this));
        window.addEventListener("keyup", this.onKeyup.bind(this));
        this.bullets = [];

        this.moveleft = false;
        this.moveup = false;
        this.moveright = false;
        this.movedown = false;

        this.speed = 5;
        this.mainDamage = 5;

        this.isAllowedToShoot = true;

        this.powerupMode = "none"; //rapidfire
        this.numShotBulletsInRapidFire = 0;
        this.numMaxBulletsInRapidFire = 20;
        this.lifetime = 0;
        this.frameWhenLastRapidFireWas = 0;

        this.rapidfirecooldown = 200;

        this.lastShieldFrame = 0;
        this.shieldCooldown = 300;
        this.countShieldFrames = 0;
        this.shieldDuration = 50;
        this.shieldCooldownColor = 'rgb(15, 50, 120)'
        this.allowEnergyRegen=true;
        this.turboSwitch=false;
    }

    onKeydown(e) {
        switch(e.which){
            case 65: this.moveleft = true; break;
            case 87: this.moveup = true; break;
            case 68: this.moveright = true; break;
            case 83: this.movedown = true; break;
            case 38: if(this.isAllowedToShoot){
                        this.shoot(); this.isAllowedToShoot = false;
                    } break;
            case 39: if(this.lifetime > this.frameWhenLastRapidFireWas + this.rapidfirecooldown){
                        console.log("changed mode again!");
                        this.powerupMode = "rapidfire";
                    } break;
            case 32: this.turboSwitch = true;
            
            
        }  
    }
    onKeyup(e) {
        switch(e.which){
            case 65: this.moveleft = false; break;
            case 87: this.moveup = false; break;
            case 68: this.moveright = false; break;
            case 83: this.movedown = false; break;
            case 38: this.isAllowedToShoot = true; break;
            case 39: this.powerupMode = "none"; console.log("changed mode to none");break;
            case 32: this.turboSwitch = false; break;
            case 37: if(this.lifetime > this.lastShieldFrame + this.shieldCooldown && this.powerupMode!="shield"){
                console.log("changed mode again!");
                        this.powerupMode = "shield";
                        this.activateShield();
                    } break;
        }
    }

    update(){
        if(this.turboSwitch){
            this.speed = 15;
            this.playerEnergy=this.playerEnergy-0.1; 
            this.allowEnergyRegen=false;
        }
        else{this.speed = 5; this.allowEnergyRegen=true;}

        if(this.playerEnergy < 0){
            this.playerEnergy = 0;
        }
        this.lifetime++;
        if(this.powerupMode == "rapidfire"){
            if(this.lifetime %5 == 0){
                this.shoot();
                this.numShotBulletsInRapidFire ++;
            }
            if(this.numShotBulletsInRapidFire > this.numMaxBulletsInRapidFire){
                this.numShotBulletsInRapidFire = 0;
                this.powerupMode = "none";
                this.frameWhenLastRapidFireWas = this.lifetime;
                //console.log("set to:" + this.frameWhenLastRapidFireWas);
            }
        }
        if(this.powerupMode == "shield"){
            console.log("shield");
            if(this.lifetime %5 == 0){
                this.countShieldFrames ++;
                if(this.countShieldFrames<this.shieldDuration){
                    this.currentColor = this.shieldColor;
                }
            }
            if(this.countShieldFrames > this.shieldDuration){
                this.countShieldFrames = 0;
                this.powerupMode = 'none';
                this.currentColor = this.mainColor;
                this.lastShieldFrame = this.lifetime;
            }
        }
        this.autoFillEnergy();
    }

    autoFillEnergy(){
        if(this.allowEnergyRegen){
            if(this.playerEnergy<38 && (this.lifetime%60==0||this.lifetime%60==30)){
                this.playerEnergy = this.playerEnergy+1;
            }            
        } 
    }
    
    activateShield(){
        if(this.playerEnergy>=10){
            this.playerEnergy -= 10;
        }
    }

    move(){
        if(this.moveleft){
            this.moveLeft();
        }
        if(this.moveup){
            this.moveUp();
        }
        if(this.moveright){
            this.moveRight();
        }
        if(this.movedown){
            this.moveDown();
        }
    }
    
    shoot(){
        let x = new Bullet(this.positionX + 20, this.getCenterY()-7.5, 15, 15, this.mainDamage);
        this.bullets.push(x);
    }

    removeBullet(bulletToRemove){
        this.bullets.splice(bulletToRemove, 1);
    }

    getBullets(){
        return this.bullets;
    }

    moveLeft(){
        if(this.positionX-this.speed >= 0){
        this.positionX = this.positionX-this.speed;}
    }
    moveUp(){
        if(this.positionY-this.speed >= 0){
        this.positionY = this.positionY-this.speed;}
    }
    moveRight(){
        if(this.positionX+this.speed <= 1000-this.width){
        this.positionX = this.positionX+this.speed;}
    }
    moveDown(){
        if(this.positionY+this.speed <= 600-this.height){
        this.positionY = this.positionY+this.speed;}
    }

    getCenterX(){
        //console.log("centerX in Player: "+(this.positionX + 0.5 * this.width));
        return (this.positionX + 0.5 * 30);
    }

    getCenterY(){
        //console.log("centerY in Player: "+(this.positionY + 0.5 * this.height));
        return (this.positionY + 0.5 * 30); 
    }
}