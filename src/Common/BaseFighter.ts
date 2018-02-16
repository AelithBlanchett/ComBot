import {IAchievement} from "../Achievements/IAchievement";
import {BaseFeature} from "./BaseFeature";
import {FightTier, FightTierWinRequirements, Stats, Team, TransactionType} from "./BaseConstants";
import {AchievementManager} from "../Achievements/AchievementManager";
import {Fight} from "../FightSystem/Fight";
import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {FeatureFactory} from "./FeatureFactory";

export abstract class BaseFighter{

    name:string = "";
    areStatsPrivate:boolean = true;

    tokens: number = 50;
    tokensSpent: number = 0;

    fightsCount:number;
    fightsCountCS:number;
    losses:number;
    lossesSeason:number;
    wins:number;
    winsSeason:number;
    currentlyPlaying:number;
    currentlyPlayingSeason:number;
    fightsPendingReady:number;
    fightsPendingReadySeason:number;
    fightsPendingStart:number;
    fightsPendingStartSeason:number;
    fightsPendingDraw:number;
    fightsPendingDrawSeason:number;
    favoriteTeam:Team;
    favoriteTagPartner:string;
    timesFoughtWithFavoriteTagPartner:number;
    nemesis:string;
    lossesAgainstNemesis:number;
    averageDiceRoll:number;
    missedAttacks:number;
    actionsCount:number;
    actionsDefended:number;

    matchesInLast24Hours:number;
    matchesInLast48Hours:number;

    eloRating:number = 2000;
    globalRank:number;

    forfeits:number;
    quits:number;

    features:BaseFeature[] = [];
    achievements:IAchievement[] = [];
    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date;

    restat(statArray:Array<number>){
        for(let i = 0; i < statArray.length;  i++){
            this[Stats[i]] = statArray[i];
        }
    }

    winRate():number{
        let winRate = 0.00;
        if(this.fightsCount > 0 && this.wins > 0){
            winRate = this.fightsCount/this.wins;
        }
        else if(this.fightsCount > 0 && this.losses > 0){
            winRate = 1 - this.fightsCount/this.losses;
        }
        return winRate;
    }

    getFeaturesList(){
        let strResult = [];
        for(let feature of this.features){
            let usesLeft = "";
            if(feature.uses > 0){
                usesLeft = ` - ${feature.uses} uses left`;
            }
            else{
                usesLeft = ` - permanent`;
            }
            strResult.push(`${feature.type}${usesLeft}`);
        }
        return strResult.join(", ");
    }

    getAchievementsList(){
        let strResult = [];
        for(let achievement of this.achievements){
            strResult.push(`${achievement.getDetailedDescription()}`);
        }
        return strResult.join(", ");
    }

    removeFeature(type:string):void{
        let index = this.features.findIndex(x => x.type == type);
        if(index != -1){
            this.features.splice(index, 1);
        }
        else{
            throw new Error("You don't have this feature, you can't remove it.");
        }
    }

    addFeature(type:string, matches:number):number{
        let feature:any = FeatureFactory.getFeature(type, matches);
        let amountToRemove:number = feature.getCost() * matches;

        if(this.tokens - amountToRemove >= 0){
            let index = this.features.findIndex(x => x.type == type);
            if(index == -1){
                this.features.push(feature);
                return amountToRemove;
            }
            else{
                throw new Error("You already have this feature. You have to wait for it to expire before adding another of the same type.");
            }
        }
        else{
            throw new Error(`Not enough tokens. Required: ${amountToRemove}.`);
        }
    }

    clearFeatures(){
        this.features = [];
    }

    hasFeature(featureType:string):boolean{
        return this.features.findIndex(x => x.type == featureType) != -1;
    }

    async giveTokens(amount:number, transactionType:TransactionType, fromFighter:string = ""):Promise<void>{
        this.tokens += amount;
        await this.saveTokenTransaction(this.name, amount, transactionType, fromFighter);
    }

    async removeTokens(amount:number, transactionType:TransactionType, fromFighter:string = ""):Promise<void>{
        this.tokens -= amount;
        this.tokensSpent += amount;
        if(this.tokens < 0){
            this.tokens = 0;
        }
        await this.saveTokenTransaction(this.name, amount, transactionType, fromFighter);
    }

    canPayAmount(amount):boolean{
        return (this.tokens - amount >= 0);
    }

    fightTier():FightTier{
        if(this.wins < FightTierWinRequirements.Silver){
            return FightTier.Bronze;
        }
        else if(this.wins < FightTierWinRequirements.Gold){
            return FightTier.Silver
        }
        else if(this.wins >= FightTierWinRequirements.Gold){
            return FightTier.Gold;
        }
        else{
            return FightTier.Bronze;
        }
    }
    abstract outputStats():string;
    abstract async save():Promise<void>;
    abstract async saveTokenTransaction(idFighter:string, amount:number, transactionType:TransactionType, fromFighter?:string):Promise<void>;
}