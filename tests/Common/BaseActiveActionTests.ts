import {BaseActiveAction} from "../../src/Common/Actions/BaseActiveAction";
import {TestFight} from "./TestClasses/TestFight";
import {TestFighterState} from "./TestClasses/TestFighterState";
import {TestFeatureFactory} from "./TestClasses/TestFeatureFactory";
import {TestActiveAction} from "./TestClasses/TestActiveAction";
import {TestActionFactory} from "./TestClasses/TestActionFactory";
import {Messages} from "../../src/Common/Constants/Messages";
import {RWFight} from "../../src/FightSystem/Fight/RWFight";
import {RWUser} from "../../src/FightSystem/Fight/RWUser";
import {TestUser} from "./TestClasses/TestUser";

let Jasmine = require('jasmine');
let jasmine = new Jasmine();

let featureFactory = new TestFeatureFactory();
let actionFactory = new TestActionFactory();

function createFighterState(name:string):TestFighterState{
    return new TestFighterState(new TestFight(actionFactory), new TestUser(name, featureFactory));
}

describe("The BaseActiveAction", () => {
    beforeEach(function () {

    });

    it("'s defender getter should return the first defender", function () {
        let defender = createFighterState("Defender #1");
        let action = new TestActiveAction(new TestFight(actionFactory), createFighterState("Attacker #1"), [defender]);
        expect(action.defender).not.toBe(null);
        expect(action.defender.name).toBe(defender.name);
    });

    it("'s defender getter should throw an exception when there are two defenders", function () {
        let defenderOne = createFighterState("Defender #1");
        let defenderTwo = createFighterState("Defender #2")
        let action = new TestActiveAction(new TestFight(actionFactory), createFighterState("Attacker #1"), [defenderOne, defenderTwo]);
        let exception = null;
        try{
            let defender = action.defender;
        }
        catch(ex){
            exception = ex;
        }
        expect(exception).not.toBe(null);
        expect(exception.message).toBe(Messages.errorTooManyDefendersForThisCall);
    });

    it("should miss if the required score is too high, and call onMiss", function () {
        let defenderOne = createFighterState("Defender #1")
        let action = new TestActiveAction(new TestFight(actionFactory), createFighterState("Attacker #1"), [defenderOne]);
        action.requiresRoll = true;
        spyOn(action, 'checkRequirements').and.callFake(() => {return true;});
        spyOn(action, 'specificRequiredDiceScore').and.callFake(() => {return Number.MAX_SAFE_INTEGER;});
        spyOn(action, 'onMiss').and.callFake(() => { });
        action.execute();
        expect(action.missed).toBe(true);
        let onMissAction:any = action.onMiss; //to avoid compilation errors
        expect(onMissAction.calls.count()).toBe(1);
    });

    it("should hit if the required score is low enough", function () {
        let defenderOne = createFighterState("Defender #1")
        let action = new TestActiveAction(new TestFight(actionFactory), createFighterState("Attacker #1"), [defenderOne]);
        action.requiresRoll = true;
        spyOn(action, 'checkRequirements').and.callFake(() => {return true;});
        spyOn(action, 'specificRequiredDiceScore').and.callFake(() => {return Number.MIN_SAFE_INTEGER;});
        spyOn(action, 'onHit').and.callFake(() => { });
        action.execute();
        expect(action.missed).toBe(false);
        let onHitAction:any = action.onHit;
        expect(onHitAction.calls.count()).toBe(1);
    });

    it("should say there are too many targets", function () {
        let defender = createFighterState("Defender #1");
        let action = new TestActiveAction(new TestFight(actionFactory), createFighterState("Attacker #1"), [defender, defender]);
        action.singleTarget = true;
        action.usableOnSelf = false;
        let exception = null;
        try{
            action.checkRequirements();
        }
        catch(ex){
            exception = ex;
        }
        expect(exception).not.toBe(null);
        expect(exception.message).toContain(Messages.tooManyTargets);
    });

    it("should say the attacker can't be dead", function () {
        let attacker = createFighterState("Attacker #1")
        spyOn(attacker, 'isTechnicallyOut').and.callFake(() => { return true;});
        let action = new TestActiveAction(new TestFight(actionFactory), attacker, [createFighterState("Defender #1")]);
        action.singleTarget = true;
        action.usableOnSelf = false;
        action.requiresBeingAlive = true;
        let exception = null;
        try{
            action.checkRequirements();
        }
        catch(ex){
            exception = ex;
        }
        expect(exception).not.toBe(null);
        expect(exception.message).toContain(Messages.playerOutOfFight);
    });

    it("should say the attacker can't be alive", function () {
        let attacker = createFighterState("Attacker #1")
        spyOn(attacker, 'isTechnicallyOut').and.callFake(() => { return false;});
        let action = new TestActiveAction(new TestFight(actionFactory), attacker, [createFighterState("Defender #1")]);
        action.singleTarget = true;
        action.usableOnSelf = false;
        action.requiresBeingAlive = false;
        action.requiresBeingDead = true;
        let exception = null;
        try{
            action.checkRequirements();
        }
        catch(ex){
            exception = ex;
        }
        expect(exception).not.toBe(null);
        expect(exception.message).toContain(Messages.playerStillInFight);
    });

    //More tests soon!
});

jasmine.execute();