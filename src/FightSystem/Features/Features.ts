import {FeatureType, ModifierType, Trigger, TriggerMoment} from "../../Common/Constants";
import {BaseFeature} from "../../Common/BaseFeature";
import {BaseFeatureParameter} from "../../Common/BaseFeatureParameter";
import {ModifierFactory} from "../Modifiers/ModifierFactory";

export namespace Feature{
    export class BondageBunny extends BaseFeature{

        constructor(){
            super(FeatureType.BondageBunny);
        }

        applyFeature(moment: TriggerMoment, event:Trigger, parameters?:BaseFeatureParameter):string{
            return "";
        }
    }

    export class KickStart extends BaseFeature{

        hpDamageMultiplier:number;

        constructor(){
            super(FeatureType.KickStart);
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

