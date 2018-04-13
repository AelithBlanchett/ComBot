import {FeatureType} from "../RWConstants";
import {BaseFeature} from "../../Common/Features/BaseFeature";
import {Feature} from "./Features";
import KickStart = Feature.KickStart;
import BondageBunny = Feature.BondageBunny;
import {RWFighterState} from "../Fight/RWFighterState";
import {IFeatureFactory} from "../../Common/Features/IFeatureFactory";
import {RWFight} from "../Fight/RWFight";
import CumSlut = Feature.CumSlut;
import RyonaEnthusiast = Feature.RyonaEnthusiast;
import {RWUser} from "../Fight/RWUser";

export class FeatureFactory implements IFeatureFactory{

    getFeature(featureName:string, receiver:RWUser, uses:number, id?:string):BaseFeature{
        let feature:BaseFeature = null;

        switch(featureName){
            case FeatureType.KickStart:
                feature = new KickStart(receiver, uses, id);
                break;
            case FeatureType.BondageBunny:
                feature = new BondageBunny(receiver, uses, id);
                break;
            case FeatureType.CumSlut:
                feature = new CumSlut(receiver, uses, id);
                break;
            case FeatureType.RyonaEnthusiast:
                feature = new RyonaEnthusiast(receiver, uses, id);
                break;
            default:
                feature = null;
                break;
        }

        if(feature == null){
            throw new Error(`The feature ${featureName} couldn't be initialized. The ${featureName} could be missing in Features.js and/or the ${featureName} isn't present in the features.json file.`)
        }
        return feature;
    }

    getExistingFeatures():string[]{
        return [FeatureType.KickStart, FeatureType.RyonaEnthusiast, FeatureType.CumSlut, FeatureType.BondageBunny];
    }
}