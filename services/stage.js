const {translate} = require("./translate");
const {Markup} = require("telegraf");
const {OPTIONS} = require("../utils/constants");

let property = {}

function askForEnum(ctx, key) {
    let options;

    if (key === 'listingType') {
        options = [
            [translate('rent-type.sale'), translate('rent-type.rent')]
        ];
    } else if (key === 'rentType') {
        options = [
            [translate('rent-type.daily'), translate('rent-type.monthly')]
        ];
    } else if (key === 'propertyType') {
        options = [
            [translate('property-type.house'), translate('property-type.apartment')],
            [translate('property-type.land'), translate('property-type.commercial')],
            [translate('property-type.cottage')]
        ];
    } else if (key === 'marketType') {
        options = ['secondary', 'primary'];
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
    }
    ctx.reply(translate('select-enum', {key: translate(`properties.${key}`)}),
        Markup.keyboard(options.map(option => option)).oneTime().resize());
}

function askForBoolean(ctx, key) {

    ctx.reply(`Sizda ${key} mavjudmi?`, Markup.inlineKeyboard([
        Markup.button.callback('Ha', '1'),
        Markup.button.callback('Yo\'q', '0')
    ]));
}

function askForAddress(ctx) {
    ctx.reply('Manzilni kiriting yoki geolokatsiya jo\'nating.', Markup.keyboard([
        Markup.button.locationRequest('Geolokatsiya yuborish')
    ]).oneTime().resize());
}

function sendSummary(ctx) {
    let messageText = 'Siz kiritgan ma\'lumotlar:\n';
    OPTIONS['keysProperty'].forEach(({key, type}) => {
        let value = ctx.wizard.state[key];
        console.log(value)
        switch (type) {
            case "boolean":
                value = Number(value) ? "Ha" : "Yo'q"
                break;
            case 'location' :
                value = `Latitude: ${value[0]}, Longitude: ${value[1]}`;
                break;
            default:
                if (value === undefined) {
                    value = 'Kiritilmagan';
                }
        }

        messageText += `${key}: ${value}\n`;
    });

    ctx.reply(messageText);
}

module.exports = {sendSummary, askForEnum, askForBoolean, askForAddress, property}