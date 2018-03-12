import {BaseActiveAction} from "../../../src/Common/Actions/BaseActiveAction";
import {Trigger} from "../../../src/Common/BaseConstants";

export class TestActiveAction extends BaseActiveAction {
    save(): Promise<void> {
        return;
    }

    onMiss(): void {
    }

    onHit(): void {
    }

    applyDamage(): void{
    }

    specificRequiredDiceScore(): number {
        return 0;
    }

    constructor(fight:any, attacker:any, defenders:any){
        super(fight, attacker, defenders, "actionName", -1, false, false, false, true, true, false, true, false, true, false, true, false, true, false, false, true, false, true, false, false, true, Trigger.None, "no explanation", 1);
    }
}