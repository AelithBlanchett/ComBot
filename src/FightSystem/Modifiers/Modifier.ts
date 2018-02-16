import * as BaseConstants from "../../Common/BaseConstants";
import Trigger = BaseConstants.Trigger;
import {Utils} from "../../Common/Utils";
import TriggerMoment = BaseConstants.TriggerMoment;
import {Tier} from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {IBaseModifier} from "../../Common/IBaseModifier";
import {Fight} from "../Fight";
import {BaseModifier} from "../../Common/BaseModifier";
import {IModifier} from "./IModifier";
import {BaseFight} from "../../Common/BaseFight";
import {ModifierType} from "../RWConstants";

export class Modifier extends BaseModifier implements IModifier{

    hpDamage: number;
    lustDamage: number;
    focusDamage: number;
    hpHeal: number;
    lustHeal: number;
    focusHeal: number;

    fight:Fight;
    applier:ActiveFighter;
    receiver:ActiveFighter;

    constructor(receiver:string, applier:string, tier:Tier, modType:ModifierType, hpDamage:number, lustDamage:number, focusDamage:number, diceRoll:number, escapeRoll:number, uses:number,
                timeToTrigger:TriggerMoment, event:string, parentActionIds:Array<string>, areMultipliers:boolean){
        super(receiver, applier, tier, modType, diceRoll, escapeRoll, uses, timeToTrigger, event, parentActionIds, areMultipliers);
        this.hpDamage = hpDamage;
        this.lustDamage = lustDamage;
        this.focusDamage = focusDamage;
    }

    isAHold():boolean{
        return (this.type == ModifierType.SubHold || this.type == ModifierType.SexHold || this.type == ModifierType.HumHold);
    }

    applyModifierOnReceiver(moment: TriggerMoment, event:string){
        let messageAboutModifier = "";
        if(this.hpDamage > 0){
            let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.HPDamage.toString(), event))
            messageAboutModifier += ` losing ${this.hpDamage} HP,`;
            this.receiver.hitHP(this.hpDamage, flagTriggerMods);
        }
        if(this.lustDamage > 0){
            let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.LustDamage.toString(), event));
            messageAboutModifier += ` losing ${this.lustDamage} LP,`;
            this.receiver.hitLP(this.lustDamage, flagTriggerMods);
        }
        if(this.focusDamage > 0){
            let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.FocusDamage.toString(), event));
            messageAboutModifier += ` losing ${this.focusDamage} FP,`;
            this.receiver.hitFP(this.focusDamage, flagTriggerMods);
        }
        if(this.hpHeal > 0){
            let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.HPHealing.toString(), event));
            messageAboutModifier += ` gaining ${this.hpHeal} HP,`;
            this.receiver.healHP(this.hpHeal, flagTriggerMods);
        }
        if(this.lustHeal > 0){
            let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.LustHealing.toString(), event));
            messageAboutModifier += ` gaining ${this.lustHeal} LP,`;
            this.receiver.healLP(this.lustHeal, flagTriggerMods);
        }
        if(this.focusHeal > 0){
            let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.FocusHealing.toString(), event));
            messageAboutModifier += ` gaining ${this.focusHeal} FP,`;
            this.receiver.healFP(this.focusHeal, flagTriggerMods);
        }
        if(this.diceRoll != 0){
            this.receiver.dice.addTmpMod(this.diceRoll,1);
            if(this.diceRoll > 0){
                messageAboutModifier += ` getting a +${this.diceRoll} bonus for their dice roll,`;
            }
            else{
                messageAboutModifier += ` getting a ${this.diceRoll} penalty for their dice roll,`;
            }
        }

        return messageAboutModifier;
    }

    applyModifierOnAction(moment: TriggerMoment, event:string, objFightAction:any){
        let messageAboutModifier = "";
        let searchedEvent:number = parseInt(event);
        if(this.hpDamage > 0){
            if(this.areDamageMultipliers){
                objFightAction.hpDamage *= this.hpDamage;
                messageAboutModifier += ` multiplying their attack's HP damage by ${this.hpDamage},`;
            }
            else{
                let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.HPDamage.toString(), event));
                messageAboutModifier += ` losing ${this.hpDamage} HP,`;
                this.receiver.hitHP(this.hpDamage, flagTriggerMods);
            }
        }
        if(this.lustDamage > 0){
            if(this.areDamageMultipliers){
                objFightAction.lustDamage *= this.lustDamage;
                messageAboutModifier += ` multiplying their attack's LP damage by ${this.lustDamage},`;
            }
            else {
                let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.LustDamage.toString(), event));
                messageAboutModifier += ` losing ${this.lustDamage} LP,`;
                this.receiver.hitLP(this.lustDamage, flagTriggerMods);
            }
        }
        if(this.focusDamage > 0){
            if(this.areDamageMultipliers){
                objFightAction.focusDamage *= this.focusDamage;
                messageAboutModifier += ` multiplying their attack's FP damage by ${this.focusDamage},`;
            }
            else {
                let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.LustDamage.toString(), event));
                messageAboutModifier += ` losing ${this.focusDamage} LP,`;
                this.receiver.hitFP(this.focusDamage, flagTriggerMods);
            }
        }
        if(this.hpHeal > 0){
            if(this.areDamageMultipliers){
                objFightAction.hpHeal *= this.hpHeal;
                messageAboutModifier += ` multiplying their action's HP healing by ${this.hpHeal},`;
            }
            else{
                let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.HPHealing.toString(), event));
                messageAboutModifier += ` gaining ${this.hpHeal} HP,`;
                this.receiver.healHP(this.hpHeal, flagTriggerMods);
            }
        }
        if(this.lustHeal > 0){
            if(this.areDamageMultipliers){
                objFightAction.lustHeal *= this.lustHeal;
                messageAboutModifier += ` multiplying their action's LP healing by ${this.lustHeal},`;
            }
            else {
                let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.LustHealing.toString(), event));
                messageAboutModifier += ` gaining ${this.lustHeal} LP,`;
                this.receiver.healLP(this.lustHeal, flagTriggerMods);
            }
        }
        if(this.focusHeal > 0){
            if(this.areDamageMultipliers){
                objFightAction.focusHeal *= this.focusHeal;
                messageAboutModifier += ` multiplying their action's FP healing by ${this.focusHeal},`;
            }
            else {
                let flagTriggerMods = !(BaseModifier.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, BaseConstants.Trigger.FocusHealing.toString(), event));
                messageAboutModifier += ` gaining ${this.focusHeal} LP,`;
                this.receiver.healFP(this.focusHeal, flagTriggerMods);
            }
        }
        if(this.diceRoll != 0){
            objFightAction.diceScore += this.diceRoll;
            if(this.diceRoll > 0){
                messageAboutModifier += ` getting a +${this.diceRoll} bonus for their dice roll,`;
            }
            else{
                messageAboutModifier += ` getting a ${this.diceRoll} penalty for their dice roll,`;
            }
        }

        return messageAboutModifier;
    }
}