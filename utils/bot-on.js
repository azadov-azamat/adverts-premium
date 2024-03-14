const { askForKey} = require("../services/stage");
const {OPTIONS} = require("./constants");

module.exports = function (bot) {

    bot.on('location', (ctx) => {
        let currentIndex = OPTIONS['keysProperty'].indexOf(ctx.session.currentState);
        const {latitude, longitude} = ctx.message.location;

        ctx.session.property.latlng = [latitude, longitude];
        ctx.session.currentState = OPTIONS['keysProperty'][currentIndex + 1];
        askForKey(ctx);
    });
};
