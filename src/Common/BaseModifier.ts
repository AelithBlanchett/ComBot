import * as Constants from "../FightSystem/Constants";
import Trigger = Constants.Trigger;
import TriggerMoment = Constants.TriggerMoment;
import {IBaseModifier} from "./IBaseModifier";
import {Tier} from "../FightSystem/Constants";
import {Fight} from "../FightSystem/Fight";
import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {Utils} from "./Utils";

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
    event:Trigger;
    timeToTrigger:TriggerMoment;
    idParentActions:Array<string>;

    fight:Fight;
    applier:ActiveFighter;
    receiver:ActiveFighter;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

    constructor(receiver:string, applier:string, tier:Tier, modType:Constants.ModifierType, diceRoll:number, escapeRoll:number, uses:number,
                timeToTrigger:TriggerMoment, event:Trigger, parentActionIds:Array<string>, areMultipliers:boolean){
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

    build(receiver:ActiveFighter, applier:ActiveFighter, fight:Fight){
        this.receiver = receiver;
        this.applier = applier;
        this.fight = fight;
        this.idFight = fight.idFight;
    }

    isOver():boolean{
        return (this.uses <= 0 || this.receiver.isDead());
    }

    willTriggerForEvent(moment: TriggerMoment, event:Trigger):boolean{
        let canPass = false;
        if(event & this.event){
            if(moment & this.timeToTrigger){
                canPass = true;
            }
        }
        return canPass;
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

    trigger(moment: TriggerMoment, event:Trigger, objFightAction?:any):void{
        if(this.willTriggerForEvent(moment, event)){
            this.uses--;
            let messageAboutModifier:string = `${this.receiver.getStylizedName()} is affected by the ${this.type}, `;
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
    }

    applyModifierOnReceiver(moment: TriggerMoment, event:Trigger){

    }

    applyModifierOnAction(moment: TriggerMoment, event:Trigger, objFightAction:any){

    }
}