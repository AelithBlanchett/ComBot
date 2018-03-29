import {BaseFighter} from "../../Common/Fight/BaseFighter";

export interface IRWFighter extends BaseFighter{
    dexterity:number;
    power:number;
    sensuality:number;
    toughness:number;
    endurance:number;
    willpower:number;
}