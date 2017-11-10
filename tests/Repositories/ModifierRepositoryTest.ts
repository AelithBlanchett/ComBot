import {Model} from "../../src/Common/Model";
import {EmptyModifier} from "../../src/FightSystem/Modifiers/CustomModifiers";
import {ModifierRepository} from "../../src/FightSystem/Repositories/ModifierRepository";
import {ModifierType} from "../../src/FightSystem/Constants";
let Jasmine = require('jasmine');
let testSuite = new Jasmine();
import * as Constants from "../../src/FightSystem/Constants";

describe("The Fight Repository", () => {

    it("should do nothing. lol.", async function (done) {
        done();
    });

    it("should try everything around modifier", async function (done) {

        let myModifier = new EmptyModifier();
        myModifier.idReceiver = "1";
        myModifier.idFight = "1";

        await ModifierRepository.persist(myModifier);
        let resultTrue = await ModifierRepository.exists(myModifier.idModifier);
        expect(resultTrue).toBe(true);

        await ModifierRepository.delete(myModifier.idModifier);
        let resultFalse = await ModifierRepository.exists(myModifier.idModifier);
        expect(resultFalse).toBe(false);

        await Model.db(Constants.SQL.modifiersTableName).where({idModifier: myModifier.idModifier}).del();

        done();
    });

    it("should load a modifier modifier", async function (done) {

        let myModifier = new EmptyModifier();
        myModifier.idReceiver = "1";
        myModifier.type = ModifierType.Bondage;
        myModifier.idParentActions = ['1'];
        myModifier.idFight = "1";

        await ModifierRepository.persist(myModifier);
        let resultTrue = await ModifierRepository.exists(myModifier.idModifier);
        expect(resultTrue).toBe(true);

        let modifiers = await ModifierRepository.loadFromFight("1", "1");
        expect(modifiers[0].idModifier).toBe(myModifier.idModifier);

        await Model.db(Constants.SQL.modifiersTableName).where({idModifier: myModifier.idModifier}).del();

        done();
    });

});

testSuite.execute();