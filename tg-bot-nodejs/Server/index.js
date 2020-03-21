'use strict';

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1143399778:AAFEzQt5NF_ePZ41l97PD7oeHzF7JdFoiso';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Контекст последнего сообщения.
let lastMessageContex = null;

// Если это первое сообщение в сессии пользователя, то
// в сообщении нужно поздороваться.
const isFirstMessageOnSession = true;

// Объекты с колекциями (ответы бота и тд).
const collections = require('./collections.js');
const emoji = collections.emoji();
const botResponse = collections.botResponse();

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    let sendMsg = '';

    // send a message to the chat acknowledging receipt of their message
    // 1. Если сообщение состоит только из 1 смайлика.
    if(!onlyOneSmileOnMessageChecker(msg.text))
        return;

    // 2. Проверяем наличие контекста предыдущего сообщения.
    if(lastMessageContex === null)
    {
        // 2.1. Храним тип предыдущего сообщения по настроению: Грусть, Радость, Буйство.
        // Т.к. его нет храним первое сообщение.
        lastMessageContex = typeOfSmileToContex(msg.text, emoji);
        // 2.2.  Первое сообщение в сессии => нужно поздороваться.
        sendMsg = botResponse.hello;
    }

    switch (lastMessageContex) {
            // smile
        case typesOfEmoji[0]:
            sendMsg += getMessageWithContex(typesOfEmoji[0], lastMessageContex);
            break;
            // sad
        case typesOfEmoji[1]:
            sendMsg += getMessageWithContex(typesOfEmoji[1], lastMessageContex);
            break;
            // rage
        case typesOfEmoji[2]:
            sendMsg += getMessageWithContex(typesOfEmoji[2], lastMessageContex);
            break;
        default:
            console.log(lastMessageContex);
            break;
    }

    bot.sendMessage(chatId, sendMsg);
});

// Определение типа смайла: Грусть, Радость, Буйство.
function typeOfSmileToContex(text, emoji) {
    let type = "";
    // Если смайл есть в коллекции, то это его тип.
    return type;
}

function onlyOneSmileOnMessageChecker(text) {
    return true;
}

function getMessageWithContex(type, contex) {
    return '';
}