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

            public static passFpDamage: number = 6;

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

export enum BaseDamage {
    Light = 1,
    Medium = 10,
    Heavy = 20
}

export enum FocusDamageOnMiss {
    None = 1,
    Light = 3,
    Medium = 6,
    Heavy = 10
}

export enum FocusHealOnHit {
    None = 1,
    Light = 6,
    Medium = 12,
    Heavy = 18
}

export enum FocusDamageOnHit {
    Light = 5,
    Medium = 10,
    Heavy = 15
}

export enum StrapToyLPDamagePerTurn {
    Light = 4,
    Medium = 8,
    Heavy = 12
}

export enum StrapToyDiceRollPenalty {
    Light = 3,
    Medium = 5,
    Heavy = 7
}

export enum FailedHighRiskMultipliers {
    Light = 0.6,
    Medium = 0.5,
    Heavy = 0.4
}

export enum HighRiskMultipliers {
    Light = 1.3,
    Medium = 1.5,
    Heavy = 1.8
}

export enum MasturbateLpDamage {
    Light = 5,
    Medium = 10,
    Heavy = 20
}

export enum SelfDebaseFpDamage {
    Light = 8,
    Medium = 16,
    Heavy = 24
}

export enum ModifierType {
    SubHoldBrawlBonus = "Accuracy++ on brawl (submission hold)",
    SubHold = "submission hold",
    SexHoldLustBonus = "Accuracy++ on tease (sexual hold)",
    SexHold = "sexual hold",
    Bondage = "bondage items",
    HumHold = "humiliation hold",
    DegradationMalus = "degradation malus",
    ItemPickupBonus = "HP Dmg++ (item pickup)",
    SextoyPickupBonus = "LP Dmg++ (sextoy pickup)",
    Stun = "stun",
    StrapToy = "strapped sex-toy",
    DummyModifier = "unused modifier"
}

export class Feature {
    static KickStart = "Kick Start";
    static SexyKickStart = "Sexy Kick Start";
    static Sadist = "Sadist";
    static CumSlut = "Cum Slut";
    static RyonaEnthusiast = "Ryona Enthusiast";
    static DomSubLover = "Dom Sub Lover";
    static BondageBunny = "Bondage Bunny";
    static BondageHandicap = "Bondage Handicap (1 item)";
}

export enum FeatureType {
    KickStart = "Kick Start feature",
    SexyKickStart = "Sexy Kick Start feature",
    Sadist = "Sadist feature",
    CumSlut = "Cum Slut feature",
    RyonaEnthusiast = "Ryona Enthusiast feature",
    DomSubLover = "D/s Lover feature",
    BondageBunny = "Bondage Bunny feature",
    BondageHandicap = "Bondage Handicap feature"
}

export enum FeatureEffect {
    CreateModifier = "creates a modifier",
    DamageTweaker = "changes the action's damage"
}

export enum FeatureCostPerUse {
    KickStart = 5,
    SexyKickStart = 5,
    Sadist = 0,
    CumSlut = 0,
    RyonaEnthusiast = 0,
    DomSubLover = 0,
    BondageBunny = 0,
    BondageHandicap = 0
}

export class FeatureExplain {
    static KickStart = "They start with an offensive item in their hand, meaning to do more damage.";
    static SexyKickStart = "They start with a sextoy in their hand, meaning to do more lust damage.";
    static Sadist = "Dealing HP damage to the opponent will deal the same amount divided by two to the wearer's Lust.";
    static CumSlut = "Increases all Lust damage done to the wearer by 3.";
    static RyonaEnthusiast = "Taking HP damage also increases the wearer's Lust by the same amount divided by two.";
    static DomSubLover = "Replaces focus by submissiveness. Purely visual.";
    static BondageBunny = "They can be tied up without applying a hold.";
    static BondageHandicap = "They start the fight already wearing one bondage item.";
}