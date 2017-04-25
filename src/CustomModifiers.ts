import {Modifier} from "./Modifier";
import * as Constants from "./Constants";
import Trigger = Constants.Trigger;
import ModifierType = Constants.ModifierType;
import TriggerMoment = Constants.TriggerMoment;
import {Tier} from "./Constants";
import {ActiveFighter} from "./ActiveFighter";


export class BondageModifier extends Modifier {
    constructor(receiver:ActiveFighter, applier?:ActiveFighter, parentIds?:Array<string>) {
        super(receiver.name, (applier != null ? applier.name : null), Tier.None, ModifierType.Bondage, 0, 0, 0, 0, 0, 1, Constants.TriggerMoment.Never, Constants.Trigger.None, parentIds, false);
        this.build(receiver, applier, receiver.fight);
    }
}

export class HoldModifier extends Modifier {
    constructor(receiver:ActiveFighter, applier:ActiveFighter, tier:Tier, holdType:ModifierType, hpDamage:number, lustDamage:number, focusDamage:number, parentIds?:Array<string>) {
        super(receiver.name, (applier != null ? applier.name : null), tier, holdType, hpDamage, lustDamage, focusDamage, 0, 0, Constants.Fight.Action.Globals.initialNumberOfTurnsForHold, Constants.TriggerMoment.Any, Constants.Trigger.OnTurnTick, parentIds, false);
        this.build(receiver, applier, receiver.fight);
    }
}

export class LustBonusSexHoldModifier extends Modifier {
    constructor(receiver:ActiveFighter, parentIds?:Array<string>) {
        super(receiver.name, null, Tier.None, ModifierType.SexHoldLustBonus, 0, 0, 0, Constants.Fight.Action.Globals.accuracyForSexStrikeInsideSexHold, 0, Constants.Fight.Action.Globals.initialNumberOfTurnsForHold, Constants.TriggerMoment.Before, Constants.Trigger.SensualityBasedAttack, parentIds, false);
        this.build(receiver, null, receiver.fight);
    }
}

export class BrawlBonusSubHoldModifier extends Modifier {
    constructor(receiver:ActiveFighter, parentIds?:Array<string>) {
        super(receiver.name, null, Tier.None, ModifierType.SubHoldBrawlBonus, 0, 0, 0, Constants.Fight.Action.Globals.accuracyForBrawlInsideSubHold, 0, Constants.Fight.Action.Globals.initialNumberOfTurnsForHold, Constants.TriggerMoment.Before, Constants.Trigger.PowerBasedAttack, parentIds, false);
        this.build(receiver, null, receiver.fight);
    }
}

export class ItemPickupModifier extends Modifier {
    constructor(receiver:ActiveFighter, parentIds?:Array<string>) {
        super(receiver.name, null, Tier.None, ModifierType.ItemPickupBonus, 0, 0, 0, Constants.Fight.Action.Globals.itemPickupBonusDiceScore, 0, Constants.Fight.Action.Globals.itemPickupUses, Constants.TriggerMoment.Before, Constants.Trigger.PowerBasedAttack, parentIds, true);
        this.build(receiver, null, receiver.fight);
    }
}

export class SextoyPickupModifier extends Modifier {
    constructor(receiver:ActiveFighter, parentIds?:Array<string>) {
        super(receiver.name, null, Tier.None, ModifierType.SextoyPickupBonus, 0, 0, 0, Constants.Fight.Action.Globals.sextoyPickupBonusDiceScore, 0, Constants.Fight.Action.Globals.sextoyPickupUses, Constants.TriggerMoment.Before, Constants.Trigger.SensualityBasedAttack, parentIds, true);
        this.build(receiver, null, receiver.fight);
    }
}

export class StrapToyModifier extends Modifier {
    constructor(receiver:ActiveFighter, tier:Tier, turns:number, lpDamagePerTurn:number, fpDamagePerTurn:number, diceRollPenalty:number, parentIds?:Array<string>) {
        super(receiver.name, null, tier, ModifierType.StrapToy, 0, lpDamagePerTurn, fpDamagePerTurn, diceRollPenalty, 0, turns, Constants.TriggerMoment.Any, Constants.Trigger.OnTurnTick, parentIds, true);
        this.build(receiver, null, receiver.fight);
    }
}

export class DegradationModifier extends Modifier {
    constructor(receiver:ActiveFighter, applier:ActiveFighter, parentIds?:Array<string>) {
        super(receiver.name, (applier != null ? applier.name : null), Tier.None, ModifierType.DegradationMalus, 0, 0, Constants.Fight.Action.Globals.degradationFocusDamage, 0, 0, Constants.Fight.Action.Globals.degradationUses, Constants.TriggerMoment.Before, Constants.Trigger.Degradation, parentIds, false);
        this.build(receiver, applier, receiver.fight);
    }
}

export class StunModifier extends Modifier {
    constructor(receiver:ActiveFighter, applier:ActiveFighter, tier:Tier, dicePenalty:number, uses:number, parentIds?:Array<string>) {
        super(receiver.name, (applier != null ? applier.name : null), tier, ModifierType.Stun, 0, 0, 0, dicePenalty, dicePenalty, uses, Constants.TriggerMoment.Before, Constants.Trigger.AnyOffensiveAction, parentIds, false);
        this.build(receiver, applier, receiver.fight);
    }
}

export class ForcedDegradationModifier extends Modifier {
    constructor(receiver:ActiveFighter, applier:ActiveFighter, parentIds?:Array<string>) {
        super(receiver.name, (applier != null ? applier.name : null), Tier.None, ModifierType.DegradationMalus, 0, 0, Constants.Fight.Action.Globals.degradationFocusDamage, 0, 0, Constants.Fight.Action.Globals.degradationUses, Constants.TriggerMoment.Before, Constants.Trigger.Degradation, parentIds, false);
        this.build(receiver, applier, receiver.fight);
    }
}


export class DummyModifier extends Modifier {

    constructor(receiver:ActiveFighter, applier:ActiveFighter, modType:ModifierType, hpDamage:number, lustDamage:number, focusDamage:number, diceRoll:number, escapeRoll:number, uses:number,
                momentToTrigger:TriggerMoment, eventTrigger:Trigger, parentIds:Array<string>, areMultipliers:boolean){
        let myCustomNumberOfUses = 5;
        super(receiver.name, (applier != null ? applier.name : null), Tier.None, modType, hpDamage, lustDamage, focusDamage, diceRoll, escapeRoll, myCustomNumberOfUses, momentToTrigger, eventTrigger, parentIds, areMultipliers);
        this.build(receiver, applier, receiver.fight);
    }

    trigger(moment: TriggerMoment, event:Trigger):void{
        if(this.willTriggerForEvent(moment, event)){
            //something else happens here
        }
    }
}

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