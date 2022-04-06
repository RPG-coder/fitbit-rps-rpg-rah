/*
    Rock Paper Scissor | index.js
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
import { device, getDelay, getSettingsActive, setDelay, setIsOnSettings, writeWins } from "./common_use";
import * as document from "document";
import { choicePage, mainMenuPage } from "./play_game";
import { memory } from "system";
import * as fs from "fs";

if (fs.existsSync("rps_game_rpg_rah.json")) {
    console.log("[INFO] file exists for recording wins!");   
}else{
    writeWins(0,0);
    console.log("[INFO] created new file for recording wins!");
}

console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
document.getElementById("settings").groupTransform.translate.y=device.screen.height;

/*
    [TODO] Icon (applications only): Applications require an icon image in PNG or JPEG format, either 80x80 or 160x160 and should have a transparent background.
*/
console.log('[INFO] Hello world!');

const game = document.getElementById("app-area");
const settings = document.getElementById("settings");
const delayIndicator = document.getElementById("delay-text");
document.getElementById('increase-delay').addEventListener("mouseup", ()=>{
    setDelay(getDelay()<30?getDelay()+1:30);
    delayIndicator.text = getDelay()<=9?`0${getDelay()}`:getDelay();
});
document.getElementById('decrease-delay').addEventListener("mouseup", ()=>{
    setDelay((getDelay()>0)?getDelay()-1:0);
    delayIndicator.text = getDelay()<=9?`0${getDelay()}`:getDelay();
})


/* Gesture Detection */
let clickX=0, clickY=0;
let lastGameScreenPosY = 0, lastSettingScreenPosY = device.screen.height;
document.getElementById("app").addEventListener("mousedown",(evt)=>{
    clickY = evt.screenY;
    clickX = evt.screenX;
});

document.getElementById("app").addEventListener("mousemove",(evt)=>{
    if(getSettingsActive()){
        if(lastGameScreenPosY - (clickY-evt.screenY) < 0){
            game.groupTransform.translate.y = lastGameScreenPosY - (clickY-evt.screenY);
        }
        if(lastSettingScreenPosY - (clickY-evt.screenY) > 0){
            settings.groupTransform.translate.y = lastSettingScreenPosY - (clickY-evt.screenY);
        }
    }
});


document.getElementById("app").addEventListener("mouseup",(evt)=>{
    if(getSettingsActive()){
        if( 2 * settings.groupTransform.translate.y >= device.screen.height){
            game.groupTransform.translate.y = 0;
            settings.groupTransform.translate.y = device.screen.height;
            setIsOnSettings(false);
        }else{
            game.groupTransform.translate.y = -device.screen.height;
            settings.groupTransform.translate.y = 0;
            setIsOnSettings(true);
        }
        lastGameScreenPosY = game.groupTransform.translate.y;
        lastSettingScreenPosY = settings.groupTransform.translate.y;
    }else{
        lastGameScreenPosY = game.groupTransform.translate.y;
        lastSettingScreenPosY = settings.groupTransform.translate.y;
    }
});

/* Main Menu start button */
document.getElementById("start-btn").addEventListener("mouseup", ()=>{
    choicePage();
});








const main = ()=>{
    console.log('[INFO] In main!');
    console.log(`[INFO] Dimensions: ${device.screen.width} x ${device.screen.height}`);

    // [TODO] For Permissions: https://dev.fitbit.com/build/guides/permissions/ 
    mainMenuPage();
}

main();