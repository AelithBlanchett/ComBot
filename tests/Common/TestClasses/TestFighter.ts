import {BaseFighter} from "../../../src/Common/Fight/BaseFighter";
import {TransactionType} from "../../../src/Common/BaseConstants";

export class TestFighter extends BaseFighter {
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