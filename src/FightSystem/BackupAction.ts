// import * as Constants from "../Common/BaseConstants";
// import Tier = Constants.Tier;
// import BaseDamage = Constants.BaseDamage;
// import {Fight} from "./Fight";
// import TierDifficulty = Constants.TierDifficulty;
// import Trigger = Constants.Trigger;
// import TokensPerWin = Constants.TokensPerWin;
// import FightTier = Constants.FightTier;
// import ModifierType = Constants.ModifierType;
// import TriggerMoment = Constants.TriggerMoment;
// import {HighRiskMultipliers} from "../Common/BaseConstants";
// import {Utils} from "../Common/Utils";
// import {StrapToyLPDamagePerTurn} from "../Common/BaseConstants";
// import {Modifier} from "./Modifiers/Modifier";
// import {ActiveFighter} from "./ActiveFighter";
// import {ActionRepository} from "./Repositories/ActionRepository";
// import {FocusDamageOnMiss} from "../Common/BaseConstants";
// import {FocusHealOnHit} from "../Common/BaseConstants";
// import {FocusDamageOnHit} from "../Common/BaseConstants";
// import {FailedHighRiskMultipliers} from "../Common/BaseConstants";
// import {MasturbateLpDamage} from "../Common/BaseConstants";
// import {SelfDebaseFpDamage} from "../Common/BaseConstants";
// import {StrapToyDiceRollPenalty} from "../Common/BaseConstants";
// import {ModifierFactory} from "./Modifiers/ModifierFactory";
// import {BaseFeatureParameter} from "../Common/BaseFeatureParameter";
// import {ActionType, BaseActionFactory, TypeAction} from "../Common/BaseAction";
// import {BaseActiveFighter} from "../Common/BaseActiveFighter";
//
// export class BackupAction extends BaseActionFactory<ActiveFighter>{
//
//
//     applyDamage(): void {
//         throw new Error("Method not implemented.");
//     }
//
//     save(): Promise<void> {
//         throw new Error("Method not implemented.");
//     }
//
//     hpDamageToDef: number = 0;
//     lpDamageToDef: number = 0;
//     fpDamageToDef: number = 0;
//     hpDamageToAtk: number = 0;
//     lpDamageToAtk: number = 0;
//     fpDamageToAtk: number = 0;
//     hpHealToDef: number = 0;
//     lpHealToDef: number = 0;
//     fpHealToDef: number = 0;
//     hpHealToAtk: number = 0;
//     lpHealToAtk: number = 0;
//     fpHealToAtk: number = 0;
//
//     attacker:ActiveFighter;
//     defender:ActiveFighter;
//
//     appliedModifiers:Modifier[] = [];
//
//     //That method determines the difficulty of a certain move.
//     requiredDiceScore():number{
//         let scoreRequired = 0;
//
//         if(this.fight && this.fight.diceLess){
//             return scoreRequired;
//         }
//         else if (this.type == ActionType.Bondage) {
//             scoreRequired = Constants.Fight.Action.RequiredScore.BondageBunny;
//         }
//         else{
//             if (this.type == ActionType.Finisher) {
//                 scoreRequired = this.addRequiredScore(scoreRequired, 6, "FIN");
//             }
//
//             scoreRequired = this.addRequiredScore(scoreRequired, (Constants.Fight.Action.Globals.difficultyIncreasePerBondageItem * this.attacker.bondageItemsOnSelf()), "BDG");
//
//             if(this.defender){
//                 scoreRequired = this.addRequiredScore(scoreRequired, -(Constants.Fight.Action.Globals.difficultyIncreasePerBondageItem * this.defender.bondageItemsOnSelf()), "BDG");
//                 scoreRequired = this.addRequiredScore(scoreRequired, Math.floor((this.defender.currentDexterity - this.attacker.currentDexterity) / 15), "DEXDIFF");
//
//                 if(this.defender.focus >= 0){
//                     scoreRequired = this.addRequiredScore(scoreRequired, Math.floor((this.defender.focus - this.attacker.focus) / 15), "FPDIFF");
//                 }
//                 if(this.defender.focus < 0){
//                     scoreRequired = this.addRequiredScore(scoreRequired, Math.floor(this.defender.focus / 10) - 1, "FPZERO");
//                 }
//
//                 let defenderStunnedTier = this.defender.getStunnedTier();
//                 if(defenderStunnedTier >= Tier.Light){
//                     switch(defenderStunnedTier){
//                         case Tier.Light:
//                             scoreRequired = this.addRequiredScore(scoreRequired, -2, "L-STUN");
//                             break;
//                         case Tier.Medium:
//                             scoreRequired = this.addRequiredScore(scoreRequired, -4, "M-STUN");
//                             break;
//                         case Tier.Heavy:
//                             scoreRequired = this.addRequiredScore(scoreRequired, -6, "H-STUN");
//                             break;
//                     }
//                 }
//             }
//
//             if(this.tier != -1){
//                 scoreRequired = this.addRequiredScore(scoreRequired, TierDifficulty[Tier[this.tier]], "TIER");
//             }
//         }
//         if(scoreRequired <= Constants.Globals.diceCount){
//             scoreRequired = Constants.Globals.diceCount;
//         }
//         this.diceRequiredRoll = scoreRequired;
//         return scoreRequired;
//     }
//
//     triggerAction():Trigger{
//         let result;
//         switch (this.type) {
//             case ActionType.Bondage:
//                 result = this.actionBondage();
//                 break;
//             case ActionType.Degradation:
//                 result = this.actionDegradation();
//                 break;
//             case ActionType.Escape:
//                 result = this.actionEscape();
//                 break;
//             case ActionType.ForcedWorship:
//                 result = this.actionForcedWorship();
//                 break;
//             case ActionType.HighRisk:
//                 result = this.actionHighRisk();
//                 break;
//             case ActionType.RiskyLewd:
//                 result = this.actionRiskyLewd();
//                 break;
//             case ActionType.HumHold:
//                 result = this.actionHumHold();
//                 break;
//             case ActionType.ItemPickup:
//                 result = this.actionItemPickup();
//                 break;
//             case ActionType.SexHold:
//                 result = this.actionSexHold();
//                 break;
//             case ActionType.SextoyPickup:
//                 result = this.actionSextoyPickup();
//                 break;
//             case ActionType.Rest:
//                 result = this.actionRest();
//                 break;
//             case ActionType.Tag:
//                 result = this.actionTag();
//                 break;
//             case ActionType.Stun:
//                 result = this.actionStun();
//                 break;
//             case ActionType.Submit:
//                 result = this.actionSubmit();
//                 break;
//             case ActionType.StrapToy:
//                 result = this.actionStrapToy();
//                 break;
//             case ActionType.Finisher:
//                 result = this.actionFinisher();
//                 break;
//             case ActionType.Masturbate:
//                 result = this.actionMasturbate();
//                 break;
//             case ActionType.SelfDebase:
//                 result = this.actionSelfDebase();
//                 break;
//             case ActionType.Pass:
//                 result = this.actionPass();
//                 break;
//             case ActionType.ReleaseHold:
//                 result = this.actionReleaseHold();
//                 break;
//             default:
//                 this.fight.message.addHit("WARNING! UNKNOWN ATTACK!");
//                 result = Trigger.None;
//                 break;
//         }
//         return result;
//     }
//
//
//     actionDegradation():Trigger{
//         this.attacker.triggerMods(TriggerMoment.Before, Trigger.Degradation);
//         this.diceRollRawValue = this.attacker.roll(1);
//         this.diceRollBonusFromStat = Math.ceil(this.attacker.currentSensuality / 10);
//         this.diceScore = this.diceRollRawValue + this.diceRollBonusFromStat;
//         if(this.diceScore >= this.requiredDiceScore()) {
//             this.missed = false;
//             this.fpHealToAtk += FocusHealOnHit[Tier[this.tier]];
//             this.fpDamageToDef += FocusDamageOnHit[Tier[this.tier]] * Constants.Fight.Action.Globals.degradationFocusMultiplier;
//         }
//         return Trigger.Degradation;
//     }
//
//
//     actionReleaseHold():Trigger{
//         this.attacker.triggerMods(TriggerMoment.Before, Trigger.Escape);
//         this.defender = null;
//         this.requiresRoll = false;
//         this.missed = false;
//         if(this.attacker.isApplyingHold()){
//             this.attacker.releaseHoldsApplied();
//         }
//         return Trigger.Escape;
//     }
//
//     actionSubmit():Trigger{
//         this.attacker.triggerMods(TriggerMoment.Before, Trigger.Submit);
//         this.requiresRoll = false;
//         this.missed = false;
//         this.defender = null;
//         this.attacker.triggerPermanentOutsideRing();
//         this.fight.message.addHit(Utils.strFormat(Constants.Messages.tapoutMessage, [this.attacker.getStylizedName()]));
//         return Trigger.Submit;
//     }
//
//     actionStrapToy():Trigger{
//         this.attacker.triggerMods(TriggerMoment.Before, Trigger.StrapToy);
//         this.diceRollRawValue = this.attacker.roll(1);
//         this.diceRollBonusFromStat = Math.ceil(this.attacker.currentSensuality / 10);
//         this.diceScore = this.diceRollRawValue + this.diceRollBonusFromStat;
//         if(this.diceScore >= this.requiredDiceScore()){
//             this.missed = false;
//             this.fpHealToAtk += FocusHealOnHit[Tier[this.tier]];
//             this.fpDamageToDef += FocusDamageOnHit[Tier[this.tier]];
//             let nbOfTurnsWearingToy = this.tier + 1;
//             let lpDamage = StrapToyLPDamagePerTurn[Tier[this.tier]];
//             let strapToyModifier = ModifierFactory.getModifier(ModifierType.StrapToy, this.fight, this.defender, null, {focusDamage: this.fpDamageToDef, lustDamage: lpDamage, tier: this.tier, diceRoll: StrapToyDiceRollPenalty[Tier[this.tier]], uses: nbOfTurnsWearingToy});
//             this.appliedModifiers.push(strapToyModifier);
//             this.fight.message.addHit("The sextoy started vibrating!");
//         }
//         return Trigger.StrapToy;
//     }
//
//     actionFinisher():Trigger{
//         this.attacker.triggerMods(TriggerMoment.Before, Trigger.Finisher);
//         this.tier = Tier.Heavy;
//         this.diceRollRawValue = this.attacker.roll(1);
//         this.diceRollBonusFromStat = Math.ceil(this.attacker.currentWillpower / 10);
//         this.diceScore = this.diceRollRawValue + this.diceRollBonusFromStat;
//         if((this.defender.livesRemaining <= 1 || this.defender.consecutiveTurnsWithoutFocus == Constants.Fight.Action.Globals.maxTurnsWithoutFocus - 2) && this.diceScore >= this.requiredDiceScore()){
//             this.missed = false;
//             this.defender.triggerPermanentOutsideRing();
//             this.fight.message.addHit(Utils.strFormat(Constants.Messages.finishMessage, [this.defender.getStylizedName()]));
//         }
//         else{
//             this.missed = true;
//             this.fpDamageToDef += FocusDamageOnMiss[Tier[Tier.Heavy]];
//             this.fight.message.addHit(Utils.strFormat(Constants.Messages.finishFailMessage, [this.attacker.getStylizedName()]));
//         }
//
//         return Trigger.Finisher;
//     }
//
//     actionMasturbate():Trigger{
//         this.defender = null;
//         this.requiresRoll = false;
//         this.missed = false;
//         this.lpDamageToAtk = MasturbateLpDamage[Tier[this.tier]];
//         return Trigger.PassiveAction;
//     }
//
//     actionSelfDebase():Trigger{
//         this.defender = null;
//         this.requiresRoll = false;
//         this.missed = false;
//         this.fpDamageToAtk = SelfDebaseFpDamage[Tier[this.tier]];
//         return Trigger.PassiveAction;
//     }
//
//     actionPass():Trigger{
//         this.defender = null;
//         this.requiresRoll = false;
//         this.missed = false;
//         this.fpDamageToAtk = Constants.Fight.Action.Globals.passFpDamage;
//         return Trigger.PassiveAction;
//     }
//
//     async commit(fight:Fight){
//         let strTier = "";
//         if(this.tier >= 0){
//             strTier = Tier[this.tier];
//         }
//
//         if(this.defender){
//             fight.message.addAction(`${strTier} ${ActionType[this.type]} on ${this.defender.getStylizedName()}`);
//         }
//         else{
//             fight.message.addAction(`${strTier} ${ActionType[this.type]}`);
//         }
//
//         if(this.missed == false){
//             let strActionType = ActionType[this.type];
//             let explanation = ActionExplanation[strActionType];
//             if(explanation != null){
//                 fight.message.addHit(Utils.strFormat(explanation, [this.attacker.getStylizedName()]));
//             }
//             else{
//                 fight.message.addHit(Constants.Messages.HitMessage);
//             }
//
//             if(this.tier == Tier.Heavy && this.defender != null && this.attacker.isInHoldAppliedBy(this.defender.name)){
//                 this.attacker.releaseHoldsAppliedBy(this.defender.name);
//                 fight.message.addHit(Utils.strFormat(Constants.Messages.ForcedHoldRelease, [this.attacker.getStylizedName(), this.defender.getStylizedName()]));
//             }
//             else if(this.tier == Tier.Heavy && this.defender != null && this.defender.isApplyingHold()){
//                 this.defender.releaseHoldsApplied();
//                 fight.message.addHit(Utils.strFormat(Constants.Messages.ForcedHoldRelease, [this.attacker.getStylizedName(), this.defender.getStylizedName()]));
//             }
//         }
//         else{
//             fight.message.addHit(` MISS! `);
//             this.attacker.hitFP(FocusDamageOnMiss[Tier[this.tier]]);
//         }
//
//         if(this.requiresRoll){
//             fight.message.addHint(`Rolled: ${this.diceScore} [sub](RLL: ${this.diceRollRawValue} + STAT:${this.diceRollBonusFromStat})[/sub]`);
//             fight.message.addHint(`Required roll: ${this.diceRequiredRoll} [sub](${this.difficultyExplanation})[/sub]`);
//             fight.message.addHint(`Damage calculation detail: [sub](BSE:${this.diceScoreBaseDamage} + STA:${this.diceScoreStatDifference} + OVR:${this.diceScoreBonusPoints})[/sub]`);
//         }
//
//         //Features check
//         this.attacker.triggerFeatures(TriggerMoment.After, Trigger.AnyAction, new BaseFeatureParameter(this.fight, this.attacker, this.defender, this));
//         if(this.defender){
//             this.defender.triggerFeatures(TriggerMoment.After, Trigger.AnyAction, new BaseFeatureParameter(this.fight, this.defender, this.attacker, this));
//         }
//
//
//
//
//         fight.pastActions.push(this);
//
//         if (this.hpDamageToDef > 0) {
//             this.defender.hitHP(this.hpDamageToDef);
//             this.fight.message.HPDamageDef = this.hpDamageToDef;
//         }
//         if (this.lpDamageToDef > 0) {
//             this.defender.hitLP(this.lpDamageToDef);
//             this.fight.message.LPDamageDef = this.lpDamageToDef;
//         }
//         if(this.fpDamageToDef > 0){
//             this.defender.hitFP(this.fpDamageToDef);
//             this.fight.message.FPDamageDef = this.fpDamageToDef;
//         }
//         if (this.hpHealToDef > 0) {
//             this.defender.healHP(this.hpHealToDef);
//             this.fight.message.HPHealDef = this.hpHealToDef;
//         }
//         if (this.lpHealToDef > 0) {
//             this.defender.healLP(this.lpHealToDef);
//             this.fight.message.LPHealDef = this.lpHealToDef;
//         }
//         if(this.fpHealToDef > 0){
//             this.defender.healFP(this.fpHealToDef);
//             this.fight.message.FPHealDef = this.fpHealToDef;
//         }
//
//
//         if (this.hpDamageToAtk > 0) {
//             this.attacker.hitHP(this.hpDamageToAtk);
//             this.fight.message.HPDamageAtk = this.hpDamageToAtk;
//         }
//         if (this.lpDamageToAtk > 0) {
//             this.attacker.hitLP(this.lpDamageToAtk);
//             this.fight.message.LPDamageAtk = this.lpDamageToAtk;
//         }
//         if(this.fpDamageToAtk > 0){
//             this.attacker.hitFP(this.fpDamageToAtk);
//             this.fight.message.FPDamageAtk = this.fpDamageToAtk;
//         }
//         if (this.hpHealToAtk > 0) {
//             this.attacker.healHP(this.hpHealToAtk);
//             this.fight.message.HPHealAtk = this.hpHealToAtk;
//         }
//         if (this.lpHealToAtk > 0) {
//             this.attacker.healLP(this.lpHealToAtk);
//             this.fight.message.LPHealAtk = this.lpHealToAtk;
//         }
//         if(this.fpHealToAtk > 0){
//             this.attacker.healFP(this.fpHealToAtk);
//             this.fight.message.FPHealAtk = this.fpHealToAtk;
//         }
//
//
//         if(this.appliedModifiers.length > 0){
//             if (this.type == ActionType.SubHold || this.type == ActionType.SexHold || this.type == ActionType.HumHold) { //for any holds, do the stacking here
//                 let indexOfNewHold = this.appliedModifiers.findIndex(x => x.type == Constants.ModifierType.SubHold || x.type == Constants.ModifierType.SexHold || x.type == Constants.ModifierType.HumHold);
//                 let indexOfAlreadyExistantHoldForDefender = this.defender.appliedModifiers.findIndex(x => x.type == Constants.ModifierType.SubHold || x.type == Constants.ModifierType.SexHold || x.type == Constants.ModifierType.HumHold);
//                 if(indexOfAlreadyExistantHoldForDefender != -1){
//                     let idOfFormerHold = this.defender.appliedModifiers[indexOfAlreadyExistantHoldForDefender].idModifier;
//                     let mod:Modifier;
//                     for(let mod of this.defender.appliedModifiers){
//                         //we updated the children and parent's damage and turns
//                         if(mod.idModifier == idOfFormerHold){
//                             mod.type = this.appliedModifiers[indexOfNewHold].type;
//                             mod.event = this.appliedModifiers[indexOfNewHold].event;
//                             mod.uses += this.appliedModifiers[indexOfNewHold].uses;
//                             mod.hpDamage += this.appliedModifiers[indexOfNewHold].hpDamage;
//                             mod.lustDamage += this.appliedModifiers[indexOfNewHold].lustDamage;
//                             mod.focusDamage += this.appliedModifiers[indexOfNewHold].focusDamage;
//                             //Did not add the dice/escape score modifications, if needed, implement here
//                         }
//                         else if(mod.idParentActions && mod.idParentActions.indexOf(idOfFormerHold) != -1){
//                             mod.uses += this.appliedModifiers[indexOfNewHold].uses;
//                         }
//                     }
//                     for(let mod of this.attacker.appliedModifiers){
//                         //update the bonus appliedModifiers length
//                         if(mod.idParentActions && mod.idParentActions.indexOf(idOfFormerHold) != -1){
//                             mod.uses += this.appliedModifiers[indexOfNewHold].uses;
//                         }
//                     }
//                     fight.message.addSpecial(`[b][color=red]Hold Stacking![/color][/b] ${this.defender.name} will have to suffer this hold for ${this.appliedModifiers[indexOfNewHold].uses} more turns, and will also suffer a bit more, as it has added
//                                      ${(this.appliedModifiers[indexOfNewHold].hpDamage > 0 ? " -"+this.appliedModifiers[indexOfNewHold].hpDamage+" HP per turn ":"")}
//                                      ${(this.appliedModifiers[indexOfNewHold].lustDamage > 0 ? " +"+this.appliedModifiers[indexOfNewHold].lustDamage+" Lust per turn ":"")}
//                                      ${(this.appliedModifiers[indexOfNewHold].focusDamage > 0 ? " -"+this.appliedModifiers[indexOfNewHold].focusDamage+" Focus per turn":"")}
//                      `);
//                 }
//                 else{
//                     for(let mod of this.appliedModifiers){
//                         if(mod.receiver == this.defender){
//                             this.defender.appliedModifiers.push(mod);
//                         }
//                         else if(mod.receiver == this.attacker){
//                             this.attacker.appliedModifiers.push(mod);
//                         }
//                     }
//                 }
//             }
//             else{
//                 for(let mod of this.appliedModifiers){
//                     if(mod.receiver == this.attacker){
//                         this.attacker.appliedModifiers.push(mod);
//                     }
//                     else if(mod.receiver == this.defender){
//                         this.defender.appliedModifiers.push(mod);
//                     }
//                 }
//             }
//         }
//
//         if(this.attacker){
//             this.attacker.isTechnicallyOut(true);
//         }
//         if(this.defender){
//             this.defender.isTechnicallyOut(true);
//         }
//
//         //Save it to the DB
//         await ActionRepository.persist(this);
//
//         //check for fight ending status
//         if ((this.type == ActionType.Escape || this.type == ActionType.ReleaseHold)  && this.missed == false) {
//             fight.message.addHint(`[b]This is still your turn ${this.attacker.getStylizedName()}![/b]`);
//             fight.message.send();
//             fight.waitingForAction = true;
//         }
//         else if (!fight.isOver()) {
//             fight.nextTurn();
//         }
//         else {
//             let tokensToGiveToWinners:number = TokensPerWin[FightTier[fight.getFightTier(fight.winnerTeam)]];
//             let tokensToGiveToLosers:number = tokensToGiveToWinners * Constants.Fight.Globals.tokensPerLossMultiplier;
//             if(fight.isDraw()){
//                 fight.message.addHit(`DOUBLE KO! Everyone is out! It's over!`);
//                 tokensToGiveToLosers = tokensToGiveToWinners;
//             }
//             fight.outputStatus();
//
//             await fight.endFight(tokensToGiveToWinners, tokensToGiveToLosers);
//         }
//     }
//
// }
//
// export class EmptyAction extends Action {
//     constructor() {
//         super("", 0, 0, 0, "", null);
//     }
// }
//
//
// export enum ActionTypeAdvanced  {
//     Brawl = 10,
//     Tease  = 11,
//     Tag = 12,
//     Rest = 13,
//     SubHold = 14,
//     SexHold = 15,
//     Bondage = 16,
//     HumHold = 17,
//     ItemPickup = 18,
//     SextoyPickup = 19,
//     Degradation = 20,
//     ForcedWorship = 21,
//     HighRisk = 22,
//     RiskyLewd = 23,
//     Stun = 24,
//     Escape = 25,
//     Submit = 26,
//     StrapToy = 27,
//     Finisher = 28,
//     Masturbate = 29,
//     Pass = 30,
//     ReleaseHold = 31,
//     SelfDebase = 32
// }
//
// type TypeAction = ActionType | ActionTypeAdvanced;
//
// export class ActionExplanation {
//     static Tag = `[b][color=red]TAG![/color][/b] %s heads out of the ring!`;
//     static Rest = `[b][color=red]%s rests for a bit![/color][/b]`;
//     static Bondage = `[b][color=red]%s just tied up their opponent a little bit more![/color][/b]`;
//     static ItemPickup = `[b][color=red]%s's picked up item looks like it could it hit hard![/color][/b]`;
//     static SextoyPickup = `[b][color=red]%s is going to have a lot of fun with this sex-toy![/color][/b]`;
//     static Escape = `[b][color=red]%s got away![/color][/b]`;
//     static Submit = `[b][color=red]%s taps out! It's over, it's done![/color][/b]`;
//     static Masturbate = `[b][color=red]%s really needed those strokes apparently![/color][/b]`;
//     static Pass = `[b][color=red]%s passed their turn...[/color][/b]`;
//     static SelfDebase = `[b][color=red]%s is sinking deeper...[/color][/b]`;
// }