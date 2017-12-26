import * as Constants from "../Constants";
import {FeatureType, Trigger, TriggerMoment} from "../Constants";
import {BaseFeature} from "../../Common/BaseFeature";

export namespace Feature{
    export class BondageBunny extends BaseFeature{

        constructor(){
            super(FeatureType.BondageBunny);
        }

        applyFeature<OptionalParameterType>(moment: TriggerMoment, event:Trigger, parameters?:OptionalParameterType):string{
            return "";
        }
    }
}

