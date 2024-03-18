const {translate} = require("./translate");
const {Markup} = require("telegraf");
const {OPTIONS} = require("../utils/constants");
const {generateYearsKeyboard, checkingKeyboards, removeMarkup} = require("../utils/keyboards");

let property = {}

function askForEnum(ctx, key) {
    let options;

    if (key === 'listingType') {
        options = [
            [translate('enum-types.sale'), translate('enum-types.rent')]
        ];
    } else if (key === 'rentType') {
        options = [
            [translate('enum-types.daily'), translate('enum-types.monthly')]
        ];
    } else if (key === 'propertyType') {
        options = [
            [translate('enum-types.house'), translate('enum-types.apartment')],
            [translate('enum-types.land'), translate('enum-types.commercial')],
            [translate('enum-types.cottage')]
        ];
    } else if (key === 'marketType') {
        options = ['secondary', 'primary'];
    } else if (key === 'buildType') {
        options = [
            [translate('enum-types.wooden'), translate('enum-types.block')],
            [translate('enum-types.monolithic'), translate('enum-types.panel')],
            [translate('enum-types.brick')]
        ];
    } else if (key === 'roomsCount') {
        options = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['10']
        ];
    } else if (key === 'repair') {
        options = [
            [translate('enum-types.authors_project'), translate('enum-types.renovation')],
            [translate('enum-types.average'), translate('enum-types.requires_repair')],
            [translate('enum-types.rough_finish'), translate('enum-types.prefinishing')]
        ];
    } else if (key === 'currency') {
        options = ['USD', 'UZS'];
    }
    ctx.reply(translate('select-enum', {key: translate(`properties.${key}`)}),
        Markup.keyboard(options.map(option => option)).oneTime().resize());
}

function askForBoolean(ctx, key) {

    ctx.reply(translate('boolean-types.title', {has: translate(`boolean-types.${key}`)}), Markup.inlineKeyboard([
        Markup.button.callback('Ha', '1'),
        Markup.button.callback('Yo\'q', '0')
    ]), removeMarkup());
}

function askForYear(ctx, key) {
    ctx.reply(`${key} qurilgan yilni tanlang`, generateYearsKeyboard());
}

function askForAddress(ctx) {
    ctx.reply('Manzilni kiriting yoki geolokatsiya jo\'nating.', Markup.keyboard([
        Markup.button.locationRequest('Geolokatsiya yuborish')
    ]).oneTime().resize());
}

function getNextStepIndex(currentIndex, listingType) {
    // Agar 'listingType' 'rent' bo'lsa, 'rentType' qadamini qo'shish kerak
    if (listingType === 'rent') {
        return currentIndex + 1; // 'rentType' so'rov qilish uchun indeks
    } else {
        return currentIndex + 2; // 'rentType' so'rov qilmaydigan keyingi qadam indeksi
    }
}
function sendSummary(ctx) {
    let messageText = 'Siz kiritgan ma\'lumotlar:\n \n';
    OPTIONS['keysProperty'].forEach(({key, type}) => {
        let value = ctx.wizard.state[key];

        switch (type) {
            case "boolean":
                value = Number(value) ? "Ha" : "Yo'q"
                messageText += `${translate('boolean-types.' + key)}: ${value}\n`;
                break;
            case 'location' :
                value = `Lat: ${value[0]}, Long: ${value[1]}`;
                messageText += `${translate('properties.' + key)}: ${value}\n`;
                break;
            case 'enum':
                messageText += `${translate('properties.' + key)}: ${translate('enum-types.' + value)}\n`;
                break;
            default:
                if (value === undefined) {
                    value = 'Kiritilmagan';
                } else if (key === 'district') {
                    messageText += `${translate('properties.' + key)}: ${translate('districts.' + value)}\n`;
                } else if (key === 'constructionDate') {
                    messageText += `${translate('properties.' + key)}: ${translate('year', {date: value})}\n`;
                } else {
                    messageText += `${translate('properties.' + key)}: ${value}\n`;
                }
        }
    });

    ctx.reply(messageText);
    ctx.reply(translate('commands.checking'), checkingKeyboards())
}

module.exports = {sendSummary, askForEnum, askForBoolean, askForAddress, property, askForYear, getNextStepIndex}