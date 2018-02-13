import {AchievementType} from "./Achievements";
import {BaseFighter} from "../Common/BaseFighter";
import {BaseActiveFighter} from "../Common/BaseActiveFighter";
import {BaseFight} from "../Common/BaseFight";
export interface IAchievement{
    createdAt:Date;

    meetsRequirements(fighter:BaseFighter, activeFighter:BaseActiveFighter, fight:BaseFight):boolean;
    getDetailedDescription():string;
    getReward():number;
    getUniqueShortName():string;
    getType():AchievementType;
}

