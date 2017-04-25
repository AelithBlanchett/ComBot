import * as Constants from "./Constants";
import {FeatureType, Team} from "./Constants";
import {FightTier} from "./Constants";
import {Fight} from "./Fight";
import {Feature} from "./Feature";
import {IAchievement} from "./interfaces/IAchievement";
import {AchievementManager} from "./AchievementManager";
import {ActiveFighter} from "./ActiveFighter";
import {FightLength} from "./Constants";

export class Fighter{

    name:string = "";
    areStatsPrivate:boolean = true;

    dexterity:number = 1;
    power:number = 1;
    sensuality:number = 1;
    toughness:number = 1;
    endurance:number = 1;
    willpower:number = 1;

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

    forfeits:number;
    quits:number;

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

    fightDuration(){
        return FightLength.Long;
    }

    totalHp():number{
        let hp = 130;
        if (this.toughness > 10) {
            hp += (this.toughness - 10);
        }
        switch (this.fightDuration()){
            case FightLength.Epic:
                hp = hp * 1.33;
                break;
            case FightLength.Long:
                //Keep it as it is
                break;
            case FightLength.Medium:
                hp = hp * 0.66;
                break;
            case FightLength.Short:
                hp = hp * 0.33;
                break;
        }
        return hp;
    }

    hpPerHeart():number {
        return Math.ceil(this.totalHp() / this.maxLives());
    }

    totalLust():number{
        let lust = 130;
        if (this.endurance > 10) {
            lust += (this.endurance - 10);
        }
        switch (this.fightDuration()){
            case FightLength.Epic:
                lust = lust * 1.33;
                break;
            case FightLength.Long:
                //Keep it as it is
                break;
            case FightLength.Medium:
                lust = lust * 0.66;
                break;
            case FightLength.Short:
                lust = lust * 0.33;
                break;
        }
        return lust;
    }

    lustPerOrgasm():number {
        return Math.ceil(this.totalLust() / this.maxLives());
    }

    maxLives():number {
        let maxLives = -1;
        switch (this.fightDuration()){
            case FightLength.Epic:
                maxLives = 4;
                break;
            case FightLength.Long:
                maxLives = 3;
                break;
            case FightLength.Medium:
                maxLives = 2;
                break;
            case FightLength.Short:
                maxLives = 1;
                break;
        }
        return maxLives;
    }

    minFocus():number {
        return 0;
    }

    focusResistance():number{
        let resistance = 30;
        if (this.willpower > 10) {
            resistance += (this.willpower - 10);
        }
        return resistance;
    }

    initialFocus():number{
        return this.maxFocus();
    }

    maxFocus():number {
        return 30 + this.focusResistance();
    }

    maxBondageItemsOnSelf():number {
        let maxBondageItemsOnSelf = -1;
        switch (this.fightDuration()){
            case FightLength.Epic:
                maxBondageItemsOnSelf = 5;
                break;
            case FightLength.Long:
                maxBondageItemsOnSelf = 4;
                break;
            case FightLength.Medium:
                maxBondageItemsOnSelf = 3;
                break;
            case FightLength.Short:
                maxBondageItemsOnSelf = 2;
                break;
        }
        return maxBondageItemsOnSelf;
    }

    outputStats():string{
        return "[b]" + this.name + "[/b]'s stats" + "\n" +
            "[b][color=red]Power[/color][/b]:  " + this.power + "      " + "    --             " + this.hpPerHeart() + " [b][color=red]LP[/color] per life[/b] " + this.lustPerOrgasm() +" [b][color=red]LP[/color] per life[/b]"+"\n" +
            "[b][color=purple]Sensuality[/color][/b]:  " + this.sensuality + "      " + "[b][color=pink]Total Lives[/color][/b]: " + this.maxLives() + "\n" +
            "[b][color=orange]Toughness[/color][/b]: " + this.toughness + "\n" +
            "[b][color=cyan]Endurance[/color][/b]: " + this.endurance + "      " + "[b][color=green]Win[/color]/[color=red]Loss[/color] record[/b]: " + this.wins + " - " + this.losses + "\n" +
            "[b][color=green]Dexterity[/color][/b]: " + this.dexterity + "\n" +
            "[b][color=brown]Willpower[/color][/b]: " + this.willpower +  "      " + "[b][color=orange]Tokens[/color][/b]: " + this.tokens + "         [b][color=orange]Total spent[/color][/b]: "+this.tokensSpent+"\n"  +
            "[b][color=red]Features[/color][/b]: [b]" + this.getFeaturesList() + "[/b]\n" +
            "[b][color=yellow]Achievements[/color][/b]: [sub]" + this.getAchievementsList() + "[/sub]\n" +
            `[b][color=white]Fun stats[/color][/b]: [sub]Avg. roll: ${this.averageDiceRoll}, Fav. tag partner: ${(this.favoriteTagPartner != null && this.favoriteTagPartner != "" ? this.favoriteTagPartner : "None!")}, Moves done: ${this.actionsCount}, Nemesis: ${this.nemesis} [/sub]`;
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

    removeFeature(type:FeatureType):void{
        let index = this.features.findIndex(x => x.type == type);
        if(index != -1){
            this.features.splice(index, 1);
        }
        else{
            throw new Error("You don't have this feature, you can't remove it.");
        }
    }

    addFeature(type:FeatureType, turns:number):number{
        let feature = new Feature(this.name, type, turns);
        let amountToRemove:number = feature.getCost();

        if(this.tokens - amountToRemove >= 0){
            let index = this.features.findIndex(x => x.type == type);
            if(index == -1){
                this.features.push(feature);
                this.removeTokens(amountToRemove);
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

    hasFeature(featureType:FeatureType):boolean{
        return this.features.findIndex(x => x.type == featureType) != -1;
    }

    restat(power:number, sensuality:number, toughness:number, endurance:number, dexterity:number, willpower:number){
        this.power = power;
        this.sensuality = sensuality;
        this.toughness = toughness;
        this.endurance = endurance;
        this.dexterity = dexterity;
        this.willpower = willpower;
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