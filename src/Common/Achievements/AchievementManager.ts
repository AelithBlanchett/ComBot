import {IAchievement} from "./IAchievement";
import {BaseFighter} from "../Fight/BaseFighter";
import {BaseActiveFighter} from "../Fight/BaseActiveFighter";
import {BaseFight} from "../Fight/BaseFight";
import {GameSettings} from "../Configuration/GameSettings";
import {TransactionType} from "../Constants/TransactionType";

export class AchievementManager {

    public static EnabledAchievements:IAchievement[] = [];

    static getAll():IAchievement[]{
        return this.EnabledAchievements;
    }

    static get(name:string):IAchievement{
        return AchievementManager.getAll().find(x => x.getName() == name);
    }

    static async checkAll(fighter:BaseFighter, activeFighter:BaseActiveFighter, fight?:BaseFight<BaseActiveFighter>):Promise<string[]>{
        let addedInfo = [];
        let achievements = AchievementManager.getAll();

        for(let achievement of achievements){
            if(fighter.achievements.findIndex(x => x.getName() == achievement.getName()) == -1 && achievement.meetsRequirements(fighter, activeFighter, fight)){
                achievement.createdAt = new Date();
                fighter.achievements.push(achievement);
                let amount:number = achievement.getReward();
                await fighter.giveTokens(amount, TransactionType.AchievementReward, GameSettings.botName);
                addedInfo.push(`${achievement.getDetailedDescription()}  Reward: ${achievement.getReward()} ${GameSettings.currencyName}`);
            }
        }
        return addedInfo;
    }
}

