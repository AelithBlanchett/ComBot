import {Modifier} from "./Modifier";
import * as Constants from "../Constants";
import Trigger = Constants.Trigger;
import ModifierType = Constants.ModifierType;
import TriggerMoment = Constants.TriggerMoment;
import {Tier} from "../Constants";
import {ActiveFighter} from "../ActiveFighter";



export class EmptyModifier extends Modifier {

    constructor(){
        super(null, null, Tier.None, ModifierType.SubHold, 0, 0, 0, 0, 0, 0, 0, 0, [], false);
    }

    trigger(moment: TriggerMoment, event:Trigger):void{
        if(this.willTriggerForEvent(moment, event)){
            //something else happens here
        }
    }
}