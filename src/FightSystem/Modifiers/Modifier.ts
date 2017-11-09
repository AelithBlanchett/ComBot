import * as Constants from "../Constants";
import Trigger = Constants.Trigger;
import {Utils} from "../../Common/Utils";
import ModifierType = Constants.ModifierType;
import TriggerMoment = Constants.TriggerMoment;
import {Tier} from "../Constants";
import {ActiveFighter} from "../ActiveFighter";
import {IModifier} from "../../Common/IModifier";
import {Fight} from "../Fight";
import {BaseModifier} from "../../Common/BaseModifier";

export class Modifier extends BaseModifier{

    hpDamage: number;
    lustDamage: number;
    focusDamage: number;
    hpHeal: number;
    lustHeal: number;
    focusHeal: number;

    constructor(receiver:string, applier:string, tier:Tier, modType:ModifierType, hpDamage:number, lustDamage:number, focusDamage:number, diceRoll:number, escapeRoll:number, uses:number,
                timeToTrigger:TriggerMoment, event:Trigger, parentActionIds:Array<string>, areMultipliers:boolean){
        super(receiver, applier, tier, modType, diceRoll, escapeRoll, uses, timeToTrigger, event, parentActionIds, areMultipliers);
        this.hpDamage = hpDamage;
        this.lustDamage = lustDamage;
        this.focusDamage = focusDamage;
    }

    applyModifierOnReceiver(moment: TriggerMoment, event:Trigger){
        let messageAboutModifier = "";
        if(this.hpDamage > 0){
            let flagTriggerMods = ((event & Constants.Trigger.HPDamage) == 0);
            messageAboutModifier += ` losing ${this.hpDamage} HP,`;
            this.receiver.hitHP(this.hpDamage, flagTriggerMods);
        }
        if(this.lustDamage > 0){
            let flagTriggerMods = ((event & Constants.Trigger.LustDamage) == 0);
            messageAboutModifier += ` losing ${this.lustDamage} LP,`;
            this.receiver.hitLP(this.lustDamage, flagTriggerMods);
        }
        if(this.focusDamage > 0){
            let flagTriggerMods = ((event & Constants.Trigger.FocusDamage) == 0);
            messageAboutModifier += ` losing ${this.focusDamage} FP,`;
            this.receiver.hitFP(this.focusDamage, flagTriggerMods);
        }
        if(this.hpHeal > 0){
            let flagTriggerMods = ((event & Constants.Trigger.HPHealing) == 0);
            messageAboutModifier += ` gaining ${this.hpHeal} HP,`;
            this.receiver.healHP(this.hpHeal, flagTriggerMods);
        }
        if(this.lustHeal > 0){
            let flagTriggerMods = ((event & Constants.Trigger.LustHealing) == 0);
            messageAboutModifier += ` gaining ${this.lustHeal} LP,`;
            this.receiver.healLP(this.lustHeal, flagTriggerMods);
        }
        if(this.focusHeal > 0){
            let flagTriggerMods = ((event & Constants.Trigger.FocusHealing) == 0);
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
                let flagTriggerMods = !(event & Constants.Trigger.HPDamage);
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
                let flagTriggerMods = !(event & Constants.Trigger.LustDamage);
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
                let flagTriggerMods = !(event & Constants.Trigger.LustDamage);
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
                let flagTriggerMods = !(event & Constants.Trigger.HPHealing);
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
                let flagTriggerMods = !(event & Constants.Trigger.LustHealing);
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
                let flagTriggerMods = !(event & Constants.Trigger.FocusHealing);
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