import {BaseFighterState} from "../../../src/Common/Fight/BaseFighterState";

export class TestFighter extends BaseFighterState {
    isTechnicallyOut(displayMessage?: boolean): boolean {
        return false;
    }

    outputStatus(): string {
        return "";
    }

    validateStats(): string {
        return "";
    }

}