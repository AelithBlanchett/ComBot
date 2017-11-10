import {Model} from "../../src/Common/Model";
import {NSFWFighter} from "../../src/FightSystem/Fighter";
import {FighterRepository} from "../../src/FightSystem/Repositories/FighterRepository";
let Jasmine = require('jasmine');
let testSuite = new Jasmine();
import * as Constants from "../../src/FightSystem/Constants";

describe("The NSFWFighter Repository", () => {

    beforeEach(async () =>{
        //await Model.db('nsfw_fighters').del();
    });

    it("should do nothing. lol.", async function (done) {
        done();
    });

    it("should do all tests around NSFWFighter Aelith Blanchetts", async function (done) {

        let myFighter = new NSFWFighter();
        myFighter.name = "Aelith Blanchetts";

        await Model.db(Constants.SQL.fightersTableName).where({name: myFighter.name, season: 1}).del();

        await FighterRepository.persist(myFighter);
        let resultTrue = await FighterRepository.exists(myFighter.name);
        expect(resultTrue).toBe(true);

        await FighterRepository.delete(myFighter.name);
        let resultFalse = await FighterRepository.exists(myFighter.name);
        expect(resultFalse).toBe(false);

        await Model.db(Constants.SQL.fightersTableName).where({name: myFighter.name, season: 1}).del();

        done();
    });

    // it("should say that action that was just inserted is in database.", async function (done) {
    //     let myFighter = new NSFWFighter();
    //     myFighter.name = "Aelith Blanchette";
    //
    //     await ActiveFighterRepository.persist(myFighter);
    //     let resultTrue = await ActiveFighterRepository.exists(myFighter.name, myFighter.idFight);
    //     expect(resultTrue).toBe(true);
    //     done();
    // });
    //
    // it("should save an action in the database.", async function (done) {
    //     let myFighter = new ActiveFighter();
    //     myFighter.initialize();
    //     myFighter.name = "Aelith Blanchette";
    //     myFighter.idFight = "1";
    //     myFighter.season = 0;
    //     myFighter.assignedTeam = Team.Blue;
    //     myFighter.isReady = true;
    //
    //     await ActiveFighterRepository.persist(myFighter);
    //
    //     expect(myFighter.createdAt).toBeDefined();
    //     done();
    // });
    //
    // it("should load all actions from fight #1", async function (done) {
    //     let myFighter = new ActiveFighter();
    //     myFighter.initialize();
    //     myFighter.name = "Aelith Blanchette";
    //     myFighter.idFight = "1";
    //     myFighter.season = 0;
    //     myFighter.assignedTeam = Team.Blue;
    //     myFighter.isReady = true;
    //
    //     await ActiveFighterRepository.persist(myFighter);
    //
    //     let actors = await ActiveFighterRepository.loadFromFight("1");
    //     expect(actors.length).toBeGreaterThan(0);
    //     done();
    // });

});

testSuite.execute();