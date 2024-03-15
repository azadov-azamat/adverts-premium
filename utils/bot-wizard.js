const {
    languageKeyboard,
    settingsKeyboards,
    LANGUAGE,
    mainKeyboard
} = require('../utils/keyboards');

const {translate} = require("../services/translate");
const i18n = require("../services/i18n-config");
const {findKeyByValue} = require("../services/helpers");
const {askForEnum, askForAddress, askForBoolean, sendSummary} = require("../services/stage");
const {OPTIONS} = require("./constants");
const {Scenes} = require("telegraf");
const {getGeolocationData} = require("../services/ymaps");
const {WizardScene} = Scenes;

const propertySteps = OPTIONS["keysProperty"].filter(({single}) => !single).map((property, index) => {
    return (ctx) => {

        if (index > 0) {
            const previousProperty = OPTIONS["keysProperty"][index - 1];

            if (previousProperty.key === 'listingType' && findKeyByValue(ctx.message.text) === 'rent') {
                console.log("ketdi uje")
                OPTIONS['keysProperty'].splice(1, 0, {key: "rentType", type: "enum"})
            }

            if (ctx.message?.text === '/start') {
                ctx.scene.leave();
            }

            switch (previousProperty.type) {
                case 'boolean':
                    const data = ctx.update.callback_query?.data;
                    ctx.wizard.state[previousProperty.key] = !!Number(data);
                    break;
                case 'location':
                    try {
                        const {latitude, longitude} = ctx.message?.location;
                        ctx.wizard.state[previousProperty.key] = [latitude, longitude];
                        getGeolocationData(latitude, longitude).then(res => {
                            let {street, district} = res
                            let dist = OPTIONS['district'].find(({ru}) => district.includes(ru));
                            ctx.wizard.state.street = street
                            ctx.wizard.state.district = dist.value
                        })
                        break;
                    } catch (e) {
                        console.log(e)
                        break;
                    }
                case "input":
                    const text = ctx.message?.text;
                    ctx.wizard.state[previousProperty.key] = findKeyByValue(text);
                    break;

            }
        }

        switch (property.type) {
            case "enum":
                askForEnum(ctx, property.key)
                return ctx.wizard.next();
            case "location":
                askForAddress(ctx, property.key)
                return ctx.wizard.next();
            case "boolean":
                askForBoolean(ctx, property.key)
                return ctx.wizard.next();
            default:
                ctx.reply(`${property.key}ni kiriting:`);
                return ctx.wizard.next();
        }
    };
});


const propertyScene = new WizardScene(
    'property',
    ...propertySteps,

    (ctx) => {
        const lastProperty = OPTIONS["keysProperty"][OPTIONS["keysProperty"].length - 1];
        ctx.wizard.state[lastProperty] = ctx.message.text;

        const userData = OPTIONS["keysProperty"].reduce((acc, property) => {
            acc[property.key] = ctx.wizard.state[property.key];
            return acc;
        }, {});

        console.log(userData)

        sendSummary(ctx)
        ctx.scene.leave();
    }
);

module.exports = {propertyScene};
