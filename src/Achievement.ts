import {EnumEx} from "./Utils";
import {Fighter} from "./Fighter";
import {FightTier} from "./Constants";
import Knex = require("knex");
import {Model} from "./Model";
import {Fight} from "./Fight";

export class Achievement {
    type: AchievementType;
    reward: AchievementReward;
    name: string;
    description: AchievementDescription;
    condition: string;
    createdAt:Date;

    constructor(type: AchievementType, createdAt?:Date){
        this.type = type;
        this.name = AchievementReward[AchievementReward[AchievementType[type]]]; //short name, the enumerator's name in fact
        this.reward = AchievementReward[AchievementType[type]];
        this.description = AchievementDescription[AchievementType[type]];
        this.condition = AchievementCondition[AchievementType[type]];
        this.createdAt = createdAt || new Date();
    }

    static getAll():Achievement[]{
        let achievements:Achievement[] = [];
        let types = EnumEx.getValues(AchievementType);
        for(let type of types){
            achievements.push(new Achievement(type));
        }
        return achievements;
    }

    static checkAll(fighter:Fighter, fight?:Fight):string[]{
        let addedInfo = [];
        let achievements = Achievement.getAll();

        //useless statements to make sure typescript loads the FightTier class
        let x = FightTier.Bronze;

        for(let achievement of achievements){
            if(fighter.achievements.findIndex(x => x.type == achievement.type) == -1 && eval(achievement.condition)){ // super dangerous, I know
                fighter.achievements.push(achievement);
                fighter.giveTokens(achievement.reward);
                addedInfo.push(achievement.description + " Reward: "+ achievement.reward + " tokens.");
            }
        }
        return addedInfo;
    }
}

export enum AchievementCondition{
    Rookie = <any>"fighter.fightsCount >= 1",
    FiveFights = <any>"fighter.fightsCount >= 5",
    TenFights = <any>"fighter.fightsCount >= 10",
    TwentyFights = <any>"fighter.fightsCount >= 20",
    FortyFights = <any>"fighter.fightsCount >= 40",
    WinFiveFights = <any>"fighter.wins >= 5",
    WinTenFights = <any>"fighter.wins >= 10",
    WinTwentyFights = <any>"fighter.wins >= 20",
    WinThirtyFights = <any>"fighter.wins >= 30",
    WinFortyFights = <any>"fighter.wins >= 40",
    ReachedSilver = <any>"fighter.tier() >= Constants_1.FightTier.Silver",
    ReachedGold = <any>"fighter.tier() >= Constants_1.FightTier.Gold",
    LongFight = <any>"fight.currentTurn >= 20",
    SeasonOne = <any>"fight.season == 1",
    DoubleKO = <any>"fight.isDraw() == true",
    CumFest = <any>`fight.fighters.filter(x => x.name == "").length >= 2`
}

export enum AchievementDescription{
    Rookie = <any>"Win your first fight!",
    FiveFights = <any>"Participate in 5 Fights",
    TenFights = <any>"Participate in 10 fights",
    TwentyFights = <any>"Participate in 20 fights",
    FortyFights = <any>"Participate in 40 fights",
    WinFiveFights = <any>"Win 5 Fights",
    WinTenFights = <any>"Win 10 fights",
    WinTwentyFights = <any>"Win 20 fights",
    WinThirtyFights = <any>"Win 30 fights",
    WinFortyFights = <any>"Win 40 fights",
    ReachedSilver = <any>"Reached Silver Tier",
    ReachedGold = <any>"Reached Gold Tier",
    LongFight = <any>"Participate in a fight lasting more than 20 turns",
    SeasonOne = <any>"Participate in season 1",
    DoubleKO = <any>"Finish a match with a double-KO",
    CumFest = <any>"Have two players cum on the same round"
}

export enum AchievementType {
    Rookie = 0,
    FiveFights = 1,
    TenFights = 2,
    TwentyFights = 3,
    FortyFights = 4,
    WinFiveFights = 5,
    WinTenFights = 6,
    WinTwentyFights = 7,
    WinThirtyFights = 8,
    WinFortyFights = 9,
    ReachedSilver = 10,
    ReachedGold = 11,
    LongFight = 12,
    SeasonOne = 13,
    DoubleKO = 14,
    CumFest = 15
}

export enum AchievementReward {
    Rookie = 5,
    FiveFights = 25,
    TenFights = 50,
    TwentyFights = 75,
    FortyFights = 100,
    WinFiveFights = 25,
    WinTenFights = 50,
    WinTwentyFights = 100,
    WinThirtyFights = 150,
    WinFortyFights = 200,
    ReachedSilver = 50,
    ReachedGold = 100,
    LongFight = 5,
    SeasonOne = 5,
    DoubleKO = 15,
    CumFest = 10
}