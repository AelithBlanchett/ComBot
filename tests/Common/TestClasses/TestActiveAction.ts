import {BaseActiveAction} from "../../../src/Common/Actions/BaseActiveAction";

export class TestActiveAction extends BaseActiveAction {
    save(): Promise<void> {
        return;
    }

    onMiss(): void {
    }
    onHit(): void {
    }
    specificRequiredDiceScore(): number {
        return 0;
    }

    constructor(fight:any, attacker:any, defenders:any){
        super(fight, attacker, defenders, "actionName", -1, false, false, false, true, true, false, true, false, true, false, true, false, true, false, false, true, false, true, false, false, true, "no explanation", 1);
    }
}