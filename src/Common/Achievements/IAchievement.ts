import {BaseFighter} from "../Fight/BaseFighter";
import {BaseActiveFighter} from "../Fight/BaseActiveFighter";
import {BaseFight} from "../Fight/BaseFight";

export interface IAchievement{
    createdAt:Date;

    meetsRequirements(fighter:BaseFighter, activeFighter:BaseActiveFighter, fight:BaseFight):boolean;
    getDetailedDescription():string;
    getReward():number;
    getUniqueShortName():string;
    getName():string;
}

