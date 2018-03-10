import {BaseFight} from "../../../src/Common/Fight/BaseFight";
import {TestActiveFighter} from "./TestActiveFighter";

export class TestFight extends BaseFight {
    save(): Promise<void> {
        return;
    }
    deleteFighterFromFight(idFighter: string, idFight: string) {
        return;
    }

    punishPlayerOnForfeit(fighter: TestActiveFighter) {
        return;
    }

    loadFighter(idFighter: string): Promise<TestActiveFighter> {
        return;
    }
}