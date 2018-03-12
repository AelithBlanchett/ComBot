import {IFeatureFactory} from "../../../src/Common/Features/IFeatureFactory";
import {TestFight} from "./TestFight";
import {TestFighter} from "./TestFighter";
import {BaseFeature} from "../../../src/Common/Features/BaseFeature";

export class TestFeatureFactory implements IFeatureFactory<TestFight, TestFighter> {
    getFeature(featureName: string, receiver: TestFighter, uses: number, id?: string): BaseFeature {
        return;
    }

    getExistingFeatures(): string[] {
        return [];
    }
}