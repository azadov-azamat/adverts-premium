const {
    languageKeyboard,
    settingsKeyboards,
    LANGUAGE,
    mainKeyboard
} = require('../utils/keyboards');

const {translate} = require("../services/translate");
const i18n = require("../services/i18n-config");
const {findKeyByValue} = require("../services/helpers");
const {askForKey} = require("../services/stage");
const {OPTIONS} = require("./constants");

module.exports = function (bot) {

    bot.hears((text, ctx) => {

        const command = translate({phrase: 'commands.to-announce', locale: ctx.session.language});
        return text === command;

    }, async (ctx) => {
        ctx.session.page = 'to-announce';

        ctx.reply(askForKey(ctx))

    });

    bot.hears(/.*/, (ctx) => {
        const text = ctx.message.text
        let currentState = ctx.session.currentState
        let property = ctx.session.property
        let currentIndex = OPTIONS['keysProperty'].indexOf(currentState);

        if (currentState.startsWith('has')) {
            return
        }
        const commandRent = translate({phrase: 'rent-type.rent', locale: ctx.session.language});

        if (text === commandRent) {
            OPTIONS['keysProperty'].splice(1, 0, 'rentType')
        } else {
            if (ctx.session.property['listingType'] !== 'rent')
                if (OPTIONS['keysProperty'].find(item => item === 'rentType')) OPTIONS['keysProperty'].splice(OPTIONS['keysProperty'].indexOf('rentType'), 1)
        }

        ctx.session.property[currentState] = findKeyByValue(text);

        console.log(property)
        console.log(currentState)

        if (currentIndex + 1 < OPTIONS['keysProperty'].length) {
            console.log(currentIndex)
            console.log(OPTIONS['keysProperty'][currentIndex + 1])
            ctx.session.currentState = OPTIONS['keysProperty'][currentIndex + 1];
            askForKey(ctx);
        } else {
            ctx.reply('Barcha ma\'lumotlar qabul qilindi. Raxmat!');
            console.log(property);
        }
    });


    bot.hears((text, ctx) => {

        const command = translate({phrase: 'commands.language', locale: ctx.session.language});
        return text === command;

    }, async (ctx) => {
        ctx.session.page = 'language';
        await ctx.reply(translate('select-language'), languageKeyboard());

    });

    bot.hears((text) => {
        return Object.values(LANGUAGE).includes(text);
    }, async (ctx) => {
        try {
            const {text} = ctx.message;
            const chosenLanguage = Object.keys(LANGUAGE).find(key => LANGUAGE[key] === text);

            i18n.setLocale(chosenLanguage);
            ctx.session.language = chosenLanguage;

            ctx.reply(translate('selected-language', {lang: text}), settingsKeyboards());
            ctx.session.page = 'settings';

        } catch (e) {
            console.log(e);
        }
    });

    bot.hears((text, ctx) => {

        const command = translate({phrase: 'commands.go-back', locale: ctx.session.language});
        return text === command;
    }, async (ctx) => {
        // let id = ctx.from.id;
        let page = ctx.session.page;

        if (page === 'settings') {
            ctx.session.page = 'main';
            await ctx.reply(translate('main-menu'), mainKeyboard());
        } else if (page === 'language') {
            ctx.session.page = 'settings';
            await ctx.reply(translate('select-setting'), settingsKeyboards());
        }
    });
};
