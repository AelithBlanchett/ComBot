import {IAchievement} from "./IAchievement";
import * as BaseConstants from "../Common/BaseConstants";
import {TransactionType} from "../Common/BaseConstants";
import {BaseFighter} from "../Common/Fight/BaseFighter";
import {BaseActiveFighter} from "../Common/Fight/BaseActiveFighter";
import {BaseFight} from "../Common/Fight/BaseFight";
import {GameSettings} from "../Common/Configuration/GameSettings";

export class AchievementManager {

    public static EnabledAchievements:IAchievement[] = [];

    static getAll():IAchievement[]{
        return this.EnabledAchievements;
    }

    static get(name:string):IAchievement{
        return AchievementManager.getAll().find(x => x.getName() == name);
    }

    static checkAll(fighter:BaseFighter, activeFighter:BaseActiveFighter, fight?:BaseFight<BaseActiveFighter>):string[]{
        let addedInfo = [];
        let achievements = AchievementManager.getAll();

        for(let achievement of achievements){
            if(fighter.achievements.findIndex(x => x.getName() == achievement.getName()) == -1 && achievement.meetsRequirements(fighter, activeFighter, fight)){
                achievement.createdAt = new Date();
                fighter.achievements.push(achievement);
                let amount:number = achievement.getReward();
                fighter.giveTokens(amount, TransactionType.AchievementReward, GameSettings.botName);
                addedInfo.push(`${achievement.getDetailedDescription()}  Reward: ${achievement.getReward()} ${GameSettings.currencyName}`);
            }
        }
        return addedInfo;
    }
}

