import {Utils} from "./Utils/Utils";
import * as fs from "fs";
import {Teams} from "./Constants/Teams";
import {GameSettings} from "./Configuration/GameSettings";

export class SQL {
    public static fightTableName: string = GameSettings.pluginName + "_fights";
    public static fightFightersTableName: string = GameSettings.pluginName + "_fightfighters";
    public static fightersFeaturesTableName: string = GameSettings.pluginName + "_fighters_features";
    public static fightersAchievementsTableName: string = GameSettings.pluginName + "_fighters_achievements";
    public static fightersTransactionsTableName: string = GameSettings.pluginName + "_fighters_transactions";
    public static fightersTableName: string = GameSettings.pluginName + "_fighters";
    public static fightersViewName: string = GameSettings.pluginName + "_v_fighters";
    public static actionTableName: string = GameSettings.pluginName + "_actions";
    public static activeFightersTableName: string = GameSettings.pluginName + "_activefighters";
    public static constantsTableName: string = GameSettings.pluginName + "_constants";
    public static modifiersTableName: string = GameSettings.pluginName + "_modifiers";
    public static currentSeasonKeyName: string = "currentSeason";
}

export namespace Fight {

    export class Globals {
        public static tokensPerLossMultiplier: number = 0.5; //needs to be < 1 of course
        public static tokensForWinnerByForfeitMultiplier: number = 0.5; //needs to be < 1 of course
        public static tokensCostToFight:number = 10;
        //Range
        public static maximumDistanceToBeConsideredInRange: number = 10;
    }

    export namespace Action {
        export class RequiredScore{
            public static Tag: number = 8;
            public static Rest: number = 4;
            public static BondageBunny: number = 10;
        }

        export class Globals{

            //Tag
            public static turnsToWaitBetweenTwoTags: number = 4;
            //Bondage
            public static maxBondageItemsOnSelf: number = 4;
            public static difficultyIncreasePerBondageItem: number = 2;
            //Focus
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


            //Bonuses
            public static maxTagBonus: number = 3;

            public static itemPickupUses: number = 3;
            public static itemPickupBonusDiceScore: number = 5;
            public static itemPickupDamageMultiplier: number = 1.5;

            public static sextoyPickupUses:number = 3;
            public static sextoyPickupBonusDiceScore: number = 5;
            public static sextoyPickupDamageMultiplier: number = 1.5;

            public static degradationUses: number = 5;
            public static degradationFocusDamage: number = 10;
            public static degradationFocusMultiplier: number = 1.66;

            public static accuracyForBrawlInsideSubHold: number = 3;
            public static accuracyForSexStrikeInsideSexHold: number = 3;
        }
    }
}


export enum FightTier {
    Bronze = 0,
    Silver = 1,
    Gold = 2
}

export enum FightTierWinRequirements {
    Bronze = 0,
    Silver = 10,
    Gold = 30
}

export enum FightLength {
    Short = 0,
    Medium = 1,
    Long = 2,
    Epic = 3
}

export enum StatTier {
    Bronze = 2,
    Silver = 4,
    Gold = 6
}

export enum TokensPerWin {
    Bronze = 15,
    Silver = 25,
    Gold = 50
}

export enum TokensWorth {
    Copper = 10,
    Bronze = 50,
    Silver = 100,
    Gold = 300
}

export enum TransactionType{
    FightReward = 0,
    Feature = 1,
    AchievementReward = 2,
    Restat = 3,
    FightStart = 4,
    Tip = 5,
    DonationFromAelith = 6
}

export enum FightType {
    Classic = 0,
    Tag = 1,
    LastManStanding = 2,
    SexFight = 3,
    Humiliation = 4,
    Bondage = 5,
    Submission = 6
}

export enum TriggerMoment {
    Never = -1,
    Before = 1 << 0,
    After = 1 << 1,
    Any = Before | After
}

export enum Trigger {
    HPDamage = 1 << 0,
    LustDamage = 1 << 1,
    FocusDamage = 1 << 2,
    Damage = HPDamage | LustDamage,
    BarDamage = HPDamage | LustDamage | FocusDamage,

    HPHealing = 1 << 3,
    LustHealing = 1 << 4,
    FocusHealing = 1 << 5,
    Heal = HPHealing | LustHealing,
    BarHealing = Heal | FocusDamage,

    Orgasm = 1 << 6,
    HeartLoss = 1 << 7,
    OrgasmOrHeartLoss = Orgasm | HeartLoss,

    InitiationRoll = 1 << 8,
    SingleRoll = 1 << 9,
    Roll = SingleRoll | InitiationRoll,

    Brawl = 1 << 10,
    TeaseAttack = 1 << 11,
    ForcedWorshipAttack = 1 << 12,
    HighRiskAttack = 1 << 13,
    RiskyLewd = 1 << 14,
    Stun = 1 << 15,
    Attack = Brawl | TeaseAttack | ForcedWorshipAttack | Stun,
    SubmissionHold = 1 << 16,
    Bondage = 1 << 17,
    Degradation = 1 << 18,
    HumiliationHold = 1 << 19,
    SexHoldAttack = 1 << 20,
    Hold = SubmissionHold | HumiliationHold | SexHoldAttack,
    SensualityBasedAttack = TeaseAttack | SexHoldAttack | ForcedWorshipAttack | HumiliationHold | RiskyLewd,
    PowerBasedAttack = Brawl | SubmissionHold | HighRiskAttack | Stun,

    ItemPickup = 1 << 21,
    SextoyPickup = 1 << 22,
    Pickup = ItemPickup | SextoyPickup,

    Tag = 1 << 23,
    Escape = 1 << 24,
    Rest = 1 << 25,
    Submit = 1 << 27,
    PassiveAction = Tag | Escape | Rest,
    AnyOffensiveAction = Attack | Hold,
    AnyAction = PassiveAction | AnyOffensiveAction,

    OnTurnTick = 1 << 28,
    None = 1 << 29,

    StrapToy = 1 << 30,
    Finisher = 1 << 31
}
