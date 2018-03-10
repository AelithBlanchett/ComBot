import {Utils} from "../../../src/Common/Utils/Utils";
import {ActiveFighter} from "../../../src/FightSystem/Fight/ActiveFighter";
import {ActiveFighterRepository} from "../../../src/FightSystem/Repositories/ActiveFighterRepository";
import {Database} from "../../../src/Common/Utils/Model";
import {FightStatus} from "../../../src/Common/Fight/BaseFight";
import {Teams} from "../../../src/Common/Constants/Teams";
import {FeatureFactory} from "../../../src/FightSystem/Features/FeatureFactory";
let Jasmine = require('jasmine');
let testSuite = new Jasmine();

describe("The Active Fighter Repository", () => {

    beforeEach(async () =>{
        await Database.get('nsfw_activefighters').del();
    });

    it("should do nothing. lol.", async function (done) {
        done();
    });

    it("should remove Active Fighter Aelith", async function (done) {

        let myFighter = new ActiveFighter(new FeatureFactory());
        myFighter.initialize();
        myFighter.name = "Aelith Blanchette";
        myFighter.idFight = "1";
        myFighter.season = 0;
        myFighter.assignedTeam = Teams.Blue;
        myFighter.isReady = true;
        myFighter.fightStatus = FightStatus.Playing;


        await ActiveFighterRepository.persist(myFighter);
        let resultTrue = await ActiveFighterRepository.exists(myFighter.name, myFighter.idFight);
        expect(resultTrue).toBe(true);

        await ActiveFighterRepository.delete(myFighter.name, myFighter.idFight);
        let resultFalse = await ActiveFighterRepository.exists(myFighter.name, myFighter.idFight);
        expect(resultFalse).toBe(false);
        done();
    });

    it("should say that Active Fighter that was just inserted is in database.", async function (done) {
        let myFighter = new ActiveFighter(new FeatureFactory());
        myFighter.initialize();
        myFighter.name = "Aelith Blanchette";
        myFighter.idFight = "1";
        myFighter.season = 0;
        myFighter.assignedTeam = Teams.Blue;
        myFighter.isReady = true;

        await ActiveFighterRepository.persist(myFighter);
        let resultTrue = await ActiveFighterRepository.exists(myFighter.name, myFighter.idFight);
        expect(resultTrue).toBe(true);
        done();
    });

    it("should save an Active Fighter in the database.", async function (done) {
        let myFighter = new ActiveFighter(new FeatureFactory());
        myFighter.initialize();
        myFighter.name = "Aelith Blanchette";
        myFighter.idFight = "1";
        myFighter.season = 0;
        myFighter.assignedTeam = Teams.Blue;
        myFighter.isReady = true;

        await ActiveFighterRepository.persist(myFighter);

        expect(myFighter.createdAt).toBeDefined();
        done();
    });

    it("should load all Active Fighter from fight #1", async function (done) {
        let myFighter = new ActiveFighter(new FeatureFactory());
        myFighter.initialize();
        myFighter.name = "Aelith Blanchette";
        myFighter.idFight = "1";
        myFighter.season = 0;
        myFighter.assignedTeam = Teams.Blue;
        myFighter.isReady = true;

        await ActiveFighterRepository.persist(myFighter);

        let actors = await ActiveFighterRepository.loadFromFight("1");
        expect(actors.length).toBeGreaterThan(0);
        done();
    });

});

testSuite.execute();