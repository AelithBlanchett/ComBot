import {Trigger} from "../Constants/Trigger";
import {BaseActiveFighter} from "../Fight/BaseActiveFighter";
import {BaseFight} from "../Fight/BaseFight";
import {TriggerMoment} from "../Constants/TriggerMoment";

export interface IBaseModifier{
    idModifier: string;
    tier:number;
    name:string;
    applier: BaseActiveFighter;
    receiver: BaseActiveFighter;
    areDamageMultipliers: boolean;
    diceRoll: number;
    escapeRoll: number;
    uses: number;
    event:Trigger;
    timeToTrigger:TriggerMoment;
    idParentActions: Array<string>;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

    fight:BaseFight;

    isOver():boolean;
    remove():void;
    trigger(moment: TriggerMoment, event:Trigger, objFightAction?:any):void;
    applyModifierOnReceiver(moment: TriggerMoment, event:Trigger):void;
    applyModifierOnAction(moment: TriggerMoment, event:Trigger, objFightAction:any):void;
}