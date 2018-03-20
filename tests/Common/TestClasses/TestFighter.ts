import {BaseFighter} from "../../../src/Common/Fight/BaseFighter";
import {TransactionType} from "../../../src/Common/Constants/TransactionType";

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

    exists(name: string): Promise<boolean> {
        return undefined;
    }

    load(name: string): Promise<void> {
        return undefined;
    }
}