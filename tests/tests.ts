import {RWFight} from "../src/FightSystem/Fight/RWFight";
import {RendezVousWrestling} from "../src/FightSystem/RendezVousWrestling";
import * as BaseConstants from "../src/Common/BaseConstants";
import {Utils} from "../src/Common/Utils/Utils";
import {ActiveFighter} from "../src/FightSystem/Fight/ActiveFighter";
import {FighterRepository} from "../src/FightSystem/Repositories/FighterRepository";
import {ActiveFighterRepository} from "../src/FightSystem/Repositories/ActiveFighterRepository";
import {ActionRepository} from "../src/FightSystem/Repositories/ActionRepository";
import {FightRepository} from "../src/FightSystem/Repositories/FightRepository";
import {Dice} from "../src/Common/Utils/Dice";
import {ModifierRepository} from "../src/FightSystem/Repositories/ModifierRepository";
import {ActionType} from "../src/FightSystem/Actions/RWAction";
import {FeatureType, ModifierType} from "../src/FightSystem/RWConstants";
import {IMsgEvent} from "fchatlib/dist/src/Interfaces/IMsgEvent";
import {Messages} from "../src/Common/Constants/Messages";
import {GameSettings} from "../src/Common/Configuration/GameSettings";
import {FeatureFactory} from "../src/FightSystem/Features/FeatureFactory";

let Jasmine = require('jasmine');
let jasmine = new Jasmine();
let fChatLibInstance:any;
let debug = false;
let mockedClasses = [];
let usedIndexes = [];
let usedFighters = [];

const DEFAULT_TIMEOUT_UNIT_TEST = 500;

function getMock(mockedClass) {
    if (mockedClasses.indexOf(mockedClass) != -1) {
        return new mockedClasses[mockedClasses.indexOf(mockedClass)]();
    }
    Object.getOwnPropertyNames(mockedClass.prototype).forEach(m => spyOn(mockedClass.prototype, m).and.callThrough());
    mockedClasses.push(mockedClass);

    return new mockedClass();
}

//
//Abstraction of database layer
//

function abstractDatabase() {

    FighterRepository.load = async function (name) {
        return await createFighter(name);
    };

    ActiveFighterRepository.initialize = async function (name) {
        return await createFighter(name);
    };

    ActiveFighterRepository.load = async function (name) {
        return await createFighter(name);
    };

    ActionRepository.persist = async function (action) {
        action.idAction = Utils.generateUUID();
    };

    FightRepository.persist = async function () {
        return;
    };

    FighterRepository.persist = async function () {
        return;
    };

    ActiveFighterRepository.persist = async function () {
        return;
    };

    FighterRepository.exists = async function () {
        return true;
    };

    FightRepository.exists = async function () {
        return false;
    };

    FighterRepository.logTransaction = async function () {
        return;
    };

    ActiveFighterRepository.exists = async function () {
        return false;
    };

    FightRepository.load = async function () {
        return new RWFight();
    };

    ModifierRepository.persist = async function () {
    };

    ModifierRepository.loadFromFight = async function () {
        return [];
    };

    ModifierRepository.delete = async function () {
    };

    ModifierRepository.exists = async function () {
        return true;
    };

    ModifierRepository.deleteFromFight = async function () {
    };
}

//Utilities

function createFighter(name):ActiveFighter {
    let myFighter;
    let intStatsToAssign:number = Math.floor(GameSettings.numberOfRequiredStatPoints / GameSettings.numberOfDifferentStats);
    let statOverflow:number = GameSettings.numberOfRequiredStatPoints - (intStatsToAssign * GameSettings.numberOfDifferentStats);
    if (Utils.findIndex(usedFighters, "name", name) == -1) {
        myFighter = getMock(ActiveFighter);
        let randomId = -1;
        do {
            randomId = Utils.getRandomInt(0, 1000000);
        } while (usedIndexes.indexOf(randomId) != -1);
        myFighter.power = myFighter.dexterity = myFighter.sensuality = myFighter.toughness = myFighter.willpower = myFighter.endurance = intStatsToAssign;
        myFighter.endurance = myFighter.endurance + statOverflow;
        myFighter.startingPower = intStatsToAssign;
        myFighter.startingEndurance = intStatsToAssign;
        myFighter.startingSensuality = intStatsToAssign;
        myFighter.startingToughness = intStatsToAssign;
        myFighter.startingWillpower = intStatsToAssign;
        myFighter.startingDexterity = intStatsToAssign;
        myFighter.dexterityDelta = 0;
        myFighter.enduranceDelta = 0;
        myFighter.powerDelta = 0;
        myFighter.sensualityDelta = 0;
        myFighter.toughnessDelta = 0;
        myFighter.willpowerDelta = 0;
        myFighter.id = randomId;
        myFighter.name = name;
        myFighter.hp = myFighter.hpPerHeart();
        myFighter.livesRemaining = myFighter.maxLives();
        myFighter.lust = 0;
        myFighter.focus = myFighter.willpower;
        myFighter.dice = new Dice(10);
        myFighter.tokens = 1000;
        usedFighters.push(myFighter);
    }
    else {
        myFighter = usedFighters[Utils.findIndex(usedFighters, "name", name)];
    }

    return myFighter;
}

async function doAction(cmd:RendezVousWrestling, action:string, target:string = "", waitAtEnding:boolean = true) {
    await cmd.fight.waitUntilWaitingForAction();
    cmd.fight.currentPlayer.dice.addMod(50);
    await cmd[action](target, {character: cmd.fight.currentPlayer.name, channel: "here"});
    if(waitAtEnding){
        await cmd.fight.waitUntilWaitingForAction();
    }
}


function wasHealthHit(cmd:RendezVousWrestling, name:string) {
    return (
        (
            cmd.fight.getFighterByName(name).hp == cmd.fight.getFighterByName(name).hpPerHeart() &&
            cmd.fight.getFighterByName(name).livesRemaining < cmd.fight.getFighterByName(name).maxLives()
        )
        ||
        cmd.fight.getFighterByName(name).hp < cmd.fight.getFighterByName(name).hpPerHeart()
    );
}

function wasLustHit(cmd:RendezVousWrestling, name:string) {
    return (
        (
            cmd.fight.getFighterByName(name).lust == cmd.fight.getFighterByName(name).lustPerOrgasm() &&
            cmd.fight.getFighterByName(name).livesRemaining < cmd.fight.getFighterByName(name).maxLives()
        )
        ||
        cmd.fight.getFighterByName(name).lust < cmd.fight.getFighterByName(name).lustPerOrgasm()
    );
}

async function initiateMatchSettings2vs2Tag(cmdHandler) {
    cmdHandler.fight.setFightType("tag");
    await cmdHandler.join("Red", {character: "Aelith Blanchette", channel: "here"});
    await cmdHandler.join("Purple", {character: "Purple1", channel: "here"});
    await cmdHandler.join("Purple", {character: "Purple2", channel: "here"});
    await cmdHandler.join("Red", {character: "TheTinaArmstrong", channel: "here"});
    await cmdHandler.ready("Red", {character: "TheTinaArmstrong", channel: "here"});
    await cmdHandler.ready("Red", {character: "Aelith Blanchette", channel: "here"});
    await cmdHandler.ready("Red", {character: "Purple1", channel: "here"});
    await cmdHandler.ready("Red", {character: "Purple2", channel: "here"});
}

async function initiateMatchSettings1vs1(cmdHandler) {
    cmdHandler.fight.setFightType("tag");
    await cmdHandler.join("Red", {character: "Aelith Blanchette", channel: "here"});
    await cmdHandler.join("Blue", {character: "TheTinaArmstrong", channel: "here"});
    await cmdHandler.ready("Blue", {character: "TheTinaArmstrong", channel: "here"});
    await cmdHandler.ready("Red", {character: "Aelith Blanchette", channel: "here"});
}

function wasMessageSent(msg) {
    return fChatLibInstance.sendMessage.calls.all().find(x => x.args[0].indexOf(msg) != -1) != undefined;
}

function wasPrivMessageSent(msg) {
    return fChatLibInstance.sendPrivMessage.calls.all().find(x => x.args[0].indexOf(msg) != -1) != undefined;
}

function refillHPLPFP(cmd, name) {
    cmd.fight.getFighterByName(name).livesRemaining = cmd.fight.getFighterByName(name).maxLives();
    cmd.fight.getFighterByName(name).consecutiveTurnsWithoutFocus = 0; //to prevent ending the fight this way
    cmd.fight.getFighterByName(name).focus = cmd.fight.getFighterByName(name).maxFocus();
}

let messageBuffer = [];
abstractDatabase();
fChatLibInstance = {
    sendMessage: function (message:string, channel:string) {
        messageBuffer.push("Sent MESSAGE " + message + " on channel " + channel);
        if (debug) {
            console.log("Sent MESSAGE " + message + " on channel " + channel);
        }
    },
    throwError: function (s:string) {
        messageBuffer.push("Sent ERROR " + s);
        if (debug) {
            console.log("Sent ERROR " + s);
        }
    },
    sendPrivMessage: function (character:string, message:string) {
        messageBuffer.push("Sent PRIVMESSAGE " + message + " to " + character);
        if (debug) {
            console.log("Sent PRIVMESSAGE " + message + " to " + character);
        }
    },
    addPrivateMessageListener: function () {

    },
    isUserChatOP: function (username:string) {
        return username == "Aelith Blanchette";
    }
};

describe("Before the fight, the test suite should verify that", () => {
    beforeEach(function () {
        usedIndexes = [];
        usedFighters = [];
        messageBuffer = [];

        spyOn(fChatLibInstance, 'sendMessage').and.callThrough();
        spyOn(fChatLibInstance, 'throwError').and.callThrough();
        spyOn(fChatLibInstance, 'sendPrivMessage').and.callThrough();
        spyOn(ActiveFighterRepository, 'load').and.callThrough();
        spyOn(ActiveFighterRepository, 'initialize').and.callThrough();
        spyOn(FighterRepository, 'load').and.callThrough();

        debug = false;

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should create a fighter named Aelith", function () { //1
        let fighter = createFighter("Aelith");
        expect(fighter.name).toBe("Aelith");
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should two fighters can be initialized with two different names", async function () { //2
        let fighter = createFighter("Aelith");
        let secondFighter = createFighter("NotAelith");
        expect(fighter.name + secondFighter.name).toBe("AelithNotAelith");
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should create a fighter with all the stats adding up to the requirement", async function () { //2
        let fighter = createFighter("Yolo");
        expect(fighter.endurance + fighter.dexterity + fighter.sensuality + fighter.power + fighter.willpower + fighter.toughness).toBe(GameSettings.numberOfRequiredStatPoints);
    }, DEFAULT_TIMEOUT_UNIT_TEST);

});

describe("Before the fight", () => {
    beforeEach(function () {
        usedIndexes = [];
        usedFighters = [];
        messageBuffer = [];

        spyOn(fChatLibInstance, 'sendMessage').and.callThrough();
        spyOn(fChatLibInstance, 'throwError').and.callThrough();
        spyOn(fChatLibInstance, 'sendPrivMessage').and.callThrough();
        spyOn(ActiveFighterRepository, 'load').and.callThrough();
        spyOn(ActiveFighterRepository, 'initialize').and.callThrough();
        spyOn(FighterRepository, 'load').and.callThrough();

        debug = false;

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should check if a joining fighter exists", async function (done) { //4
        let x = new RendezVousWrestling(fChatLibInstance, "here");
        let data:IMsgEvent = {message: "", character: "Aelith Blanchette", channel: "here"};
        await x.join("", data);
        expect(ActiveFighterRepository.initialize).toHaveBeenCalled();
        done();
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should not allow a player to join a match twice", async function (done) { //5
        let x = new RendezVousWrestling(fChatLibInstance, "here");
        let data:IMsgEvent = {message: "", character: "Aelith Blanchette", channel: "here"};
        await x.join("", data);
        await x.join("", data);
        if (wasMessageSent("You have already joined the fight")) {
            done();
        }
        else {
            done.fail(new Error("The player joined the match twice"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should wait for everyone to start using the default blue and red team", async function (done) { //8
        let x = new RendezVousWrestling(fChatLibInstance, "here");
        await x.join("", {message: "", character: "Aelith Blanchette", channel: "here"});
        await x.join("", {message: "", character: "TheTinaArmstrong", channel: "here"});
        if (wasMessageSent("stepped into the ring for the [color=Blue]Blue[/color] team! Waiting for everyone to be !ready.")
            && wasMessageSent("stepped into the ring for the [color=Red]Red[/color] team! Waiting for everyone to be !ready.")
            && x.fight.hasStarted == false) {
            done();
        }
        else {
            done.fail(new Error("Did not put the player as ready"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should let a player join the match", async function (done) { //3
        let x = new RendezVousWrestling(fChatLibInstance, "here");
        let data:IMsgEvent = {message: "", character: "Aelith Blanchette", channel: "here"};
        await x.join("", data);
        if (wasMessageSent("stepped into the ring for the")) {
            done();
        }
        else {
            done.fail(new Error("The player couldn't join the match"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should let a player join the match and set themselves as ready", async function (done) { //6
        let x = new RendezVousWrestling(fChatLibInstance, "here");
        let data:IMsgEvent = {message: "", character: "Aelith Blanchette", channel: "here"};
        await x.ready("", data);
        if (wasMessageSent("is now ready to get it on!")) {
            done();
        }
        else {
            done.fail(new Error("Did not put the player as ready"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should not let a player that is already ready to do it again", async function (done) { //7
        let x = new RendezVousWrestling(fChatLibInstance, "here");
        let data:IMsgEvent = {message: "", character: "Aelith Blanchette", channel: "here"};
        await x.ready("", data);
        await x.ready("", data);
        if (wasMessageSent("You are already ready.")) {
            done();
        }
        else {
            done.fail(new Error("Did not successfully check if the fighter was already ready"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);
});

/// <reference path="../typings/jasmine/jasmine.d.ts">
describe("Before the fight, the player(s)", () => {

    beforeEach(function () {
        usedIndexes = [];
        usedFighters = [];
        messageBuffer = [];

        spyOn(fChatLibInstance, 'sendMessage').and.callThrough();
        spyOn(fChatLibInstance, 'throwError').and.callThrough();
        spyOn(fChatLibInstance, 'sendPrivMessage').and.callThrough();
        spyOn(ActiveFighterRepository, 'load').and.callThrough();
        spyOn(ActiveFighterRepository, 'initialize').and.callThrough();
        spyOn(FighterRepository, 'load').and.callThrough();

        debug = false;

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should tag successfully with Aelith", async function (done) { // 9
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings2vs2Tag(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "tag", "Aelith Blanchette");
        await cmd.fight.waitUntilWaitingForAction();
        if ((cmd.fight.getFighterByName("Aelith Blanchette").isInTheRing)) {
            done();
        }
        else {
            done.fail(new Error("Did not tag with Aelith"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST + 100000);

    it("should swap to TheTinaArmstrong", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        let fighterNameBefore = cmd.fight.currentPlayer.name;
        cmd.fight.assignRandomTargetToFighter(cmd.fight.currentPlayer);
        cmd.fight.setCurrentPlayer(cmd.fight.currentTarget[0].name);
        if (cmd.fight.currentPlayer.name != fighterNameBefore) {
            done();
        }
        else {
            done.fail(new Error("Fighters didn't swap places."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should do a brawl move", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "brawl", "Light");
        if (wasHealthHit(cmd, "Aelith Blanchette")) {
            done();
        }
        else {
            done.fail(new Error("HPs were not drained despite the fact that the attack should have hit."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should do a sexstrike move", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        await doAction(cmd, "tease", "Light");
        if (wasLustHit(cmd, "Aelith Blanchette")) {
            done();
        }
        else {
            done.fail(new Error("Did not do a sextrike move, or the damage wasn't done"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should do a highrisk move", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "highrisk", "Light");
        if (wasHealthHit(cmd, "Aelith Blanchette")) {
            done();
        }
        else {
            done.fail(new Error("HPs were not drained despite the fact that the attack should have hit."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should do a penetration move", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "riskylewd", "Light");
        if (wasLustHit(cmd, "Aelith Blanchette")) {
            done();
        }
        else {
            done.fail(new Error("HPs were not drained despite the fact that the attack should have hit."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should pass", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        let fighterNameBefore = cmd.fight.currentPlayer.name;
        await doAction(cmd, "rest", "");
        await cmd.fight.waitUntilWaitingForAction();
        if (cmd.fight.currentPlayer.name != fighterNameBefore) {
            done();
        }
        else {
            done.fail(new Error("Did not pass turn correctly"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it(`should give a loss after ${BaseConstants.Fight.Action.Globals.maxTurnsWithoutFocus} turns without focus`, async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.getFighterByName("Aelith Blanchette").focus = -100;
        for (let i = 0; i < BaseConstants.Fight.Action.Globals.maxTurnsWithoutFocus; i++) {
            await cmd.fight.nextTurn();
        }
        if (cmd.fight.getFighterByName("Aelith Blanchette").isBroken()) {
            done();
        }
        else {
            done.fail(new Error(`Player was still alive after ${BaseConstants.Fight.Action.Globals.maxTurnsWithoutFocus} turns without focus`));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST + 10000);

    it("should do a subhold and tick", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "subhold", "Light");
        if (wasHealthHit(cmd, "Aelith Blanchette") && cmd.fight.getFighterByName("Aelith Blanchette").modifiers.findIndex(x => x.name == ModifierType.SubHold) != -1) {
            done();
        }
        else {
            done.fail(new Error("Didn't tick subhold"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should do a subhold and expire after the number of turns specified", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "subhold", "Light");
        for (let i = 0; i < BaseConstants.Fight.Action.Globals.initialNumberOfTurnsForHold; i++) {
            await cmd.fight.nextTurn();
            refillHPLPFP(cmd, "Aelith Blanchette");
        }
        if (cmd.fight.getFighterByName("Aelith Blanchette").modifiers.length == 0) {
            done();
        }
        else {
            done.fail(new Error("Did not correctly expire the sexhold appliedModifiers."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should do a subhold and let the opponent escape", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "subhold", "Light");
        await doAction(cmd, "escape", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (cmd.fight.currentPlayer == cmd.fight.getFighterByName("Aelith Blanchette")) {
            done();
        }
        else {
            done.fail(new Error("Did not say that the attacker has an accuracy bonus."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should do a subhold and trigger bonus brawl modifier", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "subhold", "Light");
        await doAction(cmd, "brawl", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (wasMessageSent(ModifierType.SubHoldBrawlBonus)) {
            done();
        }
        else {
            done.fail(new Error("Did not say that the attacker has an accuracy bonus."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should not be allowed to do a subhold while already in one", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "subhold", "Light");
        await doAction(cmd, "subhold", "Light", false);
        if (wasPrivMessageSent(Messages.mustNotBeStuckInHold)) {
            done();
        }
        else {
            done.fail(new Error("Did not say "+Messages.mustNotBeStuckInHold));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should be allowed to do a second subhold while already APPLYING one", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "subhold", "Light");
        await cmd.fight.nextTurn();
        await doAction(cmd, "subhold", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (!wasMessageSent("[b][color=red]You cannot do that since you're in a hold.[/color][/b]\n")) {
            done();
        }
        else {
            done.fail(new Error("Didn't stack the two subholds correctly"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should stack the current subhold with another subhold, verify stacking", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "subhold", "Light");
        await cmd.fight.nextTurn();
        await doAction(cmd, "subhold", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (wasMessageSent("Hold Stacking!")) {
            done();
        }
        else {
            done.fail(new Error("The number of uses after a hold stacking hasn't been increased correctly."))
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should stack the current subhold with another subhold, verify uses", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "subhold", "Light");
            let indexOfSubHoldModifier = cmd.fight.getFighterByName("Aelith Blanchette").modifiers.findIndex(x => x.name == ModifierType.SubHold);
            if (indexOfSubHoldModifier == -1) {
                done.fail(new Error("Did not find the correct subhold modifier in the defender's list."));
            }
            let usesLeftBefore = cmd.fight.getFighterByName("Aelith Blanchette").modifiers[indexOfSubHoldModifier].uses;
            await cmd.fight.nextTurn();
            refillHPLPFP(cmd, "Aelith Blanchette");
            await doAction(cmd, "subhold", "Light");
                await cmd.fight.waitUntilWaitingForAction();
                let usesLeftAfter = 0;
                if (cmd.fight.getFighterByName("Aelith Blanchette").modifiers[indexOfSubHoldModifier]) {
                    usesLeftAfter = cmd.fight.getFighterByName("Aelith Blanchette").modifiers[indexOfSubHoldModifier].uses;
                }
                if (usesLeftAfter > usesLeftBefore) {
                    done();
                }
                else {
                    done.fail(new Error("The number of uses after a hold stacking hasn't been increased correctly."))
                }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should do a sexhold and tick", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "sexhold", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (wasLustHit(cmd, "Aelith Blanchette") && cmd.fight.getFighterByName("Aelith Blanchette").modifiers.findIndex(x => x.name == ModifierType.SexHold) != -1) {
            done();
        }
        else {
            done.fail(new Error("Didn't tick sexhold"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should be able to do a humhold with sexhold", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "sexhold", "Light");
        await cmd.fight.nextTurn();
        await doAction(cmd, "humhold", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (cmd.fight.pastActions[cmd.fight.pastActions.length - 1].name == ActionType.HumHold) {
            done();
        }
        else {
            done.fail(new Error("Didn't get to do a humiliation hold after a sexhold"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should be making the humhold tick", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "sexhold", "Light");
        await cmd.fight.nextTurn();
        refillHPLPFP(cmd, "Aelith Blanchette");
        await doAction(cmd, "humhold", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (cmd.fight.getFighterByName("Aelith Blanchette").modifiers.findIndex(x => x.name == ModifierType.HumHold) != -1) {
            done();
        }
        else {
            done.fail(new Error("Didn't give humiliation hold modifier"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should be applying degradation modifier with humhold", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "humhold", "Light");
        if (wasMessageSent(ModifierType.DegradationMalus)) {
            done();
        }
        else {
            done.fail(new Error("Didn't deal more damage with degradation malus"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should pickup an item and trigger bonus brawl modifier", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "itempickup", "Light");
        await cmd.fight.nextTurn();
        await doAction(cmd, "brawl", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (wasMessageSent(ModifierType.ItemPickupBonus)) {
            done();
        }
        else {
            done.fail(new Error("Did not say that the attacker has an item pickup bonus."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should pickup a sextoy and trigger bonus sexstrike modifier", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "sextoypickup", "Light");
        await cmd.fight.nextTurn();
        await doAction(cmd, "tease", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (cmd.fight.getFighterByName("TheTinaArmstrong").modifiers.findIndex((x) => x.name == ModifierType.SextoyPickupBonus) != -1) {
            done();
        }
        else {
            done.fail(new Error("Did not have the sextoy item pickup bonus modifier."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should win the match with bondage attacks", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");

        for(let i = 0; i < cmd.fight.getFighterByName("Aelith Blanchette").maxBondageItemsOnSelf(); i++){
            cmd.fight.setCurrentPlayer("TheTinaArmstrong");
            await doAction(cmd, "sexhold", "Light");
            refillHPLPFP(cmd, "Aelith Blanchette");
            await cmd.fight.waitUntilWaitingForAction();
            cmd.fight.setCurrentPlayer("TheTinaArmstrong");
            await doAction(cmd, "bondage", "Light");
            refillHPLPFP(cmd, "Aelith Blanchette");
        }

        if (cmd.fight.getFighterByName("Aelith Blanchette").isCompletelyBound()) {
            done();
        }
        else {
            done.fail(new Error("Did not say that the receiver must abandon because of bondage."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("shouldn't win the match without all the needed bondage attacks", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");

        for(let i = 0; i < cmd.fight.getFighterByName("Aelith Blanchette").maxBondageItemsOnSelf() - 1; i++){
            cmd.fight.setCurrentPlayer("TheTinaArmstrong");
            await doAction(cmd, "sexhold", "Light");
            refillHPLPFP(cmd, "Aelith Blanchette");
            await cmd.fight.waitUntilWaitingForAction();
            cmd.fight.setCurrentPlayer("TheTinaArmstrong");
            await doAction(cmd, "bondage", "Light");
            refillHPLPFP(cmd, "Aelith Blanchette");
        }

        if (cmd.fight.getFighterByName("Aelith Blanchette").isCompletelyBound()) {
            done.fail(new Error("Did say that the receiver must abandon because of bondage while it shouldn't have."));
        }
        else {
            done();
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should say you can't place a bondage attack without a sexhold", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "bondage", "Light", false);
        if (wasPrivMessageSent(Messages.targetMustBeInHold)) {
            done();
        }
        else {
            done.fail(new Error("Did not say " + Messages.targetMustBeInHold));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should forfeit the match and give the win", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        await doAction(cmd, "forfeit", "");
        if (wasMessageSent(Messages.forfeitItemApply.substring(32))) {
            done();
        }
        else {
            done.fail(new Error("Did not say that the attacker must apply a sexhold for a bondage attack."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should call the match a draw", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        await doAction(cmd, "draw", "");
        await cmd.fight.nextTurn();
        await doAction(cmd, "draw", "");
        if (wasMessageSent("Everybody agrees, it's a draw!")) {
            done();
        }
        else {
            done.fail(new Error("Did not say that there's a draw."));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should grant the itemPickupModifier bonus for the KickStart feature", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        createFighter("TheTinaArmstrong").features.push(new FeatureFactory().getFeature(FeatureType.KickStart, createFighter("TheTinaArmstrong"),  1));
        await initiateMatchSettings1vs1(cmd);

        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await cmd.fight.waitUntilWaitingForAction();
        if (cmd.fight.getFighterByName("TheTinaArmstrong").modifiers.length == 1
            && cmd.fight.getFighterByName("TheTinaArmstrong").modifiers[0].name == ModifierType.ItemPickupBonus) {
            done();
        }
        else {
            done.fail(new Error("Didn't create the itemPickup modifier"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should grant the itemPickupModifier bonus for the BondageBunny feature", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        createFighter("TheTinaArmstrong").features.push(new FeatureFactory().getFeature(FeatureType.BondageBunny, createFighter("TheTinaArmstrong"),  1));
        await initiateMatchSettings1vs1(cmd);

        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await cmd.fight.waitUntilWaitingForAction();
        if (cmd.fight.getFighterByName("TheTinaArmstrong").features.length == 1
            && cmd.fight.getFighterByName("TheTinaArmstrong").features[0].type == FeatureType.BondageBunny) {
            done();
        }
        else {
            done.fail(new Error("Didn't create the BondageBunny feature"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should do a stun and grant the stun modifier", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "stun", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (cmd.fight.getFighterByName("Aelith Blanchette").modifiers.length > 0 &&
            cmd.fight.getFighterByName("Aelith Blanchette").modifiers[0].name == ModifierType.Stun) {
            done();
        }
        else {
            done.fail(new Error("Didn't do the stun"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should do a stun and grant the stun modifier, and reduce the dice roll", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "stun", "Light");
        await doAction(cmd, "brawl", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (wasMessageSent("penalty for their dice roll")) {
            done();
        }
        else {
            done.fail(new Error("Didn't do the stun"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should do a forcedworship attack", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.setCurrentPlayer("TheTinaArmstrong");
        await doAction(cmd, "forcedworship", "Light");
        await cmd.fight.waitUntilWaitingForAction();
        if (wasMessageSent(Messages.HitMessage)) {
            done();
        }
        else {
            done.fail(new Error("Didn't do a forcedworship attack"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should heal 0 hp because it's already full", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        let initialHp = cmd.fight.getFighterByName("Aelith Blanchette").hp;
        cmd.fight.getFighterByName("Aelith Blanchette").healHP(10);
        cmd.fight.sendFightMessage();
        await cmd.fight.waitUntilWaitingForAction();
        let healedHp = (cmd.fight.getFighterByName("Aelith Blanchette").hpPerHeart() - initialHp);
        if (healedHp == 0) {
            done();
        }
        else {
            done.fail(new Error("Either heal was not triggered or was different than 0HP"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should heal whatever hp amount is left", async function (done) { // 0
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        let initialHp = 10;
        cmd.fight.getFighterByName("Aelith Blanchette").hp = initialHp;
        cmd.fight.getFighterByName("Aelith Blanchette").healHP(50);
        cmd.fight.sendFightMessage();
        await cmd.fight.waitUntilWaitingForAction();
        let healedFp = (cmd.fight.getFighterByName("Aelith Blanchette").hpPerHeart() - initialHp);
        let lifeAfter = cmd.fight.getFighterByName("Aelith Blanchette").hp;
        if (lifeAfter == (initialHp + healedFp)) {
            done();
        }
        else {
            done.fail(new Error("Either heal was not triggered or was different than the required HP"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should heal 1 HP", async function (done) { // 0
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        let initialHp = 1;
        cmd.fight.getFighterByName("Aelith Blanchette").hp = initialHp;
        cmd.fight.getFighterByName("Aelith Blanchette").healHP(1);
        cmd.fight.sendFightMessage();
        await cmd.fight.waitUntilWaitingForAction();
        let healedHp = (cmd.fight.getFighterByName("Aelith Blanchette").hp - initialHp);
        if (healedHp == 1) {
            done();
        }
        else {
            done.fail(new Error("Either heal was not triggered or was different than 1HP"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should heal 0 lp because it's already full", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.getFighterByName("Aelith Blanchette").healLP(10);
        cmd.fight.sendFightMessage();
        await cmd.fight.waitUntilWaitingForAction();
        if (cmd.fight.getFighterByName("Aelith Blanchette").lust == 0) {
            done();
        }
        else {
            done.fail(new Error("Either heal was not triggered or was different than 0HP"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should heal whatever lp amount is left", async function (done) { // 0
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        let initialLp = 2;
        cmd.fight.getFighterByName("Aelith Blanchette").lust = initialLp;
        cmd.fight.getFighterByName("Aelith Blanchette").healLP(50);
        cmd.fight.sendFightMessage();
        await cmd.fight.waitUntilWaitingForAction();
        let healedLp = (initialLp - cmd.fight.getFighterByName("Aelith Blanchette").lust);
        let lifeAfter = cmd.fight.getFighterByName("Aelith Blanchette").lust;
        if (lifeAfter == (initialLp - healedLp)) {
            done();
        }
        else {
            done.fail(new Error("Either heal was not triggered or was different than the required LP"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should heal 1 LP", async function (done) { // 0
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        let initialLp = 1;
        cmd.fight.getFighterByName("Aelith Blanchette").lust = 1;
        cmd.fight.getFighterByName("Aelith Blanchette").healLP(1);
        cmd.fight.sendFightMessage();
        await cmd.fight.waitUntilWaitingForAction();
        let healedLp = (initialLp - cmd.fight.getFighterByName("Aelith Blanchette").lust);
        if (healedLp == 1) {
            done();
        }
        else {
            done.fail(new Error("Either lustheal was not triggered or was different than 1LP"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should heal 0 fp because it's already full", async function (done) {
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        refillHPLPFP(cmd, "Aelith Blanchette");
        let initialFp = cmd.fight.getFighterByName("Aelith Blanchette").focus;
        cmd.fight.getFighterByName("Aelith Blanchette").healFP(10);
        cmd.fight.sendFightMessage();
        await cmd.fight.waitUntilWaitingForAction();
        let healedFp = (cmd.fight.getFighterByName("Aelith Blanchette").maxFocus() - initialFp);
        if (healedFp == 0) {
            done();
        }
        else {
            done.fail(new Error("Either heal was not triggered or was different than 0FP"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should heal whatever fp amount is left", async function (done) { // 0
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        cmd.fight.getFighterByName("Aelith Blanchette").focus = 1;
        cmd.fight.getFighterByName("Aelith Blanchette").healFP(Number.MAX_VALUE);
        cmd.fight.sendFightMessage();
        await cmd.fight.waitUntilWaitingForAction();
        if (cmd.fight.getFighterByName("Aelith Blanchette").focus == cmd.fight.getFighterByName("Aelith Blanchette").maxFocus()) {
            done();
        }
        else {
            done.fail(new Error("Either heal was not triggered or was different than the required FP"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

    it("should heal 1 FP", async function (done) { // 0
        let cmd = new RendezVousWrestling(fChatLibInstance, "here");
        await initiateMatchSettings1vs1(cmd);
        await cmd.fight.waitUntilWaitingForAction();
        let initialFp = 1;
        cmd.fight.getFighterByName("Aelith Blanchette").focus = initialFp;
        cmd.fight.getFighterByName("Aelith Blanchette").healFP(1);
        cmd.fight.sendFightMessage();
        await cmd.fight.waitUntilWaitingForAction();
        let healedHp = (cmd.fight.getFighterByName("Aelith Blanchette").focus - initialFp);
        if (healedHp == 1) {
            done();
        }
        else {
            done.fail(new Error("Either heal was not triggered or was different than 1FP"));
        }
    }, DEFAULT_TIMEOUT_UNIT_TEST);

});

jasmine.execute();