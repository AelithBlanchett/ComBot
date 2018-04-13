import {BaseFighterState} from "../Fight/BaseFighterState";
import {BaseFight} from "../Fight/BaseFight";
import {BaseUser} from "../Fight/BaseUser";

export interface IAchievement{
    meetsRequirements(fighter:BaseUser, activeFighter:BaseFighterState, fight:BaseFight):boolean;
    getDetailedDescription():string;
    getReward():number;
    getUniqueShortName():string;
    getName():string;
}

