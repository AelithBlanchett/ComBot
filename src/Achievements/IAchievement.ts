import {NSFWFighter} from "../FightSystem/Fighter";
import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {Fight} from "../FightSystem/Fight";
import {AchievementType} from "./Achievements";
export interface IAchievement{
    createdAt:Date;

    meetsRequirements(fighter:NSFWFighter, activeFighter:ActiveFighter, fight:Fight):boolean;
    getDetailedDescription():string;
    getReward():number;
    getUniqueShortName():string;
    getType():AchievementType;
}

