import {BaseFighter} from "../Common/Fight/BaseFighter";
import {BaseActiveFighter} from "../Common/Fight/BaseActiveFighter";
import {BaseFight} from "../Common/Fight/BaseFight";

export interface IAchievement{
    createdAt:Date;

    meetsRequirements(fighter:BaseFighter, activeFighter:BaseActiveFighter, fight:BaseFight):boolean;
    getDetailedDescription():string;
    getReward():number;
    getUniqueShortName():string;
    getName():string;
}

