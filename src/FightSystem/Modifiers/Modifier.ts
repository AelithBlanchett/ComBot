import * as BaseConstants from "../../Common/Constants/BaseConstants";
import {RWFighterState} from "../Fight/RWFighterState";
import {RWFight} from "../Fight/RWFight";
import {BaseModifier} from "../../Common/Modifiers/BaseModifier";
import {IModifier} from "./IModifier";
import {ModifierType} from "../RWConstants";
import {Utils} from "../../Common/Utils/Utils";
import {TriggerMoment} from "../../Common/Constants/TriggerMoment";
import {Trigger} from "../../Common/Constants/Trigger";

export class Modifier extends BaseModifier implements IModifier{

    hpDamage: number;
    lustDamage: number;
    focusDamage: number;
    hpHeal: number;
    lustHeal: number;
    focusHeal: number;

    fight:RWFight;
    applier:RWFighterState;
    receiver:RWFighterState;


    isAHold():boolean{
        return (this.name == ModifierType.SubHold || this.name == ModifierType.SexHold || this.name == ModifierType.HumHold);
    }

    applyModifierOnReceiver(moment: TriggerMoment, event:Trigger){
        let messageAboutModifier = "";
        if(this.hpDamage > 0){
            let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.MainBarDamage, event))
            messageAboutModifier += ` losing ${this.hpDamage} HP,`;
            this.receiver.hitHP(this.hpDamage, flagTriggerMods);
        }
        if(this.lustDamage > 0){
            let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.SecondaryBarDamage, event));
            messageAboutModifier += ` losing ${this.lustDamage} LP,`;
            this.receiver.hitLP(this.lustDamage, flagTriggerMods);
        }
        if(this.focusDamage > 0){
            let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.UtilitaryBarDamage, event));
            messageAboutModifier += ` losing ${this.focusDamage} FP,`;
            this.receiver.hitFP(this.focusDamage, flagTriggerMods);
        }
        if(this.hpHeal > 0){
            let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.MainBarHealing, event));
            messageAboutModifier += ` gaining ${this.hpHeal} HP,`;
            this.receiver.healHP(this.hpHeal, flagTriggerMods);
        }
        if(this.lustHeal > 0){
            let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.SecondaryBarHealing, event));
            messageAboutModifier += ` gaining ${this.lustHeal} LP,`;
            this.receiver.healLP(this.lustHeal, flagTriggerMods);
        }
        if(this.focusHeal > 0){
            let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.UtilitaryBarHealing, event));
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

    applyModifierOnAction(moment: TriggerMoment, event:Trigger, objFightAction:any){
        let messageAboutModifier = "";
        if(this.hpDamage > 0){
            if(this.areDamageMultipliers){
                objFightAction.hpDamage *= this.hpDamage;
                messageAboutModifier += ` multiplying their attack's HP damage by ${this.hpDamage},`;
            }
            else{
                let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.MainBarDamage, event));
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
                let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.SecondaryBarDamage, event));
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
                let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.UtilitaryBarDamage, event));
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
                let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.MainBarHealing, event));
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
                let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.SecondaryBarHealing, event));
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
                let flagTriggerMods = !(Utils.willTriggerForEvent(TriggerMoment.Any, TriggerMoment.Any, Trigger.UtilitaryBarHealing, event));
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