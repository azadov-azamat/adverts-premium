require('dotenv').config({});

const {Telegraf, Markup, session} = require('telegraf');
const redisClient = require('./services/redis');
const Redis = require('./services/telegraf-redis-session');
const i18n = require('./services/i18n-config');
const {translate} = require("./services/translate");
const {mainMenuKeyboard} = require("./utils/keyboards");
const {OPTIONS} = require("./utils/constants");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const store = new Redis();

bot.use(session({store}));

bot.use((ctx, next) => {
    ctx.i18n = i18n;
    ctx.session.property = {}
    ctx.session.currentState = OPTIONS['keysProperty'][0]
    ctx.session.language = ctx.session.language || 'uz';
    return next();
});

bot.start((ctx) => {
    ctx.reply(translate('welcome-and-select-menu'), mainMenuKeyboard())
});

require('./utils/bot-hears')(bot);
require('./utils/bot-on')(bot);

// function sendSummary(ctx) {
//     let messageText = 'Siz kiritgan ma\'lumotlar:\n';
//     keysOrder.forEach((key) => {
//         let value = userData[key];
//         // Agar value koordinatalar bo'lsa, ularni chiroyli formatga o'tkazamiz
//         if (key === 'latlng' && typeof value === 'object' && value.coordinates) {
//             value = `Latitude: ${value.coordinates[0]}, Longitude: ${value.coordinates[1]}`;
//         }
//         // Boolean qiymatlar uchun "Ha" yoki "Yo'q" deb ko'rsatamiz
//         if (typeof value === 'boolean') {
//             value = value ? 'Ha' : 'Yo\'q';
//         }
//         // Agar kalitning qiymati undefined bo'lsa, "Kiritilmagan" deb ko'rsatamiz
//         if (value === undefined) {
//             value = 'Kiritilmagan';
//         }
//         messageText += `${key}: ${value}\n`;
//     });
//
//     // Xabarni yuboramiz
//     ctx.reply(messageText);
// }
//
// bot.on('location', (ctx) => {
//     // if (currentStep === 'askForAddress') {
//     console.log(ctx.message.location)
//     const {latitude, longitude} = ctx.message.location;
//     userData.latlng = {type: 'Point', coordinates: [latitude, longitude]};
//
// });
//
// bot.action(/set_(.+)_true|set_(.+)_false/, (ctx) => {
//     const match = ctx.match[0].match(/set_(.+)_true|set_(.+)_false/);
//     const key = match[1] || match[2];
//     userData[key] = ctx.match[0].includes('_true');
//     const currentIndex = keysOrder.indexOf(key);
//     if (currentIndex + 1 < keysOrder.length) {
//         currentState = keysOrder[currentIndex + 1];
//         askForKey(ctx, currentState);
//     }
// });

bot.launch();