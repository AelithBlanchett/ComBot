import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {Fight} from "../FightSystem/Fight";
import {AchievementType} from "./Achievements";
import {BaseFighter} from "../Common/BaseFighter";
export interface IAchievement{
    createdAt:Date;

    meetsRequirements(fighter:BaseFighter, activeFighter:ActiveFighter, fight:Fight):boolean;
    getDetailedDescription():string;
    getReward():number;
    getUniqueShortName():string;
    getType():AchievementType;
}

