import {FeatureType} from "../FightSystem/Constants";
import * as Constants from "../FightSystem/Constants"
import {Utils} from "./Utils";
import {BaseFeature} from "./BaseFeature";
import {Feature} from "../FightSystem/Features/Features";

export class FeatureFactory{

    static checkAndInitializeDefaultValues(indexOfSearchedFeature:number, featureName:string, feature:BaseFeature){
        if(Constants.FeatureType[featureName] == null) {
            throw new Error("This feature doesn't exist in the FeatureType list.");
        }

        //Merges the properties found in the json config file with our custom parameters object
        Utils.mergeFromTo(Constants.Globals.featuresList[indexOfSearchedFeature], feature);

        return feature;
    }

    static getFeature(featureName:FeatureType, uses:number, id?:string){
        let feature:BaseFeature = null;

        let featureTypes = Utils.getStringEnumList(FeatureType);
        let realFeatureName = "";

        for(let simpleName of featureTypes){
            if(FeatureType[simpleName] == featureName){
                realFeatureName = simpleName;
                break;
            }
        }

        if(realFeatureName == ""){
            throw new Error("This feature wasn't found in the FeatureType list.");
        }

        let indexOfSearchedFeature = Constants.Globals.featuresList.findIndex(x => x.name.toLowerCase() == realFeatureName.toLowerCase());
        if(indexOfSearchedFeature != -1){
            feature = new Feature[realFeatureName]();
            feature = FeatureFactory.checkAndInitializeDefaultValues(indexOfSearchedFeature, realFeatureName, feature);
        }

        if(feature == null){
            throw new Error(`The feature ${realFeatureName} couldn't be initialized. The ${realFeatureName} could be missing in Features.js and/or the ${realFeatureName} isn't present in the features.json file.`)
        }

        if(id != null){
            feature.id = id;
        }
        feature.uses = uses;

        return feature;
    }
}