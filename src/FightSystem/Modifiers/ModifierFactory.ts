import * as BaseConstants from "../../Common/BaseConstants";
import {Modifier} from "./Modifier";
import {Utils} from "../../Common/Utils/Utils";
import {BaseFight} from "../../Common/Fight/BaseFight";
import {BaseActiveFighter} from "../../Common/Fight/BaseActiveFighter";
import {Tiers} from "../Constants/Tiers";
import {ModifierType} from "../RWConstants";
import * as modifiersList from "./modifiers.json";

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
            let listOfEvents = Utils.getEnumList(BaseConstants.Trigger);
            for(let trigger in listOfEvents){
                if(listOfEvents[trigger].toLowerCase() == parameters.sEvent.toLowerCase()){
                    parameters.event = BaseConstants.Trigger[listOfEvents[trigger]];
                    eventFound = true;
                }
            }
        }

        if(!eventFound){
            parameters.event = BaseConstants.Trigger.None;
        }

        //Convert textual timeToTrigger to its equivalent in the code
        let timeToTriggerFound = false;

        if(parameters.sTimeToTrigger != null){
            let listOfEvents = Utils.getEnumList(BaseConstants.TriggerMoment);
            for(let trigger in listOfEvents){
                if(listOfEvents[trigger].toLowerCase() == parameters.sTimeToTrigger.toLowerCase()){
                    parameters.timeToTrigger = BaseConstants.TriggerMoment[listOfEvents[trigger]];
                    timeToTriggerFound = true;
                }
            }
        }

        if(!timeToTriggerFound){
            parameters.timeToTrigger = BaseConstants.TriggerMoment.Never;
        }

        return parameters;
    }

    static getModifier(modifierName:ModifierType, fight:BaseFight, receiver:BaseActiveFighter, applier?:BaseActiveFighter, inputParameters?:any):Modifier{
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
            modifier = new Modifier(receiver.name,
                                    (applier != null ? applier.name : null),
                                    inputParameters.tier,
                                    inputParameters.type,
                                    inputParameters.hpDamage,
                                    inputParameters.lustDamage,
                                    inputParameters.focusDamage,
                                    inputParameters.diceRoll,
                                    inputParameters.escapeRoll,
                                    inputParameters.uses,
                                    inputParameters.timeToTrigger,
                                    inputParameters.event,
                                    inputParameters.parentIds,
                                    inputParameters.areDamageMultipliers);
            modifier.build(receiver, applier, fight);
        }

        if(modifier == null){
            throw new Error(`The modifier ${realModifierName} couldn't be initialized. Make sure it exists in the modifiers file.`)
        }

        return modifier;
    }
}