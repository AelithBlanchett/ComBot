import {FeatureType} from "../RWConstants";
import {BaseFeature} from "../../Common/Features/BaseFeature";
import {Feature} from "./Features";
import KickStart = Feature.KickStart;
import BondageBunny = Feature.BondageBunny;
import {ActiveFighter} from "../Fight/ActiveFighter";
import {IFeatureFactory} from "../../Common/Features/IFeatureFactory";
import {RWFight} from "../Fight/RWFight";
import {RWFighter} from "../Fight/RWFighter";

export class FeatureFactory implements IFeatureFactory<RWFight, RWFighter>{

    getFeature(featureName:string, receiver:ActiveFighter, uses:number, id?:string):BaseFeature{
        let feature:BaseFeature = null;

        switch(featureName){
            case FeatureType.KickStart:
                feature = new KickStart(receiver, uses, id);
                break;
            case FeatureType.BondageBunny:
                feature = new BondageBunny(receiver, uses, id);
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
}