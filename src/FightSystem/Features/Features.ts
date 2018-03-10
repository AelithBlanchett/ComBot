import {Trigger, TriggerMoment} from "../../Common/BaseConstants";
import {BaseFeature} from "../../Common/Features/BaseFeature";
import {BaseFeatureParameter} from "../../Common/Features/BaseFeatureParameter";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {FeatureType, ModifierType} from "../RWConstants";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {Utils} from "../../Common/Utils/Utils";
import {FeatureParameter} from "./FeatureParameter";

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
                let hpDamageDealt = parameters.action;
                return `multiplying their damage by ${this.lpDamageFromHpMultiplier}!`
            }
            return "";
        }
    }
}

//TODO Re-implement features with the new way
//In action:

// if(this.attacker.hasFeature(Constants.FeatureType.Sadist)){
//     this.lpDamageToAtk += Math.floor(this.hpDamageToDef / 2);
// }
// if(this.attacker.hasFeature(Constants.FeatureType.CumSlut)){
//     if(this.lpDamageToAtk > 0){
//         this.lpDamageToAtk += 3;
//     }
// }
// if(this.attacker.hasFeature(Constants.FeatureType.RyonaEnthusiast)){
//     if(this.hpDamageToAtk > 0){
//         this.lpDamageToAtk += Math.floor(this.hpDamageToAtk / 2);
//     }
// }

//if(defender)
// if(this.defender.hasFeature(Constants.FeatureType.Sadist)){
//     this.lpDamageToDef += Math.floor(this.hpDamageToAtk / 2);
// }
// if(this.defender.hasFeature(Constants.FeatureType.CumSlut)){
//     if(this.lpDamageToDef > 0){
//         this.lpDamageToDef += 3;
//     }
// }
// if(this.defender.hasFeature(Constants.FeatureType.RyonaEnthusiast)){
//     if(this.hpDamageToDef > 0){
//         this.lpDamageToDef += Math.floor(this.hpDamageToDef / 2);
//     }
// }

