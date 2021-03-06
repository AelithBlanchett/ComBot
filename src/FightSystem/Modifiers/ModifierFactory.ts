import * as BaseConstants from "../../Common/Constants/BaseConstants";
import {Modifier} from "./Modifier";
import {Utils} from "../../Common/Utils/Utils";
import {BaseFight} from "../../Common/Fight/BaseFight";
import {BaseFighterState} from "../../Common/Fight/BaseFighterState";
import {Tiers} from "../Constants/Tiers";
import {ModifierType} from "../RWConstants";
import * as modifiersList from "./modifiers.json";
import {Trigger} from "../../Common/Constants/Trigger";
import {TriggerMoment} from "../../Common/Constants/TriggerMoment";

export class ModifierFactory{

    static checkAndInitializeDefaultValues(indexOfSearchedModifier:number, modifierName:string, parameters:any){
        if(ModifierType[modifierName] == null){
            throw new Error("This modifier doesn't exist in the ModifierType list.");
        }

        if(parameters == null){
            parameters = {};
        }

        //Merges the properties found in the json config file with our custom parameters object
        Utils.mergeFromTo(modifiersList[indexOfSearchedModifier], parameters);

        parameters.type = ModifierType[modifierName];
        parameters.tier = parameters.tier || Tiers.None;
        parameters.hpDamage = parameters.hpDamage || 0;
        parameters.lustDamage = parameters.lustDamage || 0;
        parameters.focusDamage = parameters.focusDamage || 0;
        parameters.diceRoll = parameters.diceRoll || 0;
        parameters.escapeRoll = parameters.escapeRoll || 0;
        parameters.uses = parameters.uses || 0;
        parameters.areDamageMultipliers = false;

        //Convert textual event to its equivalent in the code
        let eventFound = false;

        if(parameters.sEvent != null){
            let listOfEvents = Utils.getEnumList(Trigger);
            for(let trigger in listOfEvents){
                if(listOfEvents[trigger].toLowerCase() == parameters.sEvent.toLowerCase()){
                    parameters.event = Trigger[listOfEvents[trigger]];
                    eventFound = true;
                }
            }
        }

        if(!eventFound){
            parameters.event = Trigger.None;
        }

        //Convert textual timeToTrigger to its equivalent in the code
        let timeToTriggerFound = false;

        if(parameters.sTimeToTrigger != null){
            let listOfEvents = Utils.getEnumList(TriggerMoment);
            for(let trigger in listOfEvents){
                if(listOfEvents[trigger].toLowerCase() == parameters.sTimeToTrigger.toLowerCase()){
                    parameters.timeToTrigger = TriggerMoment[listOfEvents[trigger]];
                    timeToTriggerFound = true;
                }
            }
        }

        if(!timeToTriggerFound){
            parameters.timeToTrigger = TriggerMoment.Never;
        }

        return parameters;
    }

    static getModifier(modifierName:ModifierType, fight:BaseFight, receiver:BaseFighterState, applier?:BaseFighterState, inputParameters?:any):Modifier{
        let modifier:Modifier = null;
        if(inputParameters == null){
            inputParameters = {};
        }

        let modifierTypes = Utils.getStringEnumList(ModifierType);
        let realModifierName = "";

        for(let simpleName of modifierTypes){
            if(ModifierType[simpleName] == modifierName){
                realModifierName = simpleName;
                break;
            }
        }

        if(realModifierName == ""){
            throw new Error("This modifier wasn't found in the ModifierType list.");
        }

        let indexOfSearchedModifier = (<any>modifiersList).findIndex(x => x.name.toLowerCase() == realModifierName.toLowerCase());
        if(indexOfSearchedModifier != -1){
            inputParameters = ModifierFactory.checkAndInitializeDefaultValues(indexOfSearchedModifier, realModifierName, inputParameters);
            modifier = new Modifier(modifierName, fight, receiver, applier , inputParameters.tier, inputParameters.uses, inputParameters.timeToTrigger, inputParameters.event, inputParameters.parentIds);
            modifier.hpDamage = inputParameters.hpDamage;
            modifier.lustDamage = inputParameters.lustDamage;
            modifier.areDamageMultipliers = inputParameters.focusDamage;
            modifier.diceRoll = inputParameters.diceRoll;
            modifier.escapeRoll = inputParameters.escapeRoll;
            modifier.areDamageMultipliers = inputParameters.areDamageMultipliers;
        }

        if(modifier == null){
            throw new Error(`The modifier ${realModifierName} couldn't be initialized. Make sure it exists in the modifiers file.`)
        }

        return modifier;
    }
}