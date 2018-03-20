import {BaseFeature} from "../../Common/Features/BaseFeature";
import {BaseFeatureParameter} from "../../Common/Features/BaseFeatureParameter";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {FeatureType, ModifierType} from "../RWConstants";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {Utils} from "../../Common/Utils/Utils";
import {FeatureParameter} from "./FeatureParameter";
import {TriggerMoment} from "../../Common/Constants/TriggerMoment";
import {Trigger} from "../../Common/Constants/Trigger";

export namespace Feature{
    export class BondageBunny extends BaseFeature{

        constructor(receiver:ActiveFighter, uses:number, id?:string){
            super(FeatureType.BondageBunny, receiver, uses, id);
        }

        getCost():number{
            return 0;
        }

        applyFeature(moment: TriggerMoment, event:Trigger, parameters?:BaseFeatureParameter):string{
            return "";
        }
    }

    export class KickStart extends BaseFeature{

        readonly hpDamageMultiplier:number = 1.5;

        constructor(receiver:ActiveFighter, uses:number, id?:string){
            super(FeatureType.KickStart, receiver, uses, id);
        }

        getCost():number{
            return this.uses * 5;
        }

        applyFeature(moment: TriggerMoment, event:Trigger, parameters?:BaseFeatureParameter):string{
            if(Utils.willTriggerForEvent(moment, TriggerMoment.After, event, Trigger.InitiationRoll)){
                if(parameters.fighter != null){
                    let modifier = ModifierFactory.getModifier(ModifierType.ItemPickupBonus, parameters.fight, parameters.fighter, null,{uses: 1});
                    parameters.fighter.modifiers.push(modifier);
                    return `multiplying their damage by ${this.hpDamageMultiplier}!`
                }
            }
            return "";
        }
    }

    export class Sadist extends BaseFeature{

        readonly lpDamageFromHpMultiplier:number = 0.5;

        constructor(receiver:ActiveFighter, uses:number, id?:string){
            super(FeatureType.Sadist, receiver, uses, id);
        }

        getCost():number{
            return this.uses * 5;
        }

        applyFeature(moment: TriggerMoment, event:Trigger, parameters?:FeatureParameter):string{
            if(Utils.willTriggerForEvent(moment, TriggerMoment.After, event, Trigger.Attack)){
                if(parameters.action.attacker.name == this.receiver.name && parameters.action.avgHpDamageToDefs > 0){
                    parameters.action.lpDamageToAtk = Math.floor(parameters.action.avgHpDamageToDefs * this.lpDamageFromHpMultiplier);
                    return `returning some of the HP damage dealt for a total of ${this.lpDamageFromHpMultiplier}LP!`
                }

            }
            return "";
        }
    }

    export class CumSlut extends BaseFeature{

        readonly additionalLPDamage:number = 3;

        constructor(receiver:ActiveFighter, uses:number, id?:string){
            super(FeatureType.CumSlut, receiver, uses, id);
        }

        getCost():number{
            return this.uses * 5;
        }

        applyFeature(moment: TriggerMoment, event:Trigger, parameters?:FeatureParameter):string{
            if(Utils.willTriggerForEvent(moment, TriggerMoment.After, event, Trigger.Attack)){
                if(parameters.action.attacker.name == this.receiver.name && parameters.action.lpDamageToAtk > 0){
                    parameters.action.lpDamageToAtk += this.additionalLPDamage;
                    return `dealing more LP Damage (+${this.additionalLPDamage}LP)`;
                }
                else if(parameters.action.avgLpDamageToDefs > 0){
                    let defenderIndex = parameters.action.defenders.findIndex(x => x.name == this.receiver.name);
                    if(defenderIndex != -1){
                        parameters.action.lpDamageToDefs[defenderIndex] += this.additionalLPDamage;
                    }
                    return `dealing more LP Damage (+${this.additionalLPDamage}LP)`;
                }

            }
            return "";
        }
    }

    export class RyonaEnthusiast extends BaseFeature{

        readonly lpDamageFromHpMultiplier:number = 0.5;

        constructor(receiver:ActiveFighter, uses:number, id?:string){
            super(FeatureType.RyonaEnthusiast, receiver, uses, id);
        }

        getCost():number{
            return this.uses * 5;
        }

        applyFeature(moment: TriggerMoment, event:Trigger, parameters?:FeatureParameter):string{
            if(Utils.willTriggerForEvent(moment, TriggerMoment.After, event, Trigger.Attack)){
                if(parameters.action.avgHpDamageToDefs > 0){
                    let addedLPs = 0;
                    let defenderIndex = parameters.action.defenders.findIndex(x => x.name == this.receiver.name);
                    if(defenderIndex != -1){
                        addedLPs = (parameters.action.hpDamageToDefs[defenderIndex] * this.lpDamageFromHpMultiplier);
                        parameters.action.lpDamageToDefs[defenderIndex] += addedLPs;
                    }
                    return `converting some of the HP damage to LP! (+${addedLPs}LP)`;
                }

            }
            return "";
        }
    }
}
