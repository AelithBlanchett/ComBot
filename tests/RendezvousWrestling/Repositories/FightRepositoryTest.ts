import "reflect-metadata";
import {RWFight} from "../../../src/FightSystem/Fight/RWFight";
let Jasmine = require('jasmine');
let testSuite = new Jasmine();
import {Connection, createConnection, getConnectionManager} from "typeorm";

describe("The RWFight Repository", () => {

    let fight:RWFight;
    let connection:Connection;

    beforeAll(async (done) => {
        fight = new RWFight();
        connection = await createConnection();
        console.log("ok");
        done();
    });

    it("should save the fight and confirm the creation date is okay", async function (done) {
        await connection.manager.save(fight);
        console.log("myFight has been saved");
        expect(fight.createdAt).not.toBeNull();
        done();
    });

    it("should check that the fight was inserted", async function (done) {
        let myFight = new RWFight();
        let loadedFight:RWFight = await connection.manager.findOne(RWFight, fight.idFight);
        expect(loadedFight).not.toBeNull();
        expect(loadedFight.idFight).toBe(fight.idFight);
        done();
    });

    it("should delete the fight that was inserted", async function (done) {
        //await connection.manager.delete(RWFight, fight);
        let loadedFight:RWFight = await connection.manager.findOne(RWFight, fight.idFight);
        expect(loadedFight).toBeUndefined();
        done();
    });

});

testSuite.execute();