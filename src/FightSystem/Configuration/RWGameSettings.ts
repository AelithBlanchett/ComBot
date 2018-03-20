import * as fs from "fs";
import {GameSettings} from "../../Common/Configuration/GameSettings";
import {Utils} from "../../Common/Utils/Utils";
import {Team} from "../../Common/Constants/Team";


export class RWGameSettings extends GameSettings {

    public static degradationFocusMultiplier: number = 1.66;
    public static RequiredScoreForBondageAgainstBondageBunny: number = 10;
    public static maxBondageItemsOnSelf: number = 4;
    public static maxTurnsWithoutFocus: number = 6;
    //Holds
    public static initialNumberOfTurnsForHold: number = 5;
    public static holdDamageMultiplier: number = 0.5;
    //Rest
    public static hpPercentageToHealOnRest: number = 0.30;
    public static lpPercentageToHealOnRest: number = 0.30;
    public static fpPercentageToHealOnRest: number = 0.30;
    //Forced Lewd
    public static forcedWorshipLPMultiplier: number = 4;
    //HighRisk
    public static multiplierHighRiskAttack: number = 2;
    //Stun
    public static stunHPDamageMultiplier: number = 0.33;
    public static dicePenaltyMultiplierWhileStunned: number = 2;

    public static passFpDamage: number = 10;

    public static fpHealOnNextTurn: number = 2;

    public static tapoutOnlyAfterTurnNumber:number = 10;
}