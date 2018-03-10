import {ActionRepository} from "../../../src/FightSystem/Repositories/ActionRepository";
import {Utils} from "../../../src/Common/Utils/Utils";
import {ActionType, EmptyAction, RWAction} from "../../../src/FightSystem/Actions/RWAction";
import {BaseFight} from "../../../src/Common/Fight/BaseFight";
import {BaseActiveFighter} from "../../../src/Common/Fight/BaseActiveFighter";
import {ActiveFighter} from "../../../src/FightSystem/Fight/ActiveFighter";
import {RWFight} from "../../../src/FightSystem/Fight/RWFight";
import {Database} from "../../../src/Common/Utils/Model";
let Jasmine = require('jasmine');
let testSuite = new Jasmine();

let mockedClasses = [];
function getMock(mockedClass) {
    if (mockedClasses.indexOf(mockedClass) != -1) {
        return new mockedClasses[mockedClasses.indexOf(mockedClass)]();
    }
    Object.getOwnPropertyNames(mockedClass.prototype).forEach(m => spyOn(mockedClass.prototype, m).and.callThrough());
    mockedClasses.push(mockedClass);

    return new mockedClass();
}

describe("The Action Repository", () => {

    beforeEach(function () {
        Database._configuration = {
            host: "localhost",
            user: "root",
            password: "test",
            database: "flistplugins"
        };
    }, 1000);

    fit("should connect to the database and check if the table is here", async function (done) {
        await Database.get("nsfw_actions").select();
        done();
    });

    it("should remove action aa", async function (done) {
        let fight = {currentTurn: 1, idFight: "1"};
        let attacker = {name: "Attacker"};
        let defender = {name: "Defender #1"};
        let myAction:any = new EmptyAction(fight, attacker, defender);
        myAction.idAction = Utils.generateUUID();
        myAction.tier = 0;
        myAction.missed = false;
        myAction.isHold = false;
        myAction.name =  ActionType.Bondage;
        await ActionRepository.persist(myAction);
        let resultTrue = await ActionRepository.exists(myAction.idAction);
        expect(resultTrue).toBe(true);

        await ActionRepository.delete(myAction.idAction);
        let resultFalse = await ActionRepository.exists(myAction.idAction);
        expect(resultFalse).toBe(false);
        done();
    });

    // it("should say that action that was just inserted is in database.", async function (done) {
    //     let myAction = new EmptyAction();
    //     myAction.idAction = Utils.generateUUID();
    //     myAction.fight = getMock(BaseFight);
    //     myAction.fight.idFight = "1";
    //     myAction.attacker = getMock(BaseActiveFighter);
    //     myAction.attacker.name = "Attacker";
    //     myAction.defenders = [getMock(BaseActiveFighter)];
    //     myAction.defenders[0].name = "Defender #1";
    //     myAction.atTurn = 1;
    //     myAction.tier = 0;
    //     myAction.missed = false;
    //     myAction.isHold = false;
    //     myAction.name =  ActionType.Bondage;
    //     await ActionRepository.persist(myAction);
    //     let resultTrue = await ActionRepository.exists(myAction.idAction);
    //     expect(resultTrue).toBe(true);
    //     done();
    // });
    //
    // it("should save an action in the database.", async function (done) {
    //     let myAction = new EmptyAction();
    //     myAction.idAction = Utils.generateUUID();
    //     myAction.fight = getMock(BaseFight);
    //     myAction.fight.idFight = "1";
    //     myAction.attacker = getMock(BaseActiveFighter);
    //     myAction.attacker.name = "Attacker";
    //     myAction.defenders = [getMock(BaseActiveFighter)];
    //     myAction.defenders[0].name = "Defender #1";
    //     myAction.atTurn = 1;
    //     myAction.tier = 0;
    //     myAction.missed = false;
    //     myAction.isHold = false;
    //     myAction.name =  ActionType.Bondage;
    //     await ActionRepository.persist(myAction);
    //
    //     expect(myAction.createdAt).toBeDefined();
    //     done();
    // });
    //
    // it("should load all actions from fight #1", async function (done) {
    //     let actions = await ActionRepository.loadFromFight("1");
    //     expect(actions.length).toBeGreaterThan(0);
    //     done();
    // });

});

testSuite.execute();