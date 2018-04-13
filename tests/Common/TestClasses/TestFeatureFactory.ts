import {IFeatureFactory} from "../../../src/Common/Features/IFeatureFactory";
import {BaseFeature} from "../../../src/Common/Features/BaseFeature";
import {TestUser} from "./TestUser";

export class TestFeatureFactory implements IFeatureFactory {
    getFeature(featureName: string, receiver: TestUser, uses: number, id?: string): BaseFeature {
        return;
    }

    getExistingFeatures(): string[] {
        return [];
    }
}