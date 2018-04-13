import {IActionFactory} from "../../../src/Common/Actions/IActionFactory";
import {TestFight} from "./TestFight";
import {TestFighterState} from "./TestFighterState";
import {TestActiveAction} from "./TestActiveAction";

export class TestActionFactory implements IActionFactory<TestFight, TestFighterState> {
    getAction(actionName: string, fight: TestFight, attacker: TestFighterState, defenders: TestFighterState[], tier: number): TestActiveAction {
        return;
    }
}