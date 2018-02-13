import {ModifierType, Tier, Trigger, TriggerMoment} from "./Constants";
import {BaseActiveFighter} from "./BaseActiveFighter";
import {BaseFight} from "./BaseFight";

export interface IBaseModifier{
    idModifier: string;
    idFight: string;
    tier:Tier;
    type:ModifierType;
    applier: BaseActiveFighter;
    idApplier: string;
    receiver: BaseActiveFighter;
    idReceiver: string;
    areDamageMultipliers: boolean;
    diceRoll: number;
    escapeRoll: number;
    uses: number;
    event:string;
    timeToTrigger:TriggerMoment;
    idParentActions: Array<string>;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

    fight:BaseFight;

    isOver():boolean;
    remove():void;
    trigger(moment: TriggerMoment, event:string, objFightAction?:any):void;
    build(receiver:BaseActiveFighter, applier:BaseActiveFighter, fight:BaseFight):void;
    applyModifierOnReceiver(moment: TriggerMoment, event:string):void;
    applyModifierOnAction(moment: TriggerMoment, event:string, objFightAction:any):void;
}