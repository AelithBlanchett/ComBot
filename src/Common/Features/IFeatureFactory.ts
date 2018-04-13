import {BaseFeature} from "./BaseFeature";
import {BaseUser} from "../Fight/BaseUser";

export interface IFeatureFactory {
    getFeature(featureName: string, receiver:BaseUser, uses:number, id?:string):BaseFeature;
    getExistingFeatures():string[];
}