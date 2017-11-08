import {Utils} from "../Utils/Utils";
import * as Constants from "./Constants";
import {ItemPickupModifier, SextoyPickupModifier, BondageModifier} from "./Modifiers/CustomModifiers";
import {Fight} from "./Fight";
import {FeatureType} from "./Constants";
import {ActiveFighter} from "./ActiveFighter";
import {IModifier} from "./Modifiers/IModifier";

export class Feature{

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

    getModifier(fight:Fight, attacker?:ActiveFighter, defender?:ActiveFighter):IModifier {
        let modifier:IModifier = null;
        if (!this.isExpired()) {
            switch (this.type) {
                case FeatureType.KickStart:
                    modifier = new ItemPickupModifier(attacker);
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.KickStart} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.KickStart);
                    break;
                case FeatureType.SexyKickStart:
                    modifier = new SextoyPickupModifier(attacker);
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.SexyKickStart} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.SexyKickStart);
                    break;
                case FeatureType.Sadist:
                    modifier = null;
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.Sadist} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.Sadist);
                    break;
                case FeatureType.CumSlut:
                    modifier = null;
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.CumSlut} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.CumSlut);
                    break;
                case FeatureType.RyonaEnthusiast:
                    modifier = null;
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.RyonaEnthusiast} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.RyonaEnthusiast);
                    break;
                case FeatureType.BondageHandicap:
                    modifier = new BondageModifier(attacker);
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.BondageHandicap} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.BondageHandicap);
                    break;
                default:
                    modifier = null;
                    fight.message.addHint(`${attacker.getStylizedName()} has an unknown feature!`);
                    fight.message.addHint("Something got wrong during the detection of the feature type.");
                    break;
            }
            if (!this.permanent) {
                this.uses--;
                fight.message.addHint(`Uses left: ${this.uses}`);
            }
        }
        return modifier;
    }

    getCost():number{
        let result = 0;
        switch (this.type){
            case FeatureType.KickStart:
            case FeatureType.SexyKickStart:
                result = 5 * this.uses;
                break;
            default:
                //All the other features are free
                break;
        }
        return result;
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