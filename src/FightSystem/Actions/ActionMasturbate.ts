import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {RWFight} from "../Fight/RWFight";
import {MasturbateLpDamage} from "../RWConstants";
import {Tiers} from "../Constants/Tiers";
import {Trigger} from "../../Common/Constants/Trigger";

export class ActionMasturbate extends RWAction {

    constructor(fight:RWFight, attacker:ActiveFighter, defenders:ActiveFighter[], tier: Tiers) {
        super(fight,
            attacker,
            defenders,
            ActionType.Masturbate,
            tier,
            false, //isHold
            false,  //requiresRoll
            false, //keepActorsTurn
            false,  //singleTarget
            true,  //requiresBeingAlive
            false, //requiresBeingDead
            true,  //requiresBeingInRing
            false, //requiresBeingOffRing
            false,  //targetMustBeAlive
            false, //targetMustBeDead
            false, //targetMustBeInRing
            false,  //targetMustBeOffRing
            false, //targetMustBeInRange
            false, //targetMustBeOffRange
            false, //requiresBeingInHold,
            false, //requiresNotBeingInHold,
            false, //targetMustBeInHold,
            false, //targetMustNotBeInHold,
            true, //usableOnSelf
            false,  //usableOnAllies
            false, //usableOnEnemies
            Trigger.Pass,
            ActionExplanation[ActionType.Masturbate]);
    }

    onHit(): void {
        this.lpDamageToAtk = MasturbateLpDamage[Tiers[this.tier]];
    }
}