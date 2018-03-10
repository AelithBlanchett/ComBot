import {BaseFighter} from "../Fight/BaseFighter";
import {BaseFight} from "../Fight/BaseFight";
import {BaseFeature} from "./BaseFeature";

export interface IFeatureFactory<Fight extends BaseFight, Fighter extends BaseFighter> {
    getFeature(featureName: string, receiver:Fighter, uses:number, id?:string):BaseFeature;
}