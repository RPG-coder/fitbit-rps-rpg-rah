/*
    Rock Paper Scissor | play_game.js
    Copyright (C) 2022  Rahul Gautham Putcha

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    Developer Name: Rahul Gautham Putcha
    Email: rahulgputcha@gmail.com
    Website: https://www.rahulgputcha.com 
*/
import * as document from "document";
import { getRandomValues } from "crypto";
import { device, getDelay, getIsOnSettings, readWins, setSettingsActive, writeWins } from "./common_use";

const moves = ["rock", "paper", "scissor"];

// Asset loading
const game = document.getElementById("app-area");
const settings = document.getElementById("settings");
const choiceScreen = document.getElementById("game-choice");
const mainmenuScreen = document.getElementById("main-menu");
const gameScreen = document.getElementById("playground");
const timerText = document.getElementById("timer-txt");
const com = document.getElementById("com"), comSprite = document.getElementById("com-sprite"), comText = document.getElementById("com-txt");
const player = document.getElementById("player"), playerSprite = document.getElementById("player-sprite"), playerText = document.getElementById("player-txt");
const status = document.getElementById("game-status"), endGameScreen = document.getElementById("end-game");
const playerWinText = document.getElementById("player-wins"), comWinText = document.getElementById("com-wins");

const spriteWidth = 130, spriteHeight = 130;
let playerChoice = 0;
let playerWins = 0, comWins = 0;
let timer_handle = null;

document.getElementById("setting-reset-btn").addEventListener("mouseup", ()=>{
    writeWins(0,0);
    playerWins = 0;
    comWins = 0;
    document.getElementById("player-wins").text = "0000";
    document.getElementById("com-wins").text = "0000";
});

// Dynamic asset transform settings: One Time execution
player.groupTransform.translate.x = (device.screen.width-spriteWidth)*0.5
com.groupTransform.translate.x  = (device.screen.width+spriteWidth)*0.5;
com.groupTransform.translate.y  = device.screen.height*0.025+spriteHeight;
playerSprite.groupTransform.rotate.angle += 4;
player.groupTransform.translate.y  = device.screen.height*0.975-spriteHeight;
comSprite.groupTransform.rotate.angle = 180;

playerText.x = 50;
comText.x = -83;
playerText.y = -10;
comText.y = 10;
// let clickY=0, ignoreClick=false;
// document.getElementById("choose-btn").addEventListener("mousemove", (evt)=>{
//     if((clickY-evt.screenY) < 10 || (clickY-evt.screenY) < -10)
//         ignoreClick=true;
// })
// document.getElementById("choose-btn").addEventListener("mousedown",(evt)=>{
//     clickY = evt.screenY;
//     ignoreClick=false;
// });
// // Button Action and Event handlers
document.getElementById("choose-btn").addEventListener("mouseup", ()=>{
    // if(!ignoreClick){
        clearInterval(timer_handle);
        game.groupTransform.translate.y = 0;
        settings.groupTransform.translate.y = device.screen.height;
        gameScreen.style.display = "inherit";
        choiceScreen.style.display = "none";
        mainmenuScreen.style.display = "none";
        playGame(playerChoice);
    // }
});

document.getElementById("next-choice").addEventListener("mouseup", ()=>{
    moves.forEach((e)=>{
        document.getElementById(`${e}-choice`).style.display = "none";
    });

    playerChoice = (playerChoice+1)%3;
    document.getElementById(`${moves[playerChoice]}-choice`).style.display = "inherit"; 
});
document.getElementById("prev-choice").addEventListener("mouseup", ()=>{
    moves.forEach((e)=>{
        document.getElementById(`${e}-choice`).style.display = "none";
    })

    playerChoice--;
    if(playerChoice<0) playerChoice = 2;
    document.getElementById(`${moves[playerChoice]}-choice`).style.display = "inherit";
});

const decideWin = (comMove, playerMove)=>{
    let action = (comMove===playerMove)?0:(
        (playerMove===(comMove+1)%3)?1:-1
    );
    endGameScreen.style.display = "inherit";
    switch(action){
        case 1  : // Win
            playerWins++;
            status.text = "You Win!!";
        break;
        case -1 : // Lose
            comWins++;
            status.text = "Com Wins!";
        break;
        default : // Draw
            playerWins++;
            comWins++;
            status.text = "Draw Game";
    }

    writeWins(playerWins, comWins);

}

const rps = (comMove, playerMove) => {
    
    resetAnim();
    // Animation move choice selections
    const comAnimation = document.getElementById(`${moves[comMove]}_com`);
    const playerAnimation = document.getElementById(`${moves[playerMove]}_player`);
    comAnimation.style.display = playerAnimation.style.display = "inherit";

    if(comMove!==0) comAnimation.animate("enable");
    if(playerMove!==0) playerAnimation.animate("enable");
    
    // Decide who is won after 2 seconds duration of animation
    let handle = setTimeout(() => {
        decideWin(comMove, playerMove);
        clearTimeout(handle);
    }, 2000);
}

const dibs = (comMove,playerMove)=>{
    game.groupTransform.translate.y = 0;
    settings.groupTransform.translate.y = device.screen.height;
    let times_played=0, increaseAngle=0;
    let increase = true;
    let handle = setInterval(() => {
        if(increase){
            comSprite.groupTransform.rotate.angle += 4;
            playerSprite.groupTransform.rotate.angle += 4;
            increaseAngle+=4;
            if(increaseAngle>=12){
                increase=false;
                times_played++;
            }
        }else{
            comSprite.groupTransform.rotate.angle -= 4;
            playerSprite.groupTransform.rotate.angle -= 4;
            increaseAngle-=4;
            if(increaseAngle<=0){
                increase=true;
            }
        }

        if(times_played==3){
            clearInterval(handle);
            comSprite.groupTransform.rotate.angle = 180;
            playerSprite.groupTransform.rotate.angle = 0;
            rps(comMove, playerMove);
        }
    }, 100);
    
}

const resetAnim = ()=>{
    moves.forEach((e)=>{
        document.getElementById(`${e}_com`).style.display = "none";
        document.getElementById(`${e}_player`).style.display = "none";
    });
}

const playGame = (playerMove) => {
    setSettingsActive(false);
    endGameScreen.style.display = "none";
    status.text = "";
    let random = new Uint8Array(1);
    getRandomValues(random);
    let ground = document.getElementById("playground");
    ground.style.display = "inherit";

    resetAnim();
    document.getElementById(`rock_player`).style.display = "inherit";
    document.getElementById(`rock_com`).style.display = "inherit";

    dibs(random[0]%3,playerMove);
}

//const mainmenuScreen = document.getElementById("main-menu");
export const choicePage = () => {
    console.log(JSON.stringify(readWins()));
    if(playerWins==0 && comWins==0){
        let obj = readWins();
        playerWins = obj.playerWins;
        comWins = obj.comWins;
        console.log(playerWins, comWins);
    }

    playerWinText.text = (playerWins<=9)?`000${playerWins}`:(
        (playerWins<=99)?`00${playerWins}`:(
            (playerWins<=999)?`0${playerWins}`:(playerWins<=9999)?`${playerWins}`:(
                `0000`
            )
        )
    );
    comWinText.text = (comWins<=9)?`000${comWins}`:(
        (comWins<=99)?`00${comWins}`:(
            (comWins<=999)?`0${comWins}`:(comWins<=9999)?`${comWins}`:(
                `0000`
            )
        )
    );

    gameScreen.style.display = "none";
    mainmenuScreen.style.display = "none";
    choiceScreen.style.display = "inherit";
    setSettingsActive(true);
    let time_left = getDelay();
    timerText.text = (time_left<=9)?`0${time_left}`:time_left;
    timer_handle = setInterval(()=>{
        if(!getIsOnSettings()){
            time_left--;
            timerText.text = (time_left<=9)?`0${time_left}`:time_left;
            if(time_left<=0){
                clearInterval(timer_handle);
                gameScreen.style.display = "inherit";
                choiceScreen.style.display = "none";
                mainmenuScreen.style.display = "none";
                playGame(playerChoice);
            }
        }
    }, 1000);
}
export const mainMenuPage = () => {
    mainmenuScreen.style.display = "inherit";
    gameScreen.style.display = "none";
    choiceScreen.style.display = "none";
    setSettingsActive(true);
}


document.getElementById("restart-btn").addEventListener("mouseup", choicePage);
document.getElementById("exit-btn").addEventListener("mouseup", mainMenuPage);