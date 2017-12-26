import {Utils} from "./Utils";
import {
    FeatureCostPerUse, FeatureEffect, FeatureType, ModifierType, Trigger,
    TriggerMoment
} from "../FightSystem/Constants";
import {Fight} from "../FightSystem/Fight";
import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {Modifier} from "../FightSystem/Modifiers/Modifier";
import {Dictionary} from "./Dictionary";

export abstract class BaseFeature{

    id:string;
    type:FeatureType;
    uses: number;
    permanent: boolean;
    event:Trigger;
    timeToTrigger:TriggerMoment;
    idReceiver:string;
    receiver:ActiveFighter;
    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date;

    constructor(featureType:FeatureType, id?:string) {
        if(id){
            this.id = id;
        }
        else{
            this.id = Utils.generateUUID();
        }

        this.type = featureType;
    }

    getCost():number{
        return FeatureCostPerUse[FeatureCostPerUse[FeatureType[this.type]]];
    }

    isExpired():boolean{
        if(!this.permanent){
            if(this.uses <= 0){
                return true;
            }
        }
        return false;
    }

    trigger<OptionalParameterType>(moment: TriggerMoment, event:Trigger, parameters?:OptionalParameterType):string{
        let triggeredFeatureMessage = this.applyFeature(moment, event, parameters);
        let wasFeatureTriggered = (triggeredFeatureMessage.length > 0);

        let messageAboutFeature:string = "";

        if(wasFeatureTriggered){
            messageAboutFeature = `${this.receiver.getStylizedName()} is affected by the ${this.type}, ${triggeredFeatureMessage}`;
        }

        return messageAboutFeature;
    }

    abstract applyFeature<OptionalParameterType>(moment: TriggerMoment, event:Trigger, parameters?:OptionalParameterType):string

}