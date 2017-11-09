import {IAchievement} from "./IAchievement";
import {NSFWFighter} from "../FightSystem/Fighter";
import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {Fight} from "../FightSystem/Fight";
import {FightTier} from "../FightSystem/Constants";

export class EnabledAchievements{ //Keep track of the enabled achievements here, instead of doing reflection
    static getAll():IAchievement[]{
        return [
            new RookieAchievement(),
            new FiveFightsAchievement(),
            new TenFightsAchievement(),
            new TwentyFightsAchievement(),
            new FortyFightsAchievement(),
            new WinookieAchievement(),
            new WinFiveFightsAchievement(),
            new WinTenFightsAchievement(),
            new WinTwentyFightsAchievement(),
            new WinThirtyFightsAchievement(),
            new WinFortyFightsAchievement(),
            new ReachSilverAchievement(),
            new ReachGoldAchievement(),
            new LongFightAchievement(),
            new SeasonOneAchievement(),
            new DoubleKOAchievement(),
            new CumFestAchievement(),
            new SomeSeriousLuckAchievement(),
            new OneMoveTwoStonesAchievement()
        ];
    }
}

export class RookieAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.fightsCount >= 1);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Participate in your first fight!";
    }

    getReward(): number {
        return 3.5;
    }

    getUniqueShortName(): string {
        return "Rookie";
    }

    getType():AchievementType{
        return AchievementType.Rookie;
    }
}

export class FiveFightsAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.fightsCount >= 5);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Participate in 5 Fights";
    }

    getReward(): number {
        return 25;
    }

    getUniqueShortName(): string {
        return "The 5th";
    }

    getType():AchievementType{
        return AchievementType.FiveFights;
    }
}

export class TenFightsAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.fightsCount >= 10);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Participate in 10 Fights";
    }

    getReward(): number {
        return 50;
    }

    getUniqueShortName(): string {
        return "Ten and counting";
    }

    getType():AchievementType{
        return AchievementType.TenFights;
    }
}

export class TwentyFightsAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.fightsCount >= 20);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Participate in 10 Fights";
    }

    getReward(): number {
        return 75;
    }

    getUniqueShortName(): string {
        return "20/20";
    }

    getType():AchievementType{
        return AchievementType.TwentyFights;
    }
}

export class FortyFightsAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.fightsCount >= 40);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Participate in 40 Fights";
    }

    getReward(): number {
        return 100;
    }

    getUniqueShortName(): string {
        return "40 and still fighting";
    }

    getType():AchievementType{
        return AchievementType.FortyFights;
    }
}

export class WinookieAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.wins >= 1);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Win your first fight!";
    }

    getReward(): number {
        return 5;
    }

    getUniqueShortName(): string {
        return "Win-ookie";
    }

    getType():AchievementType{
        return AchievementType.Winookie;
    }
}

export class WinFiveFightsAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.wins >= 5);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Win 5 Fights";
    }

    getReward(): number {
        return 25;
    }

    getUniqueShortName(): string {
        return "Taking Five";
    }

    getType():AchievementType{
        return AchievementType.WinFiveFights;
    }
}

export class WinTenFightsAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.wins >= 10);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Participate in 10 Fights";
    }

    getReward(): number {
        return 50;
    }

    getUniqueShortName(): string {
        return "Ten-acious";
    }

    getType():AchievementType{
        return AchievementType.WinTenFights;
    }
}

export class WinTwentyFightsAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.wins >= 20);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Win 20 Fights";
    }

    getReward(): number {
        return 100;
    }

    getUniqueShortName(): string {
        return "Barely Legal";
    }

    getType():AchievementType{
        return AchievementType.WinTwentyFights;
    }
}

export class WinThirtyFightsAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.wins >= 30);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Win 30 Fights";
    }

    getReward(): number {
        return 150;
    }

    getUniqueShortName(): string {
        return "Thirty for more";
    }

    getType():AchievementType{
        return AchievementType.WinThirtyFights;
    }
}

export class WinFortyFightsAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.wins >= 40);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Win 40 Fights";
    }

    getReward(): number {
        return 200;
    }

    getUniqueShortName(): string {
        return "40 in the coffin";
    }

    getType():AchievementType{
        return AchievementType.WinFortyFights;
    }
}

export class ReachSilverAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.tier() >= FightTier.Silver);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Reached Silver Tier";
    }

    getReward(): number {
        return 50;
    }

    getUniqueShortName(): string {
        return "Silvera";
    }

    getType():AchievementType{
        return AchievementType.ReachedSilver;
    }
}

export class ReachGoldAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.tier() >= FightTier.Gold);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Reached Gold Tier";
    }

    getReward(): number {
        return 100;
    }

    getUniqueShortName(): string {
        return "Gold-lust";
    }

    getType():AchievementType{
        return AchievementType.ReachedGold;
    }
}

export class LongFightAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fight != null){
            flag = (fight.currentTurn >= 20);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Participate in a fight lasting more than 20 turns";
    }

    getReward(): number {
        return 5;
    }

    getUniqueShortName(): string {
        return "Long-ing";
    }

    getType():AchievementType{
        return AchievementType.LongFight;
    }
}

export class SeasonOneAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fight != null){
            flag = (fight.season == 1);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Participate in a fight during the first season";
    }

    getReward(): number {
        return 5;
    }

    getUniqueShortName(): string {
        return "A New Hope";
    }

    getType():AchievementType{
        return AchievementType.SeasonOne;
    }
}

export class DoubleKOAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fight != null){
            flag = (fight.isDraw() == true);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Finish a match with a double-KO";
    }

    getReward(): number {
        return 25;
    }

    getUniqueShortName(): string {
        return "Newton's Third Law";
    }

    getType():AchievementType{
        return AchievementType.DoubleKO;
    }
}

export class CumFestAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fight != null){
            flag = (fight.fighters.filter(x => x.orgasmsDamageLastRound == 1).length >= 2);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Have two players cum on the same round";
    }

    getReward(): number {
        return 7.5;
    }

    getUniqueShortName(): string {
        return "Cum Festival";
    }

    getType():AchievementType{
        return AchievementType.CumFest;
    }
}

export class OneMoveTwoStonesAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(fight != null){
            flag = (fight.fighters.filter(x => x.heartsDamageLastRound == 1).length >= 2);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Have two players lose a heart on the same round";
    }

    getReward(): number {
        return 7.5;
    }

    getUniqueShortName(): string {
        return "One Move Two Stones";
    }

    getType():AchievementType{
        return AchievementType.OneMoveTwoStones;
    }
}

export class SomeSeriousLuckAchievement implements IAchievement{
    createdAt: Date;

    meetsRequirements(fighter: NSFWFighter, activeFighter?: ActiveFighter, fight?: Fight): boolean {
        let flag = false;
        if(activeFighter != null){
            flag = (activeFighter.lastDiceRoll >= 20 && activeFighter.lastDiceRoll <= 40);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return "Roll 20 (or more)";
    }

    getReward(): number {
        return 7.5;
    }

    getUniqueShortName(): string {
        return "Some Serious Luck";
    }

    getType():AchievementType{
        return AchievementType.SomeSeriousLuck;
    }
}

export enum AchievementType {
    Rookie = 0,
    FiveFights = 1,
    TenFights = 2,
    TwentyFights = 3,
    FortyFights = 4,
    Winookie = 5,
    WinFiveFights = 6,
    WinTenFights = 7,
    WinTwentyFights = 8,
    WinThirtyFights = 9,
    WinFortyFights = 10,
    ReachedSilver = 11,
    ReachedGold = 12,
    LongFight = 13,
    SeasonOne = 14,
    DoubleKO = 15,
    CumFest = 16,
    SomeSeriousLuck = 17,
    OneMoveTwoStones = 18
}
