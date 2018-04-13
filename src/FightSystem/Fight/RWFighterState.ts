import "reflect-metadata";
import {Utils} from "../../Common/Utils/Utils";
import {BaseFighterState} from "../../Common/Fight/BaseFighterState";
import {Parser} from "../../Common/Utils/Parser";
import {Modifier} from "../Modifiers/Modifier";
import {FeatureType, ModifierType} from "../RWConstants";
import {GameSettings} from "../../Common/Configuration/GameSettings";
import {FightLength} from "../../Common/Constants/FightLength";
import {TriggerMoment} from "../../Common/Constants/TriggerMoment";
import {Trigger} from "../../Common/Constants/Trigger";
import {FightType} from "../../Common/Constants/FightType";
import {TransactionType} from "../../Common/Constants/TransactionType";
import {RWGameSettings} from "../Configuration/RWGameSettings";
import {ChildEntity, Column, Entity, JoinColumn, OneToOne} from "typeorm";
import {Stats} from "../Constants/Stats";
import {BaseFight} from "../../Common/Fight/BaseFight";
import {BaseUser} from "../../Common/Fight/BaseUser";
import {RWFight} from "./RWFight";
import {RWUser} from "./RWUser";

@ChildEntity("rw")
export class RWFighterState extends BaseFighterState{

    @Column()
    hp:number = 0;
    @Column()
    lust:number = 0;
    @Column()
    livesRemaining:number = 0;
    @Column()
    focus:number = 0;
    @Column()
    consecutiveTurnsWithoutFocus:number;

    @Column()
    startingPower:number;
    @Column()
    startingSensuality:number;
    @Column()
    startingToughness:number;
    @Column()
    startingEndurance:number;
    @Column()
    startingDexterity:number;
    @Column()
    startingWillpower:number;
    @Column()
    powerDelta:number;
    @Column()
    sensualityDelta:number;
    @Column()
    toughnessDelta:number;
    @Column()
    enduranceDelta:number;
    @Column()
    dexterityDelta:number;
    @Column()
    willpowerDelta:number;

    @Column()
    hpDamageLastRound: number = 0;
    @Column()
    lpDamageLastRound: number = 0;
    @Column()
    fpDamageLastRound: number = 0;
    @Column()
    hpHealLastRound: number = 0;
    @Column()
    lpHealLastRound: number = 0;
    @Column()
    fpHealLastRound: number = 0;
    @Column()
    heartsDamageLastRound: number = 0;
    @Column()
    orgasmsDamageLastRound: number = 0;
    @Column()
    heartsHealLastRound: number = 0;
    @Column()
    orgasmsHealLastRound: number = 0;

    modifiers:Modifier[];

    user:RWUser;

    constructor(fight:RWFight, user:RWUser){
        super(fight, user);
        this.startingToughness = user.toughness;
        this.startingEndurance = user.endurance;
        this.startingWillpower = user.willpower;
        this.startingSensuality = user.sensuality;
        this.startingPower = user.power;
        this.startingDexterity = user.dexterity;

        this.hp = this.hpPerHeart();
        this.lust = 0;
        this.livesRemaining = this.maxLives();
        this.focus = this.initialFocus();
        this.consecutiveTurnsWithoutFocus = 0;

        this.powerDelta = 0;
        this.sensualityDelta = 0;
        this.toughnessDelta = 0;
        this.enduranceDelta = 0;
        this.dexterityDelta = 0;
        this.willpowerDelta = 0;

        this.hpDamageLastRound = 0;
        this.lpDamageLastRound = 0;
        this.fpDamageLastRound = 0;
        this.hpHealLastRound = 0;
        this.lpHealLastRound = 0;
        this.fpHealLastRound = 0;
        this.heartsDamageLastRound = 0;
        this.orgasmsDamageLastRound = 0;
        this.heartsHealLastRound = 0;
        this.orgasmsHealLastRound = 0;
    }

    initialFocus():number{
        return this.maxFocus();
    }

    maxFocus():number {
        return 30 + this.focusResistance();
    }

    totalHp():number{
        let hp = 130;
        if (this.currentToughness > 10) {
            hp += (this.currentToughness - 10);
        }
        switch (this.fightDuration()){
            case FightLength.Epic:
                hp = hp * 1.33;
                break;
            case FightLength.Long:
                hp = hp * 1.00;
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
        if (this.currentEndurance > 10) {
            lust += (this.currentEndurance - 10);
        }
        switch (this.fightDuration()){
            case FightLength.Epic:
                lust = lust * 1.33;
                break;
            case FightLength.Long:
                lust = lust * 1.00;
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
        if (this.currentWillpower > 10) {
            resistance += (this.currentWillpower - 10);
        }
        return resistance;
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

    getStatsInString():string{
        return `${this.user.power},${this.user.sensuality},${this.user.toughness},${this.user.endurance},${this.user.dexterity},${this.user.willpower}`;
    }

    //fight is "mistakenly" set as optional to be compatible with the super.init
    initialize():void {
        super.initialize();
        this.startingToughness = this.user.toughness;
        this.startingEndurance = this.user.endurance;
        this.startingWillpower = this.user.willpower;
        this.startingSensuality = this.user.sensuality;
        this.startingPower = this.user.power;
        this.startingDexterity = this.user.dexterity;

        this.hp = this.hpPerHeart();
        this.lust = 0;
        this.livesRemaining = this.maxLives();
        this.focus = this.initialFocus();

        this.powerDelta = 0;
        this.sensualityDelta = 0;
        this.toughnessDelta = 0;
        this.enduranceDelta = 0;
        this.dexterityDelta = 0;
        this.willpowerDelta = 0;
    }

    validateStats():string{
        let statsInString = this.getStatsInString();
        return Parser.checkIfValidStats(statsInString, GameSettings.numberOfRequiredStatPoints, GameSettings.numberOfDifferentStats, GameSettings.minStatLimit, GameSettings.maxStatLimit);
    }

    get currentPower():number{
        return this.startingPower + this.powerDelta;
    }

    set currentPower(delta:number){
        this.powerDelta += delta;
    }

    get currentSensuality():number{
        return this.startingSensuality + this.sensualityDelta;
    }

    set currentSensuality(delta:number){
        this.sensualityDelta += delta;
    }

    get currentToughness():number{
        return this.startingToughness + this.toughnessDelta;
    }

    set currentToughness(delta:number){
        this.toughnessDelta += delta;
    }

    get currentEndurance():number{
        return this.startingEndurance + this.enduranceDelta;
    }

    set currentEndurance(delta:number){
        this.enduranceDelta += delta;
    }

    get currentDexterity():number{
        return this.startingDexterity + this.dexterityDelta;
    }

    set currentDexterity(delta:number){
        this.dexterityDelta += delta;
    }

    get currentWillpower():number{
        return this.startingWillpower + this.willpowerDelta;
    }

    set currentWillpower(delta:number){
        this.willpowerDelta += delta;
    }

    get livesDamageLastRound():number{
        return this.heartsDamageLastRound + this.orgasmsDamageLastRound;
    }

    get livesHealLastRound():number{
        return this.heartsHealLastRound + this.orgasmsHealLastRound;
    }

    get displayRemainingLives():string{
        let str = "";
        for(let i = 1; i <= this.maxLives(); i++){
            if(i < this.livesRemaining){
                str += "❤️";
            }
            else if(i == this.livesRemaining){
                str += "💓";
            }
            else{
                str += "🖤";
            }
        }
        return str;
    }

    nextRound(){
        super.nextRound();
        this.hpDamageLastRound = 0;
        this.lpDamageLastRound = 0;
        this.fpDamageLastRound = 0;
        this.hpHealLastRound = 0;
        this.lpHealLastRound = 0;
        this.fpHealLastRound = 0;

        this.heartsDamageLastRound = 0;
        this.orgasmsDamageLastRound = 0;
        this.heartsHealLastRound = 0;
        this.orgasmsHealLastRound = 0;
    }

    healHP(hp:number, triggerMods:boolean = true) {
        hp = Math.floor(hp);
        if (hp < 1) {
            hp = 1;
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.MainBarHealing);
        }
        if (this.hp + hp > this.hpPerHeart()) {
            hp = this.hpPerHeart() - this.hp; //reduce the number if it overflows the bar
        }
        this.hp += hp;
        this.hpHealLastRound += hp;
        if (triggerMods) {
            this.triggerMods(TriggerMoment.After, Trigger.MainBarHealing);
        }
    }

    healLP(lust:number, triggerMods:boolean = true) {
        lust = Math.floor(lust);
        if (lust < 1) {
            lust = 1;
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.SecondaryBarHealing);
        }
        if (this.lust - lust < 0) {
            lust = this.lust; //reduce the number if it overflows the bar
        }
        this.lust -= lust;
        this.lpHealLastRound += lust;
        if (triggerMods) {
            this.triggerMods(TriggerMoment.After, Trigger.SecondaryBarHealing);
        }
    }

    healFP(focus:number, triggerMods:boolean = true) {
        focus = Math.floor(focus);
        if (focus < 1) {
            focus = 1;
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.UtilitaryBarHealing);
        }
        if (this.focus + focus > this.maxFocus()) {
            focus = this.maxFocus() - this.focus; //reduce the number if it overflows the bar
        }
        this.focus += focus;
        this.fpHealLastRound += focus;
        if (triggerMods) {
            this.triggerMods(TriggerMoment.After, Trigger.UtilitaryBarHealing);
        }
    }

    hitHP(hp:number, triggerMods:boolean = true) {
        hp = Math.floor(hp);
        if (hp < 1) {
            hp = 1;
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.MainBarDamage);
        }
        this.hp -= hp;
        this.hpDamageLastRound += hp;
        if (this.hp <= 0) {
            this.triggerMods(TriggerMoment.Before, Trigger.MainBarDepleted);
            this.hp = 0;
            //this.heartsRemaining--;
            this.livesRemaining--;
            this.heartsDamageLastRound += 1;
            this.fight.message.addHit(`[b][color=red]Heart broken![/color][/b] ${this.name} has ${this.livesRemaining} lives left.`);
            if (this.livesRemaining > 0) {
                this.hp = this.hpPerHeart();
            }
            else if (this.livesRemaining == 1) {
                this.fight.message.addHit(`[b][color=red]Last life[/color][/b] for ${this.name}!`);
            }
            this.triggerMods(TriggerMoment.After, Trigger.MainBarDepleted);
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.After, Trigger.MainBarDamage);
        }
    }

    hitLP(lust:number, triggerMods:boolean = true) {
        lust = Math.floor(lust);
        if (lust < 1) {
            lust = 1;
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.SecondaryBarDamage);
        }
        this.lust += lust;
        this.lpDamageLastRound += lust;
        if (this.lust >= this.lustPerOrgasm()) {
            this.triggerMods(TriggerMoment.Before, Trigger.SecondaryBarDepleted);
            this.lust = 0;
            //this.orgasmsRemaining--;
            this.livesRemaining--;
            this.orgasmsDamageLastRound += 1;
            this.fight.message.addHit(`[b][color=pink]Orgasm on the mat![/color][/b] ${this.name} has ${this.livesRemaining} lives left.`);
            this.lust = 0;
            if (triggerMods) {
                this.triggerMods(TriggerMoment.After, Trigger.SecondaryBarDepleted);
            }
            if (this.livesRemaining == 1) {
                this.fight.message.addHit(`[b][color=red]Last life[/color][/b] for ${this.name}!`);
            }
        }
        this.triggerMods(TriggerMoment.After, Trigger.SecondaryBarDamage);
    }

    hitFP(focusDamage:number, triggerMods:boolean = true) {
        if (focusDamage <= 0) {
            return;
        }
        focusDamage = Math.floor(focusDamage);
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.UtilitaryBarDamage);
        }
        this.focus -= focusDamage;
        this.fpDamageLastRound += focusDamage;
        if (triggerMods) {
            this.triggerMods(TriggerMoment.After, Trigger.UtilitaryBarDamage);
        }
    }

    isDead(displayMessage:boolean = false):boolean {
        let condition = (this.livesRemaining == 0);
        if(condition && displayMessage){
            this.fight.message.addHit(`${this.getStylizedName()} couldn't take it anymore! They're out!`);
        }
        return condition;
    }

    isSexuallyExhausted(displayMessage:boolean = false):boolean {
        let condition = (this.livesRemaining == 0);
        if(condition && displayMessage){
            this.fight.message.addHit(`${this.getStylizedName()} got wrecked sexually! They're out!`);
        }
        return condition;
    }

    isBroken(displayMessage:boolean = false):boolean {
        let condition = (this.consecutiveTurnsWithoutFocus >= RWGameSettings.maxTurnsWithoutFocus);
        if(condition && displayMessage){
            this.fight.message.addHit(`${this.getStylizedName()} completely lost their focus! They're out!`);
        }
        return condition;
    }

    isCompletelyBound(displayMessage:boolean = false):boolean {
        let condition = (this.bondageItemsOnSelf() >= this.maxBondageItemsOnSelf());
        if(condition && displayMessage){
            this.fight.message.addHit(`${this.getStylizedName()} is completely bound! They're out!`);
        }
        return condition;
    }

    isTechnicallyOut(displayMessage = false):boolean {
        switch (this.fight.fightType) {
            case FightType.Classic:
            case FightType.Tag:
                return (
                this.isSexuallyExhausted(displayMessage)
                || this.isDead(displayMessage)
                || this.isBroken(displayMessage)
                || this.isCompletelyBound(displayMessage));
            case FightType.LastManStanding:
                return this.isDead(displayMessage);
            case FightType.SexFight:
                return this.isSexuallyExhausted(displayMessage);
            case FightType.Humiliation:
                return this.isBroken(displayMessage) || this.isCompletelyBound(displayMessage);
            case FightType.Bondage:
                return this.isCompletelyBound(displayMessage);
            default:
                return false;
        }

    }

    bondageItemsOnSelf():number {
        let bondageModCount = 0;
        for (let mod of this.modifiers) {
            if (mod.name == ModifierType.Bondage) {
                bondageModCount++;
            }
        }
        return bondageModCount;
    }

    outputStatus() {
        let nameLine = `${this.getStylizedName()}:`;
        let hpLine = `  [color=yellow]hit points: ${this.hp}${((this.hpDamageLastRound > 0 || this.hpHealLastRound > 0) ? `${(((-this.hpDamageLastRound + this.hpHealLastRound) < 0) ? "[color=red]" : "[color=green]")} (${Utils.getSignedNumber(-this.hpDamageLastRound + this.hpHealLastRound)})[/color]` : "")}|${this.hpPerHeart()}[/color] `;
        let lpLine = `  [color=pink]lust points: ${this.lust}${((this.lpDamageLastRound > 0 || this.lpHealLastRound > 0) ? `${(((-this.lpDamageLastRound + this.lpHealLastRound) < 0) ? "[color=red]" : "[color=green]")} (${Utils.getSignedNumber(this.lpDamageLastRound - this.lpHealLastRound)})[/color]` : "")}|${this.lustPerOrgasm()}[/color] `;
        let livesLine = `  [color=red]lives: ${this.displayRemainingLives}${((this.orgasmsDamageLastRound > 0 || this.orgasmsHealLastRound > 0) ? `${(((-this.orgasmsDamageLastRound + this.orgasmsHealLastRound) < 0) ? "[color=red]" : "[color=green]")} (${Utils.getSignedNumber(-this.orgasmsDamageLastRound + this.orgasmsHealLastRound)} orgasm(s))[/color]` : "")}${((this.heartsDamageLastRound > 0 || this.heartsHealLastRound > 0) ? `${(((-this.heartsDamageLastRound + this.heartsHealLastRound) < 0) ? "[color=red]" : "[color=green]")}  (${Utils.getSignedNumber(-this.heartsDamageLastRound + this.heartsHealLastRound)} heart(s))[/color]` : "")}(${this.livesRemaining}|${this.maxLives()})[/color] `;
        let focusLine = `  [color=orange]${this.user.hasFeature(FeatureType.DomSubLover) ? "submissiveness" : "focus"}:[/color] [b][color=${(this.focus <= 0 ? "red" : "orange")}]${this.focus}[/color][/b]${(((this.fpDamageLastRound > 0 || this.fpHealLastRound > 0) && (this.fpDamageLastRound - this.fpHealLastRound != 0)) ? `${(((-this.fpDamageLastRound + this.fpHealLastRound) < 0) ? "[color=red]" : "[color=green]")} (${Utils.getSignedNumber(-this.fpDamageLastRound + this.fpHealLastRound)})[/color]` : "")}|[color=green]${this.maxFocus()}[/color] `;
        let turnsFocusLine = `  [color=orange]turns ${this.user.hasFeature(FeatureType.DomSubLover) ? "being too submissive" : "without focus"}: ${this.consecutiveTurnsWithoutFocus}|${RWGameSettings.maxTurnsWithoutFocus}[/color] `;
        let bondageLine = `  [color=purple]bondage items ${this.bondageItemsOnSelf()}|${RWGameSettings.maxBondageItemsOnSelf}[/color] `;
        let modifiersLine = `  [color=cyan]affected by: ${this.getListOfActiveModifiers()}[/color] `;
        let targetLine = `  [color=red]target(s): ` + ((this.targets != null && this.targets.length > 0) ? `${this.targets.join(",").toString()}` : "None set yet! (!targets charactername)") + `[/color]`;

        return `${Utils.pad(50, nameLine, "-")} ${hpLine} ${lpLine} ${livesLine} ${focusLine} ${turnsFocusLine} ${bondageLine} ${(this.getListOfActiveModifiers().length > 0 ? modifiersLine : "")} ${targetLine}`;
    }
}