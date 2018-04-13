import {IAchievement} from "../../Common/Achievements/IAchievement";
import {BaseFighterState} from "../../Common/Fight/BaseFighterState";
import {BaseFight} from "../../Common/Fight/BaseFight";
import {RWFight} from "../Fight/RWFight";
import {AchievementManager} from "../../Common/Achievements/AchievementManager";
import {FightTier} from "../../Common/Constants/FightTier";
import {BaseAchievement} from "../../Common/Achievements/BaseAchievement";
import {BaseUser} from "../../Common/Fight/BaseUser";

export class RookieAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.statistics.fightsCount >= 1);
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

    getName():string{
        return RookieAchievement.name;
    }
}

export class FiveFightsAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.statistics.fightsCount >= 5);
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

    getName():string{
        return FiveFightsAchievement.name;
    }
}

export class TenFightsAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.statistics.fightsCount >= 10);
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

    getName():string{
        return TenFightsAchievement.name;
    }
}

export class TwentyFightsAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.statistics.fightsCount >= 20);
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

    getName():string{
        return TwentyFightsAchievement.name;
    }
}

export class FortyFightsAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.statistics.fightsCount >= 40);
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

    getName():string{
        return FortyFightsAchievement.name;
    }
}

export class WinookieAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.statistics.wins >= 1);
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

    getName():string{
        return WinookieAchievement.name;
    }
}

export class WinFiveFightsAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.statistics.wins >= 5);
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

    getName():string{
        return WinFiveFightsAchievement.name;
    }
}

export class WinTenFightsAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.statistics.wins >= 10);
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

    getName():string{
        return WinTenFightsAchievement.name;
    }
}

export class WinTwentyFightsAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.statistics.wins >= 20);
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

    getName():string{
        return WinTwentyFightsAchievement.name;
    }
}

export class WinThirtyFightsAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.statistics.wins >= 30);
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

    getName():string{
        return WinThirtyFightsAchievement.name;
    }
}

export class WinFortyFightsAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.statistics.wins >= 40);
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

    getName():string{
        return WinFortyFightsAchievement.name;
    }
}

export class ReachSilverAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.fightTier() >= FightTier.Silver);
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

    getName():string{
        return ReachSilverAchievement.name;
    }
}

export class ReachGoldAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(user != null){
            flag = (user.fightTier() >= FightTier.Gold);
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

    getName():string{
        return ReachGoldAchievement.name;
    }
}

export class LongFightAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
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

    getName():string{
        return LongFightAchievement.name;
    }
}

export class SeasonOneAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
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

    getName():string{
        return SeasonOneAchievement.name;
    }
}

export class DoubleKOAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
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

    getName():string{
        return DoubleKOAchievement.name;
    }
}

export class SomeSeriousLuckAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, activeFighter?: BaseFighterState, fight?: BaseFight): boolean {
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

    getName():string{
        return SomeSeriousLuckAchievement.name;
    }
}

export class CumFestAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: RWFight): boolean {
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

    getName():string{
        return CumFestAchievement.name;
    }
}

export class OneMoveTwoStonesAchievement extends BaseAchievement{
    createdAt: Date;

    meetsRequirements(user: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: RWFight): boolean {
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

    getName():string{
        return OneMoveTwoStonesAchievement.name;
    }
}

//The three dots replace the foreach=>push(achievement)
AchievementManager.EnabledAchievements.push(...
    [
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
        new SomeSeriousLuckAchievement(),
        new CumFestAchievement(),
        new OneMoveTwoStonesAchievement()
    ]
);