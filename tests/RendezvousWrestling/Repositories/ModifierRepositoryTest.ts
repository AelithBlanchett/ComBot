import {Database} from "../../../src/Common/Utils/Model";
import {ModifierRepository} from "../../../src/FightSystem/Repositories/ModifierRepository";
let Jasmine = require('jasmine');
let testSuite = new Jasmine();
import * as Constants from "../../../src/Common/Constants/BaseConstants";
import {ModifierFactory} from "../../../src/FightSystem/Modifiers/ModifierFactory";
import {ModifierType} from "../../../src/FightSystem/RWConstants";

describe("The Fight Repository", () => {

    it("should do nothing. lol.", async function (done) {
        done();
    });

    it("should try everything around modifier", async function (done) {

        let myModifier = ModifierFactory.getModifier(ModifierType.DummyModifier, null, null, null);
        myModifier.applier.name = "1";
        myModifier.fight.idFight = "1";

        await ModifierRepository.persist(myModifier);
        let resultTrue = await ModifierRepository.exists(myModifier.idModifier);
        expect(resultTrue).toBe(true);

        await ModifierRepository.delete(myModifier.idModifier);
        let resultFalse = await ModifierRepository.exists(myModifier.idModifier);
        expect(resultFalse).toBe(false);

        await Database.get(Constants.SQL.modifiersTableName).where({idModifier: myModifier.idModifier}).del();

        done();
    });

    it("should load a modifier modifier", async function (done) {

        let myModifier = ModifierFactory.getModifier(ModifierType.DummyModifier, null, null, null);
        myModifier.receiver.name = "1";
        myModifier.name = ModifierType.Bondage;
        myModifier.idParentActions = ['1'];
        myModifier.fight.idFight = "1";

        await ModifierRepository.persist(myModifier);
        let resultTrue = await ModifierRepository.exists(myModifier.idModifier);
        expect(resultTrue).toBe(true);

        let modifiers = await ModifierRepository.loadFromFight("1", "1");
        expect(modifiers[0].idModifier).toBe(myModifier.idModifier);

        await Database.get(Constants.SQL.modifiersTableName).where({idModifier: myModifier.idModifier}).del();

        done();
    });

});

testSuite.execute();