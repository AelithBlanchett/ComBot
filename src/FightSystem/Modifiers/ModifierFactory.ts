import * as Constants from "../Constants";
import {Modifier} from "./Modifier";
import {ActiveFighter} from "../ActiveFighter";
import {IModifier} from "./IModifier";
import {ModifierType, Tier} from "../Constants";
import {Utils} from "../../Common/Utils";
import {Fight} from "../Fight";

export class ModifierFactory{

    static checkAndInitializeDefaultValues(indexOfSearchedModifier:number, modifierName:string, parameters:any){
        if(Constants.ModifierType[modifierName] == null){
            throw new Error("This modifier doesn't exist in the ModifierType list.");
        }

        if(parameters == null){
            parameters = {};
        }

        //Merges the properties found in the json config file with our custom parameters object
        Utils.mergeFromTo(Constants.Globals.modifiersList[indexOfSearchedModifier], parameters);

        parameters.type = ModifierType[modifierName];
        parameters.tier = parameters.tier || Tier.None;
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
            let listOfEvents = Utils.getEnumList(Constants.Trigger);
            for(let trigger in listOfEvents){
                if(listOfEvents[trigger].toLowerCase() == parameters.sEvent.toLowerCase()){
                    parameters.event = Constants.Trigger[listOfEvents[trigger]];
                    eventFound = true;
                }
            }
        }

        if(!eventFound){
            parameters.event = Constants.Trigger.None;
        }

        //Convert textual timeToTrigger to its equivalent in the code
        let timeToTriggerFound = false;

        if(parameters.sTimeToTrigger != null){
            let listOfEvents = Utils.getEnumList(Constants.TriggerMoment);
            for(let trigger in listOfEvents){
                if(listOfEvents[trigger].toLowerCase() == parameters.sTimeToTrigger.toLowerCase()){
                    parameters.timeToTrigger = Constants.TriggerMoment[listOfEvents[trigger]];
                    timeToTriggerFound = true;
                }
            }
        }

        if(!timeToTriggerFound){
            parameters.timeToTrigger = Constants.TriggerMoment.Never;
        }

        return parameters;
    }

    static getModifier(modifierName:ModifierType, fight:Fight, receiver:ActiveFighter, applier?:ActiveFighter, inputParameters?:any){
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

        let indexOfSearchedModifier = Constants.Globals.modifiersList.findIndex(x => x.name.toLowerCase() == realModifierName.toLowerCase());
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