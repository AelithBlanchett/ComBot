import {Fighter} from "./Fighter";
import Knex = require("knex");
import {Fight} from "./Fight";
import {IAchievement} from "./interfaces/IAchievement";
import {EnabledAchievements, AchievementType} from "./Achievements";
import {ActiveFighter} from "./ActiveFighter";

export class AchievementManager {

    static getAll():IAchievement[]{
        return EnabledAchievements.getAll();
    }

    static get(type:AchievementType):IAchievement{
        return AchievementManager.getAll().find(x => x.getType() == type);
    }

    static checkAll(fighter:Fighter, activeFighter:ActiveFighter, fight?:Fight):string[]{
        let addedInfo = [];
        let achievements = AchievementManager.getAll();

        for(let achievement of achievements){
            if(fighter.achievements.findIndex(x => x.getUniqueShortName() == achievement.getDetailedDescription()) == -1 && achievement.meetsRequirements(fighter, activeFighter, fight)){
                achievement.createdAt = new Date();
                fighter.achievements.push(achievement);
                fighter.giveTokens(achievement.getReward());
                addedInfo.push(achievement.getDetailedDescription() + " Reward: "+ achievement.getReward() + " tokens.");
            }
        }
        return addedInfo;
    }
}

