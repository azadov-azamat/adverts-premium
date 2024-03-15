require('dotenv').config({});

const {Telegraf, Markup, session, Scenes} = require('telegraf');
const Redis = require('./services/telegraf-redis-session');
const i18n = require('./services/i18n-config');
const {translate} = require("./services/translate");
const {mainMenuKeyboard} = require("./utils/keyboards");
const {propertyScene} = require("./utils/bot-wizard");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const store = new Redis();

bot.use(session({store}));

bot.use((ctx, next) => {
    ctx.i18n = i18n;
    ctx.session.language = ctx.session.language || 'uz';
    return next();
});

bot.use(new Scenes.Stage([propertyScene]).middleware());

bot.start((ctx) => {
    ctx.scene.leave();
    ctx.reply(translate('welcome-and-select-menu'), mainMenuKeyboard())
});

require('./utils/bot-hears')(bot);

bot.launch();