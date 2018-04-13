import {BaseUser} from "../../../src/Common/Fight/BaseUser";
import {TransactionType} from "../../../src/Common/Constants/TransactionType";

export class TestUser extends BaseUser{
    outputStats(): string {
        return "";
    }

    restat(statArray: Array<number>) {
    }

    saveTokenTransaction(idFighter: string, amount: number, transactionType: TransactionType, fromFighter?: string): Promise<void> {
        return undefined;
    }

}