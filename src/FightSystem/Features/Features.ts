import {Trigger, TriggerMoment} from "../../Common/BaseConstants";
import {BaseFeature} from "../../Common/Features/BaseFeature";
import {BaseFeatureParameter} from "../../Common/Features/BaseFeatureParameter";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {FeatureType, ModifierType} from "../RWConstants";

export namespace Feature{
    export class BondageBunny extends BaseFeature{

        constructor(){
            //TODO FIX THIS
            super(FeatureType.BondageBunny, null);
        }

        getCost():number{
            return 0; //TODO FIX THIS
        }

        applyFeature(moment: TriggerMoment, event:Trigger, parameters?:BaseFeatureParameter):string{
            return "";
        }
    }

    export class KickStart extends BaseFeature{

        hpDamageMultiplier:number;

        constructor(){
            //TODO FIX THIS
            super(FeatureType.KickStart, null);
        }

        getCost():number{
            return 0; //TODO FIX THIS
        }

        applyFeature(moment: TriggerMoment, event:Trigger, parameters?:BaseFeatureParameter):string{
            if(moment == TriggerMoment.After && event == Trigger.InitiationRoll){
                if(parameters.fighter != null){
                    let modifier = ModifierFactory.getModifier(ModifierType.ItemPickupBonus, parameters.fight, parameters.fighter, null,{uses: 1});
                    parameters.fighter.modifiers.push(modifier);
                    return `multiplying their damage by ${this.hpDamageMultiplier}!`
                }
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

