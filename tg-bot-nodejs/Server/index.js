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
const botCommands = collections.botCommands();

// Функции работы с бд.
const mysql = require('./mysql');

// Контекст последнего сообщения.
let lastMessageContext;

// Если это первое сообщение в сессии пользователя, то
// в сообщении нужно поздороваться.
let isFirstMessageOnSession = true;

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const msgText = msg.text;
    let sendMsg = '';

    // Начало сессии.
    if(isFirstMessageOnSession)
    {
        lastMessageContext = emoji.smile.type;
        isFirstMessageOnSession = false;
        sendMsg = botResponse.hello;
    }

    try {
        const result = getResponseOnContext(msgText, lastMessageContext);
        // Если сообщение undefined.
        if(result[0] === undefined)
        {
            throw new Error();
        }

        sendMsg += result[0];
        lastMessageContext = result[1];
    }
    catch (e) {
        if (botCommands.indexOf(msgText, 0) > -1)
            return;

        console.log("Error: " + e.text + "->" + e.message);
        sendMsg = botResponse.iDontUnderstand;
        isFirstMessageOnSession = true;
    }
    bot.sendMessage(chatId, sendMsg);
});

// Команды для работы со статистикой.
bot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId,"stats");
});

function getResponseOnContext(text, lastMessageType) {
    let newMessageContext;
    let result;
    // В зависимости от контекста нужно выбрать ответ.
    // Есть контекст предыдущего сообщения и текущее сообщение.
    switch (lastMessageType) {
        case emoji.smile.type:
            // Smile -> smile.
            if (emoji.smile.items.indexOf(text, 0) > -1) {
                newMessageContext = emoji.smile.type;
                result = botResponse.smile.ifSmileMore;
            }
            // Smile -> sad.
            else if (emoji.sad.items.indexOf(text, 0) > -1) {
                newMessageContext = emoji.sad.type;
                result = botResponse.smile.ifSmileToSad;
            }
            // Smile -> rage.
            else if (emoji.rage.items.indexOf(text, 0) > -1) {
                newMessageContext = emoji.rage.type;
                result = botResponse.smile.ifSmileToRage;
            }
            break;
        case emoji.rage.type:
            // Rage -> smile.
            if (emoji.smile.items.indexOf(text, 0) > -1) {
                newMessageContext = emoji.smile.type;
                result =  botResponse.rage.ifRageToSmile;
            }
            // Rage -> sad.
            else if (emoji.sad.items.indexOf(text, 0) > -1) {
                newMessageContext = emoji.sad.type;
                result = botResponse.rage.ifRageToSad;
            }
            // Rage -> rage.
            else if (emoji.rage.items.indexOf(text, 0) > -1) {
                newMessageContext = emoji.rage.type;
                result = botResponse.rage.ifRageMore;
            }
            break;
        case emoji.sad.type:
            // Sad -> smile.
            if (emoji.smile.items.indexOf(text, 0) > -1) {
                newMessageContext = emoji.sad.type;
                result = botResponse.sad.ifSadToSmile;
            }
            // Sad -> sad.
            else if (emoji.sad.items.indexOf(text, 0) > -1) {
                newMessageContext = emoji.sad.type;
                result = botResponse.sad.ifSadMore;
            }
            // Sad -> rage.
            else if (emoji.rage.items.indexOf(text, 0) > -1) {
                newMessageContext = emoji.sad.type;
                result = botResponse.sad.ifSadToRage;
            }
            break;
        default:
            return;
    }
    return [result, newMessageContext];
}