import {NSFWFighter} from "../FightSystem/Fighter";
import {Fight} from "../FightSystem/Fight";
import {IAchievement} from "./IAchievement";
import {EnabledAchievements, AchievementType} from "./Achievements";
import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {FighterRepository} from "../Repositories/FighterRepository";
import * as Constants from "../FightSystem/Constants";
import {TransactionType} from "../FightSystem/Constants";

export class AchievementManager {

    static getAll():IAchievement[]{
        return EnabledAchievements.getAll();
    }

    static get(type:AchievementType):IAchievement{
        return AchievementManager.getAll().find(x => x.getType() == type);
    }

    static checkAll(fighter:NSFWFighter, activeFighter:ActiveFighter, fight?:Fight):string[]{
        let addedInfo = [];
        let achievements = AchievementManager.getAll();

        for(let achievement of achievements){
            if(fighter.achievements.findIndex(x => x.getType() == achievement.getType()) == -1 && achievement.meetsRequirements(fighter, activeFighter, fight)){
                achievement.createdAt = new Date();
                fighter.achievements.push(achievement);
                let amount:number = achievement.getReward();
                fighter.giveTokens(amount);
                FighterRepository.logTransaction(this.name, amount, TransactionType.AchievementReward, Constants.Globals.botName);
                addedInfo.push(`${achievement.getDetailedDescription()}  Reward: ${achievement.getReward()} ${Constants.Globals.currencyName}`);
            }
        }
        return addedInfo;
    }
}

