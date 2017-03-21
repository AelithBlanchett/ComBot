import {Fighter} from "./Fighter";
import Knex = require("knex");
import {Fight} from "./Fight";
import {IAchievement} from "./interfaces/IAchievement";
import {EnabledAchievements, AchievementType} from "./Achievements";
import {ActiveFighter} from "./ActiveFighter";
import {FighterRepository} from "./FighterRepository";
import * as Constants from "./Constants";
import {TransactionType} from "./Constants";

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
            if(fighter.achievements.findIndex(x => x.getType() == achievement.getType()) == -1 && achievement.meetsRequirements(fighter, activeFighter, fight)){
                achievement.createdAt = new Date();
                fighter.achievements.push(achievement);
                let amount:number = achievement.getReward();
                fighter.giveTokens(amount);
                FighterRepository.logTransaction(this.name, amount, TransactionType.AchievementReward, Constants.Globals.botName);
                addedInfo.push(achievement.getDetailedDescription() + " Reward: "+ achievement.getReward() + " tokens.");
            }
        }
        return addedInfo;
    }
}

