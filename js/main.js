"use strict";

let buttons = document.getElementById('buttons');
let startButton = document.querySelector('.start');
startButton.addEventListener('click', start);
let attackButton = document.querySelector('.attack');
let specialButton = document.querySelector('.specialAttack');
let healButton = document.querySelector('.heal');
let log = document.querySelector(".log");
let turn = document.createElement("ul");
log.append(turn);
buttons.hidden = true;

class Personnage {
    
    constructor(name, pv, dammage) {
        this.name = name;
        this.pv = pv;
        this.progressBar();
        this.dammage = dammage;
    }

    attack() {
        let dmg = Math.floor(Math.random() * ((10 - this.dammage) + 1) + this.dammage);
        this.li("attack", dmg);
        return dmg;
    }

    progressBar() {
        let string;
        if(this.name == "YOU") {
            string = "pvYou";
        } else if(this.name == "MONSTER") {
            string = "pvMonster";
        }
        this.pvSpan = document.querySelector("." + string);
        this.progress = document.getElementById(string);
        this.pvSpan.innerHTML = this._pv;
        this.progress.value  = this._pv;
    }

    li(key, value) {
        let txt;
        let li = document.createElement("li");
        if(this.name == "YOU") {
            li.classList.add("blue");
        } else if(this.name == "MONSTER") {
            li.classList.add("red");
        }

        switch (key) {
            case "attack":
                txt = this.name + " hits FOR " + value; 
                break;
                
            case "specialAttack":
                txt = this.name + " hits HARD FOR " + value;
                break;
    
            case "heal":
                txt = this.name + " HEALS FOR " + value;
                break;
        }

        let text = document.createTextNode(txt);
        li.append(text);
        turn.append(li);
    }

    get pv() {
        return this._pv;
    }

    set pv(value) {
        if(value < 0) {
            value = 0;
        } else if(value >= 100) {
            value = 100;
        }
        this._pv = value;
        this.progressBar();
        this.win();
    }
    
    win() {
        if( this._pv <= 0){
            if(confirm (this.name + " loose the game, new game?")){
                turn.innerHTML = "";
                buttons.hidden = true;
                startButton.hidden = false;
            }else{
                attackButton.disabled = true;
                specialButton.disabled = true;
                healButton.disabled = true;
            }
        } 
    }

}

class You extends Personnage {

    specialAttack() {
        let special = Math.floor(Math.random() * ((20 - 10) + 1) + 10);
        this.li("specialAttack", special);
        return special;
    }

    heal() {
        this.pv += 10;
        this.li("heal", 10);
    }
}

function start() {
    let you = new You("YOU", 100, 3);
    let monster = new Personnage("MONSTER", 100, 5);

    buttons.hidden = false;
    startButton.hidden = true;

    attackButton.disabled = false;
    specialButton.disabled = false;
    healButton.disabled = false;

    new Actions(buttons, you, monster);
}




class Actions {
    constructor(elem, you, monster) {
        this.you = you;
        this.monster = monster;
        this._elem = elem;
        elem.onclick = this.onClick.bind(this);
    }

    attack() {
        this.monster.pv -= this.you.attack();
        if(this.monster.pv > 0) {
            this.you.pv -= this.monster.attack();
        }
    }

    specialAttack() {
        this.monster.pv -= this.you.specialAttack();
        if(this.monster.pv > 0) {
            this.you.pv -= this.monster.attack();
        }
    }

    heal() {
        this.you.heal();
        this.you.pv -= this.monster.attack();
        this.monster.pv;
    }

    giveUp() {
        if(confirm("YOU are give up, new game?")){
            turn.innerHTML = "";
            buttons.hidden = true;
            startButton.hidden = false; 
        }
    }

    onClick(event) {
        let action = event.target.dataset.action;
        if(action) {
            this[action]();
        }
    };
}