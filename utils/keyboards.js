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
]).resize();

const backKeyboard = () => Markup.keyboard([
  [translate('commands.go-back')],
]).resize();


const mainMenuKeyboard = () => Markup.keyboard([
  [translate('commands.to-announce')],
  [translate('commands.language')]
]).resize();

const settingsKeyboards = () => Markup.keyboard([
  [translate('commands.language')],
  [translate('commands.go-back')],
]).resize();


module.exports = {
  languageKeyboard,
  backKeyboard,
  settingsKeyboards,
  removeMarkup,
  LANGUAGE,
  mainMenuKeyboard,
};