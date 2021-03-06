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
    static setFightTypeClassic = "RWFight name successfully set to Classic.";
    static setFightTypeTag = "RWFight name successfully set to Tag-Team.";
    static setFightTypeLMS = "RWFight name successfully set to Last Man Standing.";
    static setFightTypeHMatch = "RWFight name successfully set to Humiliation Match.";
    static setFightTypeSexFight = "RWFight name successfully set to SexFight.";
    static setFightTypeBondageMatch = "RWFight name successfully set to Bondage Match.";
    static setFightTypeNotFound = "Type not found. RWFight name reset to Classic.";
    static setFightTypeFail = "Can't change the fight name if the fight has already started or is already finished.";

    static startMatchAnnounce = "[color=green]Everyone's ready, let's start the match![/color] (Match ID: %s Keep it somewhere if you want to resume it later!)";
    static startMatchStageAnnounce = "The fighters will meet in the... [color=red][b]%s![/b][/color]";
    static startMatchFirstPlayer = "%s starts first for the [color=%s]%s[/color] team!";
    static startMatchFollowedBy = "%s will follow for the [color=%s]%s[/color] team.";

    static outputStatusInfo = `[b]Turn #%s[/b] [color=%s]------ %s team ------[/color] It's [u]%s[/u]'s turn.\n`;

    static setCurrentPlayerOK = `Successfully changed %s's place with %s's!`;
    static setCurrentPlayerFail = "Couldn't switch the two wrestlers. The name is either wrong, this user is already in the ring or this user isn't able to fight right now.";

    static rollAllDiceEchoRoll = "%s rolled a %s";

    static cantAttackExplanation = `You cannot do that right now: %s`;

    static lastActionStillProcessing = `The last action hasn't been processed yet.`;
    static playerOutOfFight = `You are out of this fight.`;
    static playerStillInFight = `You are still participating in this fight.`;
    static playerOutOfRing = `You are not inside the ring.`;
    static playerOnTheRing = `You are inside the ring.`;
    static targetOutOfRing = `One of your target(s) isn't inside the ring.`;
    static targetStillInRing = `One of your target(s) is still inside the ring.`;
    static tooManyTargets = `You can't target multiple players, this is a single-target attack.`;
    static targetOutOfFight = `One of your target(s) is out of this fight.`;
    static targetNotOutOfFight = `One of your target(s) is not out of this fight.`;
    static stuckInHold = `You're stuck in a hold.`;
    static mustBeStuckInHold  = "You must be stuck in a hold.";
    static mustNotBeStuckInHold  = "You must not be stuck in a hold.";
    static targetMustBeInRange = "Your target(s) must be in range.";
    static targetMustBeOffRange = "Your target(s) must be off range.";
    static targetMustBeInHold = "Your target(s) must be held in a hold.";
    static targetMustNotBeInHold = "Your target(s) must not be held in a hold.";

    static cantAddFeatureAlreadyHaveIt = "You already have this feature. You have to wait for it to expire before adding another of the same name.";

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
    static commandErrorWithStack = "[color=red]An error happened: %s\n%s[/color]";

    static statChangeSuccessful = "[color=green]You've successfully changed your stats![/color]";
    static registerWelcomeMessage = "[color=green]You are now registered! Welcome! Don't forget to read the quickstart guide AND the two collapses under Core Mechanics on [user]Rendezvous Wrestling[/user]'s profile.[/color]";

    static errorStatsPrivate = "[color=red]This wrestler's stats are private, or does not exist.[/color]";

    static errorAlreadyReady = "[color=red]You are already ready.[/color]";
    static errorFightAlreadyInProgress = "[color=red]There is already a fight in progress.[/color]";
    static errorNotRegistered = "[color=red]You are not registered.[/color]";
    static errorRecipientOrSenderNotFound = `[color=red]Either you or the receiver wasn't found in the fighter database.[/color]`;
    static errorNotEnoughMoney = `[color=red]You don't have enough money. Required: %s[/color]`;
    static errorAlreadyRegistered = "[color=red]You are already registered.[/color]";
    static errorTooManyDefendersForThisCall = "Wrong function call: there are too many targets, this function can only return one.";
}
