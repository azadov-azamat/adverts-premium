const {translate} = require("./translate");
const {removeMarkup} = require("../utils/keyboards");
const {Markup} = require("telegraf");

function askForKey(ctx) {
    switch (ctx.session.currentState) {
        case 'marketType':
        case 'propertyType':
        case 'currency':
        case 'rentType':
        case 'buildType':
        case 'listingType':
        case 'repair':
        case 'roomsCount':
            askForEnum(ctx);
            break;
        case 'hasSwimmingPool':
        case 'hasFurnishing':
        case 'hasBalcony':
        case 'hasParking':
        case 'hasSecurity':
        case 'hasSurveillance':
        case 'hasPlayground':
        case 'hasSauna':
        case 'hasSewage':
        case 'hasElectricity':
        case 'hasWater':
        case 'hasGas':
            askForBoolean(ctx);
            break;
        case 'latlng':
            askForAddress(ctx)
        default:
            ctx.reply(translate('enter-text', {key: translate(`properties.${ctx.session.currentState}`)}), removeMarkup());
            break;
    }
}

function askForEnum(ctx) {
    let key = ctx.session.currentState
    let options;

    if (key === 'marketType') {
        options = ['secondary', 'primary'];
    } else if (key === 'propertyType') {
        options = [
            [translate('property-type.house'), translate('property-type.apartment')],
            [translate('property-type.land'), translate('property-type.commercial')],
            [translate('property-type.cottage')]
        ];
    } else if (key === 'buildType') {
        options = [
            [translate('build-type.wooden'), translate('build-type.block')],
            [translate('build-type.monolithic'), translate('build-type.panel')],
            [translate('build-type.brick')]
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
            [translate('repair-type.authors_project'), translate('repair-type.renovation')],
            [translate('repair-type.average'), translate('repair-type.requires_repair')],
            [translate('repair-type.rough_finish'), translate('repair-type.prefinishing')]
        ];
    } else if (key === 'currency') {
        options = ['USD', 'UZS'];
    } else if (key === 'rentType') {
        options = [[translate('rent-type.daily'), translate('rent-type.monthly')]];
    } else if (key === 'listingType') {
        options = [[translate('rent-type.sale'), translate('rent-type.rent')]];
    }
    ctx.reply(translate('select-enum', {key: translate(`properties.${key}`)}), Markup.keyboard(options.map(option => option)).oneTime().resize());
}

function askForBoolean(ctx) {
    let key = ctx.session.currentState
    ctx.reply(`Sizda ${key} mavjudmi?`, Markup.inlineKeyboard([
        Markup.button.callback('Ha', `set_${key}_true`),
        Markup.button.callback('Yo\'q', `set_${key}_false`)
    ]));
}

function askForAddress(ctx) {
    ctx.reply('Manzilni kiriting yoki geolokatsiya jo\'nating.', Markup.keyboard([
        Markup.button.locationRequest('Geolokatsiya yuborish')
    ]).oneTime().resize());
}

module.exports = {askForKey, askForEnum, askForBoolean, askForAddress}