const {
    languageKeyboard,
    settingsKeyboards,
    LANGUAGE,
    mainKeyboard
} = require('../utils/keyboards');

const {translate} = require("../services/translate");
const i18n = require("../services/i18n-config");

module.exports = function (bot) {

    bot.hears((text, ctx) => {

        const command = translate({phrase: 'commands.to-announce', locale: ctx.session.language});
        return text === command;

    }, async (ctx) => {
        ctx.session.page = 'to-announce';

        return ctx.scene.enter('property')

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
