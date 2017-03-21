import * as Constants from "./Constants";
import {FeatureType, Team} from "./Constants";
import {TokensWorth} from "./Constants";
import {FightTier} from "./Constants";
import {Fight} from "./Fight";
import {FighterRepository} from "./FighterRepository";
import {Feature} from "./Feature";
import {IAchievement} from "./interfaces/IAchievement";
import {AchievementManager} from "./AchievementManager";
import {ActiveFighter} from "./ActiveFighter";
import {TransactionType} from "./Constants";
let EloRating = require('elo-rating');

export class Fighter{

    name:string = "";
    areStatsPrivate:boolean = true;

    dexterity:number = 1;
    power:number = 1;
    sensuality:number = 1;
    toughness:number = 1;
    endurance:number = 1;
    willpower:number = 1;

    tokens: number = 10;
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
    brawlAtksCount:number;
    sexstrikesCount:number;
    tagsCount:number;
    restCount:number;
    subholdCount:number;
    sexholdCount:number;
    bondageCount:number;
    humholdCount:number;
    itemPickups:number;
    sextoyPickups:number;
    degradationCount:number;
    forcedWorshipCount:number;
    highRiskCount:number;
    penetrationCount:number;
    stunCount:number;
    escapeCount:number;
    submitCount:number;
    straptoyCount:number;
    finishCount:number;
    masturbateCount:number;

    matchesInLast24Hours:number;
    matchesInLast48Hours:number;

    eloRating:number = 2000;
    globalRank:number;

    forfeits;
    quits;

    features:Feature[] = [];
    achievements:IAchievement[] = [];
    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date;

    addAchievement(uniqueShortName:string){
        let added = false;
        let index = this.achievements.findIndex(x => x.getUniqueShortName() == uniqueShortName);
        if(index == -1){
            let allAchievements = AchievementManager.getAll();
            let indexNewAchievement = allAchievements.findIndex(x => x.getUniqueShortName().toString() == uniqueShortName);
            let achievement = allAchievements[indexNewAchievement];
            achievement.createdAt = new Date();
            this.achievements.push(achievement);
            added = true;
        }
        return added;
    }

    checkAchievements(activeFighter?:ActiveFighter, fight?:Fight){
        let strBase = `[color=yellow][b]Achievements unlocked for ${this.name}![/b][/color]\n`;
        let added = AchievementManager.checkAll(this, activeFighter, fight);

        if(added.length > 0){
            strBase += added.join("\n");
        }
        else{
            strBase = "";
        }

        return strBase;
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

    totalHp():number{
        let hp = 100;
        if (this.toughness > 35) {
            hp += (this.toughness - 35);
        }
        return hp;
    }

    hpPerHeart():number {
        return Math.ceil(this.totalHp() / this.maxHearts());
    }

    maxHearts():number {
        return 3;
    }

    totalLust():number{
        let lust = 100;
        if (this.endurance > 35) {
            lust += (this.endurance - 35);
        }
        return lust;
    }

    lustPerOrgasm():number {
        return Math.ceil(this.totalLust() / this.maxOrgasms());
    }

    maxOrgasms():number {
        return 3;
    }

    minFocus():number {
        return -20 - this.focusResistance();
    }

    focusResistance():number{
        let resistance = 0;
        if (this.willpower > 30) {
            resistance += (this.willpower - 30);
        }
        return resistance;
    }

    initialFocus():number{
        return 0;
    }

    maxFocus():number {
        return 20 + this.focusResistance();
    }

    outputStats():string{
        return "[b]" + this.name + "[/b]'s stats" + "\n" +
            "[b][color=red]Power[/color][/b]:  " + this.power + "      " + "    --            [b][color=red]Hearts[/color][/b]: " + this.maxHearts() + " * " + this.hpPerHeart() +" [b][color=red]HP[/color] per heart[/b]"+"\n" +
            "[b][color=purple]Sensuality[/color][/b]:  " + this.sensuality + "      " + "[b][color=pink]Orgasms[/color][/b]: " + this.maxOrgasms() + " * " + this.lustPerOrgasm() +" [b][color=pink]Lust[/color] per Orgasm[/b]"+"\n" +
            "[b][color=orange]Toughness[/color][/b]: " + this.toughness + "\n" +
            "[b][color=cyan]Endurance[/color][/b]: " + this.endurance + "      " + "[b][color=green]Win[/color]/[color=red]Loss[/color] record[/b]: " + this.wins + " - " + this.losses + "\n" +
            "[b][color=green]Dexterity[/color][/b]: " + this.dexterity +  "      " + "[b][color=brown]Copper tokens available[/color][/b]: " + this.copperTokens() +  " " +"[b][color=orange]Bronze tokens available[/color][/b]: " + this.bronzeTokens() +  " " + "[b][color=grey]Silver[/color][/b]: " + this.silverTokens() +  " " + "[b][color=yellow]Gold[/color][/b]: " + this.goldTokens() + "\n" +
            "[b][color=brown]Willpower[/color][/b]: " + this.willpower +  "      " + "[b][color=orange]Total tokens[/color][/b]: " + this.tokens + "         [b][color=orange]Total spent[/color][/b]: "+this.tokensSpent+"\n"  +
            "[b][color=red]Features[/color][/b]: [b]" + this.getFeaturesList() + "[/b]\n" +
            "[b][color=yellow]Achievements[/color][/b]: [sub]" + this.getAchievementsList() + "[/sub]";
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
            strResult.push(`${FeatureType[feature.type]}${usesLeft}`);
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

    copperTokens():number{
        return Math.floor(this.tokens/TokensWorth.Copper);
    }

    bronzeTokens():number{
        return Math.floor(this.tokens/TokensWorth.Bronze);
    }

    silverTokens():number{
        return Math.floor(this.tokens/TokensWorth.Silver);
    }

    goldTokens():number{
        return Math.floor(this.tokens/TokensWorth.Gold);
    }

    async removeFeature(type:FeatureType):Promise<void>{
        let index = this.features.findIndex(x => x.type == type);
        if(index != -1){
            this.features.splice(index, 1);
            await FighterRepository.persist(this);
        }
        else{
            throw new Error("You don't have this feature, you can't remove it.");
        }
    }

    async addFeature(type:FeatureType, turns:number){
        let feature = new Feature(this.name, type, turns);
        let amountToRemove:number = feature.getCost();

        if(this.tokens - amountToRemove >= 0){
            let index = this.features.findIndex(x => x.type == type);
            if(index == -1){
                this.features.push(feature);
                this.removeTokens(amountToRemove);
                await FighterRepository.logTransaction(this.name, -amountToRemove, TransactionType.Feature);
                await FighterRepository.persist(this);
            }
            else{
                throw new Error("You already have this feature. You have to wait for it to expire before adding another of the same type.");
            }
        }
        else{
            throw new Error(`Not enough tokens. Required: ${amountToRemove}.`);
        }
    }

    async clearFeatures(){
        this.features = [];
        await FighterRepository.persist(this);
    }

    hasFeature(featureType:FeatureType):boolean{
        return this.features.findIndex(x => x.type == featureType) != -1;
    }

    async restat(power:number, sensuality:number, toughness:number, endurance:number, dexterity:number, willpower:number):Promise<boolean>{
        this.power = power;
        this.sensuality = sensuality;
        this.toughness = toughness;
        this.endurance = endurance;
        this.dexterity = dexterity;
        this.willpower = willpower;

        await FighterRepository.persist(this);

        return true;
    }

    giveTokens(amount:number):void{
        this.tokens += amount;
    }

    removeTokens(amount:number):void{
        this.tokens -= amount;
        this.tokensSpent += amount;
        if(this.tokens < 0){
            this.tokens = 0;
        }
    }

    canPayAmount(amount):boolean{
        return (this.tokens - amount >= 0);
    }

    tier():FightTier{
        if(this.wins < 10){
            return FightTier.Bronze;
        }
        else if(this.wins < 30){
            return FightTier.Silver
        }
        else if(this.wins >= 30){
            return FightTier.Gold;
        }
        return FightTier.Bronze;
    }

}