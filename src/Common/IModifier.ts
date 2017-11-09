import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {ModifierType, Tier, Trigger, TriggerMoment} from "../FightSystem/Constants";
import {Fight} from "../FightSystem/Fight";

export interface IModifier{
    idModifier: string;
    idFight: string;
    name:string;
    tier:Tier;
    type:ModifierType;
    applier: ActiveFighter;
    idApplier: string;
    receiver: ActiveFighter;
    idReceiver: string;
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

    fight:Fight;

    isOver():boolean;
    remove():void;
    trigger(moment: TriggerMoment, event:Trigger, objFightAction?:any):void;
    willTriggerForEvent(moment: TriggerMoment, event:Trigger):boolean;
    build(receiver:ActiveFighter, applier:ActiveFighter, fight:Fight):void;
    applyModifierOnReceiver(moment: TriggerMoment, event:Trigger):void;
    applyModifierOnAction(moment: TriggerMoment, event:Trigger, objFightAction:any):void;
}