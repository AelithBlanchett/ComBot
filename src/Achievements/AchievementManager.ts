import {IAchievement} from "./IAchievement";
import {EnabledAchievements, AchievementType} from "./Achievements";
import * as Constants from "../Common/Constants";
import {TransactionType} from "../Common/Constants";
import {BaseFighter} from "../Common/BaseFighter";
import {BaseActiveFighter} from "../Common/BaseActiveFighter";
import {BaseFight} from "../Common/BaseFight";

export class AchievementManager {

    static getAll():IAchievement[]{
        return EnabledAchievements.getAll();
    }

    static get(type:AchievementType):IAchievement{
        return AchievementManager.getAll().find(x => x.getType() == type);
    }

    static checkAll(fighter:BaseFighter, activeFighter:BaseActiveFighter, fight?:BaseFight<BaseActiveFighter>):string[]{
        let addedInfo = [];
        let achievements = AchievementManager.getAll();

        for(let achievement of achievements){
            if(fighter.achievements.findIndex(x => x.getType() == achievement.getType()) == -1 && achievement.meetsRequirements(fighter, activeFighter, fight)){
                achievement.createdAt = new Date();
                fighter.achievements.push(achievement);
                let amount:number = achievement.getReward();
                fighter.giveTokens(amount, TransactionType.AchievementReward, Constants.Globals.botName);
                addedInfo.push(`${achievement.getDetailedDescription()}  Reward: ${achievement.getReward()} ${Constants.Globals.currencyName}`);
            }
        }
        return addedInfo;
    }
}

