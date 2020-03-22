'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = '1143399778:AAFEzQt5NF_ePZ41l97PD7oeHzF7JdFoiso';
const bot = new TelegramBot(token, {
    polling: true
});

// Объекты с колекциями (ответы бота и тд).
const collections = require('./collections.js');
const emoji = collections.emoji();
const botResponse = collections.botResponse();

// Контекст последнего сообщения.
let lastMessageContext;

// Если это первое сообщение в сессии пользователя, то
// в сообщении нужно поздороваться.
let isFirstMessageOnSession = true;

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const msgText = msg.text;
    let sendMsg = '';

    console.log("msg.text: " + msg.text);

    if(!isCorrectMessageChecker(msgText))
    {
        return;
    }

    if(isFirstMessageOnSession)
    {
        lastMessageContext = emoji.smile.type;
        isFirstMessageOnSession = false;
        sendMsg = botResponse.hello;
    }

    try {
        sendMsg += getResponseOnContext(msgText, lastMessageContext);
    }
    catch (e) {
        console.log("Error: " + e.text + "->" + e.message);
        sendMsg = "Бот немного устал...";
    }
    console.log("sendMsg: " +  sendMsg);
    bot.sendMessage(chatId, sendMsg);
});

// Переписать caseы на циклы, потому что сейчас они все одинаковые и независят от контекста.
function getResponseOnContext(text, lastMessageType) {
    console.log("getResponseOnContext text: " + text);
    // В зависимости от контекста нужно выбрать ответ.
    // Есть контекст предыдущего сообщения и текущее сообщение.
    switch (lastMessageType) {
        case emoji.smile.type:
            // Smile -> smile.
            if (emoji.smile.items.indexOf(text, 0) > -1) {
                lastMessageContext = emoji.smile.type;
                return botResponse.smile.ifSmileMore;
            }
            // Smile -> sad.
            if (emoji.sad.items.indexOf(text, 0) > -1) {
                lastMessageContext = emoji.smile.type;
                return botResponse.smile.ifSmileToSad;
            }
            // Smile -> rage.
            if (emoji.rage.items.indexOf(text, 0) > -1) {
                lastMessageContext = emoji.smile.type;
                return botResponse.smile.ifSmileToRage;
            }
            break;
        case emoji.rage.type:
            // Rage -> smile.
            if (emoji.smile.items.indexOf(text, 0) > -1) {
                lastMessageContext = emoji.rage.type;
                return botResponse.rage.ifRageToSmile;
            }
            // Rage -> sad.
            if (emoji.sad.items.indexOf(text, 0) > -1) {
                lastMessageContext = emoji.rage.type;
                return  botResponse.rage.ifRageToSad;
            }
            // Rage -> rage.
            if (emoji.rage.items.indexOf(text, 0) > -1) {
                lastMessageContext = emoji.rage.type;
                return botResponse.rage.ifRageMore;
            }
            break;
        case emoji.sad.type:
            // Sad -> smile.
            if (emoji.smile.items.indexOf(text, 0) > -1) {
                lastMessageContext = emoji.sad.type;
                return botResponse.sad.ifSadToSmile;
            }
            // Sad -> sad.
            if (emoji.sad.items.indexOf(text, 0) > -1) {
                lastMessageContext = emoji.sad.type;
                return botResponse.sad.ifSadMore;
            }
            // Sad -> rage.
            if (emoji.rage.items.indexOf(text, 0) > -1) {
                lastMessageContext = emoji.sad.type;
                return botResponse.sad.ifSadToRage;
            }
            break;
        default:
            break;
    }
    // Нужно вернуть текстовый ответ.
    return result;
}
function isCorrectMessageChecker(messageText) {
    return true;
}