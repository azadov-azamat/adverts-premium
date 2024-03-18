const {
    languageKeyboard,
    settingsKeyboards,
    LANGUAGE,
    mainKeyboard
} = require('../utils/keyboards');

const {translate} = require("../services/translate");
const i18n = require("../services/i18n-config");
const {findKeyByValue} = require("../services/helpers");
const {
    askForEnum,
    askForAddress,
    askForBoolean,
    sendSummary,
    askForYear,
    getNextStepIndex
} = require("../services/stage");
const {OPTIONS} = require("./constants");
const {Scenes} = require("telegraf");
const {getGeolocationData} = require("../services/ymaps");
const {WizardScene} = Scenes;

const propertySteps = OPTIONS["keysProperty"].filter(({single}) => !single).map((property, index) => {
    return async (ctx) => {

        // console.log(ctx.wizard.state)


        if (index > 0) {
            const previousProperty = OPTIONS["keysProperty"][index - 1];

            if (property.key === 'listingType') {
                const selectedOption = findKeyByValue(ctx.message.text);
                const nextStepIndex = getNextStepIndex(index, selectedOption);
                return ctx.wizard.selectStep(nextStepIndex);
            }

            if (ctx.message?.text === '/start') {
                ctx.scene.leave();
            }

            switch (previousProperty.type) {
                case 'boolean':
                    const data = ctx.update.callback_query?.data;
                    ctx.wizard.state[previousProperty.key] = !!Number(data);
                    break;
                case 'inline':
                    ctx.wizard.state[previousProperty.key] = ctx.update.callback_query?.data;
                    break;
                case 'location':
                    try {

                        const {latitude, longitude} = ctx.message?.location;
                        const res = await getGeolocationData(latitude, longitude)

                        let {street, district} = res
                        let dist = OPTIONS['district'].find(({ru}) => district.includes(ru));

                        ctx.wizard.state.street = String(street)
                        ctx.wizard.state.district = String(dist.value)

                        ctx.wizard.state[previousProperty.key] = [latitude, longitude]

                        console.log(ctx.wizard.state);
                        break;
                    } catch (e) {
                        console.log(e)
                    }
                case 'input':
                case "enum":
                    const text = ctx.message?.text;
                    ctx.wizard.state[previousProperty.key] = findKeyByValue(text);
                    break;

            }
        }

        switch (property.type) {
            case "enum":
                askForEnum(ctx, property.key)
                ctx.wizard.next();
                break;
            case "location":
                askForAddress(ctx, property.key)
                ctx.wizard.next();
                break;
            case "boolean":
                askForBoolean(ctx, property.key)
                ctx.wizard.next();
                break
            case "inline":
                askForYear(ctx, property.key)
                ctx.wizard.next();
                break
            default:
                ctx.reply(translate('input-types.title', {key: translate('properties.' + property.key)}));
                return ctx.wizard.next();
        }
    };
});


const propertyScene = new WizardScene(
    'property',
    ...propertySteps,

    (ctx) => {
        const lastProperty = OPTIONS["keysProperty"][OPTIONS["keysProperty"].length - 3];
        ctx.wizard.state[lastProperty.key] = ctx.message.text;

        const propertyData = OPTIONS["keysProperty"].reduce((acc, property) => {
            acc[property.key] = ctx.wizard.state[property.key];
            return acc;
        }, {});

        console.log(propertyData)

        sendSummary(ctx)
        ctx.scene.leave();
    }
);

module.exports = {propertyScene};
