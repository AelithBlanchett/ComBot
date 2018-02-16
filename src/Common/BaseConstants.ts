import {Utils} from "./Utils";
import * as fs from "fs";

export enum Team {
    White = null,
    Unknown = -1,
    Blue = 0,
    Red = 1,
    Yellow = 2,
    Orange = 3,
    Pink = 4,
    Purple = 5,
    Green = 6,
    Gray = 7,
    Cyan = 8,
    Brown = 9,
}

export enum Stats {
    Power = 0,
    Sensuality = 1,
    Toughness = 2,
    Endurance = 3,
    Willpower = 4,
    Dexterity = 5
}



export class Globals {
    public static modifiersFileRaw:string = fs.readFileSync(__dirname + "/../FightSystem/Modifiers/modifiers.json.js", "utf8");
    public static modifiersFile = Globals.modifiersFileRaw.substr(0, Globals.modifiersFileRaw.indexOf(";"));
    public static modifiersList:any = JSON.parse(Globals.modifiersFile);
    public static featuresFileRaw:string = fs.readFileSync(__dirname + "/../FightSystem/Features/features.json.js", "utf8");
    public static featuresFile = Globals.featuresFileRaw.substr(0, Globals.featuresFileRaw.indexOf(";"));
    public static featuresList:any = JSON.parse(Globals.featuresFile);
    public static numberOfAvailableTeams:number = (Utils.getEnumList(Team).length - 2);
    public static featuresMinMatchesDurationCount:number = 1;
    public static featuresMaxMatchesDurationCount:number = 10;
    public static tippingMinimum:number = 0;
    public static pluginName:string = "nsfw";
    public static currencyName:string = "tokens";
    public static currentSeason:number = 1;
    public static diceSides:number = 10;
    public static diceCount:number = 2;
    public static numberOfDifferentStats:number = Utils.getEnumList(Stats).length;
    public static numberOfRequiredStatPoints:number = 230;
    public static minStatLimit:number = 10;
    public static maxStatLimit:number = 100;
    public static restatCostInTokens:number = 5;
    public static botName:string = "Miss_Spencer";
}

export class SQL {
    public static fightTableName: string = Globals.pluginName + "_fights";
    public static fightFightersTableName: string = Globals.pluginName + "_fightfighters";
    public static fightersFeaturesTableName: string = Globals.pluginName + "_fighters_features";
    public static fightersAchievementsTableName: string = Globals.pluginName + "_fighters_achievements";
    public static fightersTransactionsTableName: string = Globals.pluginName + "_fighters_transactions";
    public static fightersTableName: string = Globals.pluginName + "_fighters";
    public static fightersViewName: string = Globals.pluginName + "_v_fighters";
    public static actionTableName: string = Globals.pluginName + "_actions";
    public static activeFightersTableName: string = Globals.pluginName + "_activefighters";
    public static constantsTableName: string = Globals.pluginName + "_constants";
    public static modifiersTableName: string = Globals.pluginName + "_modifiers";
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



export class Messages {
    static startupGuide = `Note: Any commands written down there are starting with a ! and must be typed without the "".
    It's easy! First, you need to register.
    Just type "!register", and your profile will be created.
    You will start with 1 point in every stat: Power, Sensuality, Toughness, Endurance, Dexterity, Willpower.
    The stat system is fixed to 200 available points for the moment, and you can change your stats at any moment.
    An example on how to change your stats: Type: !restat 31,32,29,28,30,50 
    31 here represents your Power, 32 your Sensuality, 29 your Toughness, 28 your Endurance, 30 your Dexterity and 50 your Willpower.
    You must have 200 attributed points in order to start a fight.
    
    Let's get to the stats.

    Power will be used wear out the defender Physically with your strength, reducing their Health
    Sensuality will wear out the defender Sexually
    Toughness will help you resist Physical attacks by increasing your maximum Health
    Endurance will help you resist Sexual attacks, and increasing your Lust and Orgasm Counter
    Dexterity will help your moves to hit, help you to dodge attacks and influence your initiative
    Willpower will help you to keep your focus, and increase your Focus bar’s bounds

    During a fight, your "health" is splitted in three bars. Health, Lust, and Focus.
    
    Your overall Health scales with your Toughness.
    Your Lust and Orgasm Counter scales with the Endurance.
    Your Focus bar bounds scales with the Willpower.

    Health works similarly to how Lust does.
    For your health, you will have 3 hearts, each representing a certain amount of HP, depending on your toughness.
    For your lust, the hearts are replaced by the Orgasm Counter, and the HP by LP (Lust Points).
    The Orgasm Counter are the equivalent of hearts.
    
    When you receive an attack, it affects your latest heart. Once your heart's hp gets to zero, it breaks, and the next (with full HP) one takes place.
    Same as the hearts, you will trigger an orgasm when you max your Lust Counter, which will reset back to 0, and removing one orgasm from your Orgasm Counter.
    No Hearts = No More Orgasms = You're out!
    
    The focus works a bit differently: see it as something you need not to be in the 'red'.
    The focus bar bounds go into the negative and the positive. (-30 to 30 for example.)
    You will start at 0 FP (Focus Points).
    In order to stay in the fight, you will have to keep your focus in the green zone, between 0 and 30 in our case.
    Successfully placing an attack or resting will make you gain FP.
    Missing an attack, receiving a hit or being put in a humiliation hold will make you lose FP.
    If you are in the red for 3 consecutive turns, you're considered as too unfocused to continue the fight.
    Of course, in other terms, it could mean: Too submissive to fight, Ahegao, etc.
    
    There is an economy driven around the federation.
    To participate in a fight, you must pay a copper token (10 tokens).
    You start with 10 tokens, enough to participate in a fight.
    If you don't have enough money to participate in a fight, don't worry.
    You can service someone in the room (however they like~), and they'll give you some money in return with "!tip your_character_name amount_of_tokens".
    It is encouraged that you do so too, if you happen to be a successful fighter!
    You can also have feats and flaws linked to your character, called Features.
    Most of the features are feats, such as starting with an item before the fight starts (the KickStart feature).
    You can also have non-impacting features, such as the DomSubLover. It simply replaces your focus bar with a submissiveness bar that acts the same.
    Get a complete list of those features with !getfeatureslist.
    
    TLDR: Do "!register", then set your 200 points of stats with "!restat 31,32,29,28,29,51", then do "!ready" to take part in the upcoming fight.
    You can check the command list on the profile.
    Available commands in fight: Brawl, Tease, HighRisk, RiskyLewd, SubHold, HumHold, Bondage, Degradation, ItemPickup, SextoyPickup, StrapToy, Submit, Finisher
    `;
    static Ready = `[color=green]%s is now ready to get it on![/color] (Fight Type: %s ---- Required Teams: [color=green][b]%s[/b][/color] ---- Fight Length: %s)\n[sub]Hint: Don't forget you can change these settings with the !fighttype, the !teamscount or the !fightlength commands.[/sub]`;
    static HitMessage = ` HIT! `;
    static MissMessage = ` MISS! `;
    static ForcedHoldRelease = `%s forced %s to release their hold with this heavy blow!`;
    static changeMinTeamsInvolvedInFightOK = "Number of teams involved in the fight updated!";
    static changeMinTeamsInvolvedInFightFail = "The number of teams should be superior or equal than 2.";
    static setDiceLess = "The fight is now %susing the dice.";
    static setDiceLessFail = "Couldn't drop the dice for this fight, it is already started, or it's already over.";
    static setFightLength = "The fight's pace has been set to %s";
    static setFightLengthFail = "Couldn't change the pace for this fight, it is already started, or it's already over.";
    static setFightTypeClassic = "Fight type successfully set to Classic.";
    static setFightTypeTag = "Fight type successfully set to Tag-Team.";
    static setFightTypeLMS = "Fight type successfully set to Last Man Standing.";
    static setFightTypeHMatch = "Fight type successfully set to Humiliation Match.";
    static setFightTypeSexFight = "Fight type successfully set to SexFight.";
    static setFightTypeBondageMatch = "Fight type successfully set to Bondage Match.";
    static setFightTypeNotFound = "Type not found. Fight type reset to Classic.";
    static setFightTypeFail = "Can't change the fight type if the fight has already started or is already finished.";

    static startMatchAnnounce = "[color=green]Everyone's ready, let's start the match![/color] (Match ID: %s Keep it somewhere if you want to resume it later!)";
    static startMatchStageAnnounce = "The fighters will meet in the... [color=red][b]%s![/b][/color]";
    static startMatchFirstPlayer = "%s starts first for the [color=%s]%s[/color] team!";
    static startMatchFollowedBy = "%s will follow for the [color=%s]%s[/color] team.";

    static outputStatusInfo = `[b]Turn #%s[/b] [color=%s]------ %s team ------[/color] It's [u]%s[/u]'s turn.\n`;

    static setCurrentPlayerOK = `Successfully changed %s's place with %s's!`;
    static setCurrentPlayerFail = "Couldn't switch the two wrestlers. The name is either wrong, this fighter is already in the ring or this fighter isn't able to fight right now.";

    static rollAllDiceEchoRoll = "%s rolled a %s";

    static canAttackNoAction = `The last action hasn't been processed yet.`;
    static canAttackNotWaitingForAction = `The last action hasn't been processed yet.`;
    static cantAttackPlayerIsOut = `You are out of this fight.`;
    static cantAttackPlayerOutOfTheRing = `You cannot do that since you're not inside the ring.`;
    static cantAttackTargetIsOutOfTheRing = `One of your target(s) isn't inside the ring.`;
    static cantAttackTooManyTargets = `You can't target multiple players, this is a single-target attack.`;
    static cantAttackTargetOutOfFight = `One of your target(s) target is out of this fight.`;
    static canAttackIsInHold = `You cannot do that since you're in a hold.`;

    static checkAttackRequirementsNotInSexualHold = `You cannot do that since your target is not in a sexual hold.`;

    static doActionNotActorsTurn = `This isn't your turn.`;
    static doActionTargetIsSameTeam = "The targets for this action can't be in your team.";
    static doActionTargetIsNotSameTeam = "The targets for this action must be in your team.";

    static stillActorsTurn = `[b]This is still your turn %s![/b]`;

    static targetAlreadyStunned = "Your targets is already stunned, you can't stack the effects.";

    static forfeitItemApply = `%s forfeits! Which means... %s bondage items landing on them to punish them!`;
    static forfeitTooManyItems = `%s has too many items on them to possibly fight! [b][color=red]They're out![/color][/b]`;
    static forfeitAlreadyOut = `You are already out of the match. No need to give up.`;

    static tapoutMessage = `%s couldn't handle it anymore! They SUBMIT!`;
    static tapoutTooEarly = "You can't tap out right now. Submitting is only allowed after the %sth turn.";

    static finishFailMessage = `%s failed their finisher!`;
    static finishMessage = `%s couldn't fight against that! They're out!`;

    static checkForDrawOK = `Everybody agrees, it's a draw!`;
    static checkForDrawWaiting = `Waiting for the other players still in the fight to call the draw.`;
    static endFightAnnounce = "%s team wins the fight!";

    static wrongMatchTypeForAction = "You can't %s in a %s match.";

    static commandError = "[color=red]An error happened: %s[/color]";

    static statChangeSuccessful = "[color=green]You've successfully changed your stats![/color]";
    static registerWelcomeMessage = "[color=green]You are now registered! Welcome! Don't forget to read the quickstart guide AND the two collapses under Core Mechanics on [user]Rendezvous Wrestling[/user]'s profile.[/color]";

    static errorStatsPrivate = "[color=red]This wrestler's stats are private, or does not exist.[/color]";

    static errorAlreadyReady = "[color=red]You are already ready.[/color]";
    static errorFightAlreadyInProgress = "[color=red]There is already a fight in progress.[/color]";
    static errorNotRegistered = "[color=red]You are not registered.[/color]";
    static errorRecipientOrSenderNotFound = `[color=red]Either you or the receiver wasn't found in the fighter database.[/color]`;
    static errorNotEnoughMoney = `[color=red]You don't have enough ${Globals.currencyName}.[/color]`;
    static errorAlreadyRegistered = "[color=red]You are already registered.[/color]";
}

export class ActionType {
    static Bondage = "Bondage";
}

export enum Tier {
    None = -1,
    Light = 0,
    Medium = 1,
    Heavy = 2
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



export enum TierDifficulty {
    Light = 5,
    Medium = 10,
    Heavy = 15
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

export const Arenas = [
    "The Pit",
    "Wrestling Ring",
    "Arena",
    "Subway",
    "Skyscraper Roof",
    "Forest",
    "Cafe",
    "Street road",
    "Alley",
    "Park",
    "MMA Hexagonal Cage",
    "Hangar",
    "Swamp",
    "Glass Box",
    "Free Space",
    "Magic Shop",
    "Public Restroom",
    "School",
    "Pirate Ship",
    "Baazar",
    "Supermarket",
    "Night Club",
    "Docks",
    "Hospital",
    "Dark Temple",
    "Restaurant Kitchen",
    "Graveyard",
    "Zoo",
    "Slaughterhouse",
    "Junkyard"
];

export const finishers = [
    "Cum on the loser's face",
    "Tombstone Piledriver into the mats",
    "Make the loser lick the mats",
    "Smother"
];

export enum TriggerMoment {
    Never = -1,
    Before = 1 << 0,
    After = 1 << 1,
    Any = Before | After,
    FeatureTrigger = 1 << 2
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
