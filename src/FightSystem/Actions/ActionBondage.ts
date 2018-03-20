import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {RWFight} from "../Fight/RWFight";
import {FeatureType, FocusDamageOnHit, FocusHealOnHit, ModifierType} from "../RWConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {Tiers} from "../Constants/Tiers";
import {Trigger} from "../../Common/Constants/Trigger";
import {RWGameSettings} from "../Configuration/RWGameSettings";

export class ActionBondage extends RWAction {

    constructor(fight:RWFight, attacker:ActiveFighter, defenders:ActiveFighter[]) {
        super(fight,
            attacker,
            defenders,
            ActionType.Bondage,
            Tiers.None,
            false, //isHold
            true,  //requiresRoll
            false, //keepActorsTurn
            true,  //singleTarget
            true,  //requiresBeingAlive
            false, //requiresBeingDead
            true,  //requiresBeingInRing
            false, //requiresBeingOffRing
            true,  //targetMustBeAlive
            false, //targetMustBeDead
            true, //targetMustBeInRing
            false,  //targetMustBeOffRing
            true, //targetMustBeInRange
            false, //targetMustBeOffRange
            false, //requiresBeingInHold,
            false, //requiresNotBeingInHold,
            true, //targetMustBeInHold,
            false, //targetMustNotBeInHold,
            true, //usableOnSelf
            false,  //usableOnAllies
            false, //usableOnEnemies
            Trigger.SpecialAttack,
            ActionExplanation[ActionType.Bondage]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentSensuality / 10);
    }

    get requiredDiceScore():number{
        if(this.defender.isInHold()){
            this.requiresRoll = false;
        }
        if(this.defender.hasFeature(FeatureType.BondageBunny)){
            return RWGameSettings.RequiredScoreForBondageAgainstBondageBunny;
        }
        return super.requiredDiceScore;
    }

    onHit(): void {
        this.fpHealToAtk += FocusHealOnHit[Tiers[Tiers.Heavy]];
        this.fpDamageToDef += FocusDamageOnHit[Tiers[Tiers.Heavy]];
        let bdModifier = ModifierFactory.getModifier(ModifierType.Bondage, this.fight, this.defender, this.attacker);
        this.appliedModifiers.push(bdModifier);
    }
}