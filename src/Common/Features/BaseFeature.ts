import {Utils} from "../Utils/Utils";
import {Trigger, TriggerMoment} from "../BaseConstants";
import {BaseFighter} from "../Fight/BaseFighter";
import {BaseActiveFighter} from "../Fight/BaseActiveFighter";

export abstract class BaseFeature{

    id:string;
    type:string;
    uses: number;
    permanent: boolean;
    idReceiver:string;
    receiver:BaseFighter;
    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date;

    constructor(featureType:string, receiver:BaseFighter, id?:string) {
        if(id){
            this.id = id;
        }
        else{
            this.id = Utils.generateUUID();
        }

        this.receiver = receiver;

        this.type = featureType;
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
            messageAboutFeature = `${this.receiver} is affected by the ${this.type}, ${triggeredFeatureMessage}`;
        }

        return messageAboutFeature;
    }

    abstract getCost():number;

    abstract applyFeature<OptionalParameterType>(moment: TriggerMoment, event:Trigger, parameters?:OptionalParameterType):string

}