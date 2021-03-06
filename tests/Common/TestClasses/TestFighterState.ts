import {BaseFighterState} from "../../../src/Common/Fight/BaseFighterState";
import {TransactionType} from "../../../src/Common/Constants/TransactionType";

export class TestFighterState extends BaseFighterState {
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
    save(): Promise<this> {
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