import {Fighter} from "../Fighter";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import {AchievementType} from "../Achievements";
export interface IAchievement{
    createdAt:Date;

    meetsRequirements(fighter:Fighter, activeFighter:ActiveFighter, fight:Fight):boolean;
    getDetailedDescription():string;
    getReward():number;
    getUniqueShortName():string;
    getType():AchievementType;
}

