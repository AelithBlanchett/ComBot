[
    {
        "name":"Bondage",
        "uses":1
    },
    {
        "name":"SubHold",
        "uses":5,
        "sTimeToTrigger":"Any",
        "sEvent":"OnTurnTick"
    },
    {
        "name":"SexHold",
        "uses":5,
        "sTimeToTrigger":"Any",
        "sEvent":"OnTurnTick"
    },
    {
        "name":"HumHold",
        "uses":5,
        "sTimeToTrigger":"Any",
        "sEvent":"OnTurnTick"
    },
    {
        "name":"SubHoldBrawlBonus",
        "diceRoll": 3,
        "uses":5,
        "sTimeToTrigger":"Before",
        "sEvent":"PowerBasedAttack"
    },
    {
        "name":"SexHoldLustBonus",
        "diceRoll": 3,
        "uses":5,
        "sTimeToTrigger":"Before",
        "sEvent":"SensualityBasedAttack"
    },
    {
        "name":"ItemPickupBonus",
        "diceRoll": 5,
        "uses":3,
        "sTimeToTrigger":"Before",
        "sEvent":"PowerBasedAttack"
    },
    {
        "name":"SextoyPickupBonus",
        "diceRoll": 5,
        "uses":3,
        "sTimeToTrigger":"Before",
        "sEvent":"SensualityBasedAttack"
    },
    {
        "name":"StrapToy",
        "sTimeToTrigger":"Any",
        "sEvent":"OnTurnTick"
    },
    {
        "name":"DegradationMalus",
        "focusDamage": 10,
        "uses":5,
        "sTimeToTrigger":"Before",
        "sEvent":"Degradation"
    },
    {
        "name":"Stun",
        "uses":2,
        "sTimeToTrigger":"Before",
        "sEvent":"AnyOffensiveAction"
    },
    {
        "name":"DummyModifier"
    }
]