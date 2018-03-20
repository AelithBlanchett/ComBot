import {GameSettings} from "../../src/Common/Configuration/GameSettings";

let exampleSettingsFile = {
    "pluginName": "testing",
    "botName": "testing_bot",
    "currencyName": "kopek",
    "currentSeason": 1,
    "diceSides": 10,
    "diceCount": 1,
    "modifiersEnabled": true,
    "featuresEnabled": true,
    "featuresMinMatchesDurationCount": 1,
    "featuresMaxMatchesDurationCount": 10,
    "tippingEnabled": true,
    "tippingMinimum": 0,
    "numberOfDifferentStats": 6,
    "numberOfRequiredStatPoints": 230,
    "minStatLimit": 10,
    "maxStatLimit": 100,
    "restatCostInTokens": 5,
    "tierRequiredToBreakHold": -1
};
let Jasmine = require('jasmine');
let jasmine = new Jasmine();

describe("The GameSettings", () => {
    beforeEach(function () {

    });

    it("should load the default values", function () {
        expect(GameSettings.pluginName).not.toBeNull();
        expect(GameSettings.currencyName).not.toBeNull();
        expect(GameSettings.currentSeason).not.toBeNull();
        expect(GameSettings.numberOfAvailableTeams).not.toBeNull();
        expect(GameSettings.diceSides).not.toBeNull();
        expect(GameSettings.diceCount).not.toBeNull();
        expect(GameSettings.featuresEnabled).not.toBeNull();
        expect(GameSettings.featuresMinMatchesDurationCount).not.toBeNull();
        expect(GameSettings.featuresMinMatchesDurationCount).not.toBeNull();
        expect(GameSettings.modifiersEnabled).not.toBeNull();
        expect(GameSettings.tippingEnabled).not.toBeNull();
        expect(GameSettings.tippingMinimum).not.toBeNull();
        expect(GameSettings.numberOfDifferentStats).not.toBeNull();
        expect(GameSettings.numberOfRequiredStatPoints).not.toBeNull();
        expect(GameSettings.minStatLimit).not.toBeNull();
        expect(GameSettings.maxStatLimit).not.toBeNull();
        expect(GameSettings.restatCostInTokens).not.toBeNull();
        expect(GameSettings.tierRequiredToBreakHold).not.toBeNull();
    });

    it("should load the values without nulling them", function () {
        GameSettings.loadConfigFile(exampleSettingsFile);
        expect(GameSettings.pluginName).not.toBeNull();
        expect(GameSettings.currencyName).not.toBeNull();
        expect(GameSettings.currentSeason).not.toBeNull();
        expect(GameSettings.numberOfAvailableTeams).not.toBeNull();
        expect(GameSettings.diceSides).not.toBeNull();
        expect(GameSettings.diceCount).not.toBeNull();
        expect(GameSettings.featuresEnabled).not.toBeNull();
        expect(GameSettings.featuresMinMatchesDurationCount).not.toBeNull();
        expect(GameSettings.featuresMinMatchesDurationCount).not.toBeNull();
        expect(GameSettings.modifiersEnabled).not.toBeNull();
        expect(GameSettings.tippingEnabled).not.toBeNull();
        expect(GameSettings.tippingMinimum).not.toBeNull();
        expect(GameSettings.numberOfDifferentStats).not.toBeNull();
        expect(GameSettings.numberOfRequiredStatPoints).not.toBeNull();
        expect(GameSettings.minStatLimit).not.toBeNull();
        expect(GameSettings.maxStatLimit).not.toBeNull();
        expect(GameSettings.restatCostInTokens).not.toBeNull();
        expect(GameSettings.tierRequiredToBreakHold).not.toBeNull();
    });

    it("should load the correct values", function () {
        GameSettings.loadConfigFile(exampleSettingsFile);
        expect(GameSettings.pluginName).toBe(exampleSettingsFile.pluginName);
        expect(GameSettings.currencyName).toBe(exampleSettingsFile.currencyName);
        expect(GameSettings.currentSeason).toBe(exampleSettingsFile.currentSeason);
        expect(GameSettings.diceSides).toBe(exampleSettingsFile.diceSides);
        expect(GameSettings.diceCount).toBe(exampleSettingsFile.diceCount);
        expect(GameSettings.featuresEnabled).toBe(exampleSettingsFile.featuresEnabled);
        expect(GameSettings.featuresMinMatchesDurationCount).toBe(exampleSettingsFile.featuresMinMatchesDurationCount);
        expect(GameSettings.featuresMaxMatchesDurationCount).toBe(exampleSettingsFile.featuresMaxMatchesDurationCount);
        expect(GameSettings.modifiersEnabled).toBe(exampleSettingsFile.modifiersEnabled);
        expect(GameSettings.tippingEnabled).toBe(exampleSettingsFile.tippingEnabled);
        expect(GameSettings.tippingMinimum).toBe(exampleSettingsFile.tippingMinimum);
        expect(GameSettings.numberOfDifferentStats).toBe(exampleSettingsFile.numberOfDifferentStats);
        expect(GameSettings.numberOfRequiredStatPoints).toBe(exampleSettingsFile.numberOfRequiredStatPoints);
        expect(GameSettings.minStatLimit).toBe(exampleSettingsFile.minStatLimit);
        expect(GameSettings.maxStatLimit).toBe(exampleSettingsFile.maxStatLimit);
        expect(GameSettings.restatCostInTokens).toBe(exampleSettingsFile.restatCostInTokens);
        expect(GameSettings.tierRequiredToBreakHold).toBe(exampleSettingsFile.tierRequiredToBreakHold);
    });



    //More tests soon!
});

jasmine.execute();