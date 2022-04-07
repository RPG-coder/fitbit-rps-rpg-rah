/*
    Rock Paper Scissor | common_use.js
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
import { me as dev } from "device";
import * as fs from "fs";


// Setting the device screen for compatibility sakes
if (!dev.screen) dev.screen = { width: 348, height: 250 };
let activateSettings = true, onSettings = false;
export const device = dev;

let delay = 15;
export const setDelay = (delayVal) => {
    delay = delayVal;
}
export const getDelay = () => delay;

export const setIsOnSettings = (isOnSettings)=>{
    onSettings = isOnSettings;
};
export const getIsOnSettings = ()=>onSettings;

export const setSettingsActive = (active)=>{
    activateSettings = active;
};
export const getSettingsActive = ()=>activateSettings;
export const writeWins = (playerWins, comWins) => {
    try{
        console.log(playerWins, comWins);
        fs.writeFileSync("rps_game_rpg_rah.json",  {playerWins: playerWins, comWins: comWins}, 'json');
    } catch(err){
        console.log("[ERROR] score file not written!!")
    }
}
export const readWins= () => {
    try{
        return fs.readFileSync("rps_game_rpg_rah.json", "json");
    }catch(err) {
        return {
            playerWins: 0,
            comWins: 0
        }
    }
}