import {BaseActiveFighter} from "../../../src/Common/Fight/BaseActiveFighter";
import {TransactionType} from "../../../src/Common/BaseConstants";

export class TestActiveFighter extends BaseActiveFighter {
    validateStats(): string {
        return "";
    }
    isTechnicallyOut(displayMessage?: boolean): boolean {
        return false;
    }
    outputStatus(): string {
        return "status:";
    }
    restat(statArray: number[]) {
        return;
    }
    outputStats(): string {
        return "stats: 1,2,3,4,5,6";
    }
    save(): Promise<void> {
        return;
    }
    saveTokenTransaction(idFighter: string, amount: number, transactionType: TransactionType, fromFighter?: string): Promise<void> {
        return;
    }
}