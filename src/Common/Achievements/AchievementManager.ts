import {BaseFighterState} from "../Fight/BaseFighterState";
import {BaseFight} from "../Fight/BaseFight";
import {GameSettings} from "../Configuration/GameSettings";
import {TransactionType} from "../Constants/TransactionType";
import {BaseAchievement} from "./BaseAchievement";
import {BaseUser} from "../Fight/BaseUser";

export class AchievementManager {

    public static EnabledAchievements:BaseAchievement[] = [];

    static getAll():BaseAchievement[]{
        return this.EnabledAchievements;
    }

    static get(name:string):BaseAchievement{
        return AchievementManager.getAll().find(x => x.getName() == name);
    }

    static async checkAll(fighter:BaseUser, activeFighter:BaseFighterState, fight?:BaseFight<BaseFighterState>):Promise<string[]>{
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

