import * as Constants from "./Constants";
import Trigger = Constants.Trigger;
import TriggerMoment = Constants.TriggerMoment;
import {IBaseModifier} from "./IBaseModifier";
import {Tier} from "./Constants";
import {Fight} from "../FightSystem/Fight";
import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {Utils} from "./Utils";
import {BaseFight} from "./BaseFight";
import {BaseActiveFighter} from "./BaseActiveFighter";

export abstract class BaseModifier implements IBaseModifier{
    idModifier: string;
    idFight:string;
    tier:Tier;
    type:Constants.ModifierType;
    idApplier:string;
    idReceiver:string;

    areDamageMultipliers: boolean = false;
    diceRoll: number;
    escapeRoll: number;
    uses: number;
    event:string;
    timeToTrigger:TriggerMoment;
    idParentActions:Array<string>;

    fight:BaseFight;
    applier:BaseActiveFighter;
    receiver:BaseActiveFighter;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

    constructor(receiver:string, applier:string, tier:Tier, modType:Constants.ModifierType, diceRoll:number, escapeRoll:number, uses:number,
                timeToTrigger:TriggerMoment, event:string, parentActionIds:Array<string>, areMultipliers:boolean){
        this.idModifier = Utils.generateUUID();
        this.idReceiver = receiver;
        this.idApplier = applier;
        this.tier = tier;
        this.type = modType;
        this.diceRoll = diceRoll;
        this.escapeRoll = escapeRoll; //unused
        this.uses = uses;
        this.event = event;
        this.timeToTrigger = timeToTrigger;
        this.idParentActions = parentActionIds;
        this.areDamageMultipliers = areMultipliers;
    }

    build(receiver:BaseActiveFighter, applier:BaseActiveFighter, fight:BaseFight){
        this.receiver = receiver;
        this.applier = applier;
        this.fight = fight;
        this.idFight = fight.idFight;
    }

    isOver():boolean{
        return (this.uses <= 0); //note: removed "|| this.receiver.isTechnicallyOut()" in latest patch. may break things.
    }

    remove():void{
        let indexModReceiver = this.receiver.modifiers.findIndex(x => x.idModifier == this.idModifier);
        if (indexModReceiver != -1) {
            this.receiver.modifiers.splice(indexModReceiver, 1);
        }

        if(this.applier != null){
            let indexModApplier = this.applier.modifiers.findIndex(x => x.idModifier == this.idModifier);
            if (indexModApplier != -1) {
                this.applier.modifiers.splice(indexModApplier, 1);
            }
        }


        for (let mod of this.receiver.modifiers) {
            if (mod.idParentActions) {
                if (mod.idParentActions.length == 1 && mod.idParentActions[0] == this.idModifier) {
                    mod.remove();
                }
                else if (mod.idParentActions.indexOf(this.idModifier) != -1) {
                    mod.idParentActions.splice(mod.idParentActions.indexOf(this.idModifier), 1);
                }
            }
        }

        if(this.applier != null) {
            for (let mod of this.applier.modifiers) {
                if (mod.idParentActions) {
                    if (mod.idParentActions.length == 1 && mod.idParentActions[0] == this.idModifier) {
                        mod.remove();
                    }
                    else if (mod.idParentActions.indexOf(this.idModifier) != -1) {
                        mod.idParentActions.splice(mod.idParentActions.indexOf(this.idModifier), 1);
                    }
                }
            }
        }

    }

    static willTriggerForEvent(checkedMoment: TriggerMoment, searchedMoment:TriggerMoment, checkedEvent:string, searchedEvent:string):boolean{
        let canPass = false;

        let checkedEventNumber:number = parseInt(checkedEvent);
        let searchedEventNumber:number = parseInt(searchedEvent);
        let isNumber = (!isNaN(checkedEventNumber) && !isNaN(searchedEventNumber));

        if(isNumber){
            if(checkedEventNumber & searchedEventNumber){
                if(checkedMoment & searchedMoment){
                    canPass = true;
                }
            }
        }
        else {
            if (checkedEvent == searchedEvent) {
                if (checkedMoment == searchedMoment) {
                    canPass = true;
                }
            }
        }
        return canPass;
    }

    trigger(moment: TriggerMoment, event:string, objFightAction?:any):string{
        let messageAboutModifier:string = "";

        if(BaseModifier.willTriggerForEvent(this.timeToTrigger, moment, this.event, event)){
            this.uses--;
            messageAboutModifier = `${this.receiver.getStylizedName()} is affected by the ${this.type}, `;
            if(!objFightAction){
                messageAboutModifier += this.applyModifierOnReceiver(moment, event);
            }
            else{
                messageAboutModifier += this.applyModifierOnAction(moment, event, objFightAction);
            }

            if(this.isOver()){
                for(let fighter of this.fight.fighters){
                    fighter.removeMod(this.idModifier);
                }
                messageAboutModifier += ` and it is now expired.`;
            }
            else{
                messageAboutModifier += ` still effective for ${this.uses} more turns.`;
            }

            this.fight.message.addSpecial(messageAboutModifier);
        }

        return messageAboutModifier;
    }

    abstract applyModifierOnReceiver(moment: TriggerMoment, event:string);
    abstract applyModifierOnAction(moment: TriggerMoment, event:string, objFightAction:any);
    abstract isAHold():boolean;

}