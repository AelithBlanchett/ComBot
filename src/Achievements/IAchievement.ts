import {Fighter} from "../FightSystem/Fighter";
import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {Fight} from "../FightSystem/Fight";
import {AchievementType} from "./Achievements";
export interface IAchievement{
    createdAt:Date;

    meetsRequirements(fighter:Fighter, activeFighter:ActiveFighter, fight:Fight):boolean;
    getDetailedDescription():string;
    getReward():number;
    getUniqueShortName():string;
    getType():AchievementType;
}

