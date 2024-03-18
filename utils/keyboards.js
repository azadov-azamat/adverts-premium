require('dotenv').config({});

const { Markup } = require('telegraf');
const {translate} = require("../services/translate");

// const { handleCommand } = require('./commands');

const LANGUAGE = {
  'uz': '🇺🇿 O\'zbekcha',
  'ru': '🇷🇺 Русский',
  'en': '🇬🇧 English',
};

const removeMarkup = () => Markup.removeKeyboard();


const languageKeyboard = () => Markup.keyboard([
  Object.values(LANGUAGE),
  [translate('commands.go-back')],
]).oneTime().resize();

const backKeyboard = () => Markup.keyboard([
  [translate('commands.go-back')],
]).oneTime().resize();


const mainMenuKeyboard = () => Markup.keyboard([
  [translate('commands.to-announce')],
  [translate('commands.language')]
]).oneTime().resize();

const settingsKeyboards = () => Markup.keyboard([
  [translate('commands.language')],
  [translate('commands.go-back')],
]).oneTime().resize();

const checkingKeyboards = () => Markup.keyboard([
  [translate('commands.checking-yes')],
  [translate('commands.checking-no')],
]).oneTime().resize();

function generateYearsKeyboard() {
  const currentYear = new Date().getFullYear();
  const startYear = 1960;
  const totalYears = currentYear - startYear + 1;
  const yearsPerRow = 4;
  const keyboardRows = [];

  for (let i = 0; i < totalYears; i += yearsPerRow) {
    const row = [];
    for (let j = 0; j < yearsPerRow; j++) {
      const year = startYear + i + j;
      if (year <= currentYear) {
        row.push(Markup.button.callback(`${year}`, `year`));
      }
    }
    keyboardRows.push(row);
  }

  return Markup.inlineKeyboard(keyboardRows);
}

module.exports = {
  languageKeyboard,
  backKeyboard,
  settingsKeyboards,
  removeMarkup,
  LANGUAGE,
  mainMenuKeyboard,
  generateYearsKeyboard,
  checkingKeyboards
};