import {Utils} from "../Utils/Utils";
import {Trigger} from "../Constants/Trigger";
import {TriggerMoment} from "../Constants/TriggerMoment";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {BaseUser} from "../Fight/BaseUser";

@Entity("Features")
export abstract class BaseFeature{

    @PrimaryColumn()
    id:string;
    @Column()
    type:string;
    @Column()
    uses: number;
    @Column()
    permanent: boolean;
    @ManyToOne(type => BaseUser, fighter => fighter.features)
    receiver:BaseUser;
    @CreateDateColumn()
    createdAt:Date;
    @UpdateDateColumn()
    updatedAt:Date;
    @Column()
    deleted:boolean;

    constructor(featureType:string, receiver:BaseUser, uses:number, id?:string) {
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
            messageAboutFeature = `${this.receiver.name} is affected by the ${this.type}, ${triggeredFeatureMessage}`;
        }

        return messageAboutFeature;
    }

    abstract getCost():number;

    abstract applyFeature<OptionalParameterType>(moment: TriggerMoment, event:Trigger, parameters?:OptionalParameterType):string

}