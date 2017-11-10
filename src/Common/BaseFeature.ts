import {Utils} from "./Utils";
import {FeatureCostPerUse, FeatureType} from "../FightSystem/Constants";
import {Fight} from "../FightSystem/Fight";
import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {Modifier} from "../FightSystem/Modifiers/Modifier";

export class BaseFeature{

    id:string;
    type:FeatureType;
    uses: number;
    permanent: boolean;
    obtainedBy:string;
    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date;

    constructor(fighterName:string, featureType:FeatureType, uses:number, id?:string) {
        if(id){
            this.id = id;
        }
        else{
            this.id = Utils.generateUUID();
        }

        this.obtainedBy = fighterName;

        this.type = featureType;

        if(uses <= 0){
            this.uses = 0;
            this.permanent = true;
        }
        else{
            this.uses = uses;
        }
    }

    getCost():number{
        return FeatureCostPerUse[FeatureCostPerUse[this.type]];
    }

    isExpired():boolean{
        if(!this.permanent){
            if(this.uses <= 0){
                return true;
            }
        }
        return false;
    }


}