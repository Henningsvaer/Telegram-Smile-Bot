'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = '1143399778:AAFEzQt5NF_ePZ41l97PD7oeHzF7JdFoiso';
const bot = new TelegramBot(token, {
    polling: true
});
// Функции работы с бд.
const mysql_modules = require('./mysql');
// Объекты с колекциями (ответы бота и тд).
const collections = require('./collections.js');
const emoji = collections.emoji();
const botResponse = collections.botResponse();
const botCommands = collections.botCommands();

// Контекст последнего сообщения.
let lastMessageContext;
// Если это первое сообщение в сессии пользователя, то
// в сообщении нужно поздороваться.
let isFirstMessageOnSession = true;
let time_session_begin = new Date().toISOString().slice(0, 10).replace('T', ' ');
let time_session_end;
// Сообщения текущей сессии.
let messages = [];
let fromId;
// Таймер сессии на 1 минуте.
let timerId = setTimeout(sessionEnd,1000 * 60);
function sessionEnd()
{
    // !!! TO DO: Сохранение в бд не работает.
    try {
        time_session_end = new Date().toISOString().slice(0, 10).replace('T', ' ');
        mysql_modules.insertSessionsToDb(time_session_begin, time_session_end);
        for (let i = 0; i < messages.length; i++) {
            mysql_modules.insertMessagesToDb(messages[i], fromId, fromId);
        }
    }
    catch (e) {
        console.log(e);
    }
    messages = [];
    time_session_begin = new Date().toISOString().slice(0, 10).replace('T', ' ');
    isFirstMessageOnSession = true;
}

bot.on('message', (msg) => {
    // Сообщение получено -> перезапускаем таймер.
    clearTimeout(timerId);
    timerId = setTimeout(sessionEnd,1000 * 60);

    const chatId = msg.chat.id;
    fromId = msg.message_id;
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

        sendMsg = botResponse.iDontUnderstand;
        isFirstMessageOnSession = true;
    }
    messages += sendMsg;
    bot.sendMessage(chatId, sendMsg);
});

// Команды для работы со статистикой.
// Команды не считаются за "сообщения".
bot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,"Здесь должна была быть статистика.");
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
