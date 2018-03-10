import {IActionFactory} from "../../../src/Common/Actions/IActionFactory";
import {TestFight} from "./TestFight";
import {TestActiveFighter} from "./TestActiveFighter";
import {TestActiveAction} from "./TestActiveAction";

export class TestActionFactory implements IActionFactory<TestFight, TestActiveFighter> {
    getAction(actionName: string, fight: TestFight, attacker: TestActiveFighter, defenders: TestActiveFighter[], tier: number): TestActiveAction {
        return;
    }
}