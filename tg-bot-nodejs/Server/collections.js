module.exports = {
    // Ответы бота.
    botResponse:function()
    {
        return {
            hello: "Привет!!! ",
            sad: {
                ifSad: "Не грусти.",
                ifSadMore: "Кажется, тебе стало еще хуже.",
                ifSadToSmile: "Рад, что ты снова в хорошем настроении!",
                ifSadToRage: "Тебе пора в отпуск...",
            },
            smile: {
                ifSmile: "Мне нравится твоя улыбка.",
                ifSmileMore: "Кажется, у тебя сегодня хороший день.",
                ifSmileToSad: "Что случилось? Хочешь закажу тебе пиццу?",
                ifSmileToRage: "Пожалуй я помолчу.",
            },
            rage: {
                ifRage: "Дыши носиком.",
                ifRageMore: "Дыши носиком и посчитай до 10. 1.. 2.. 3..",
                ifRageToSmile: "Рад за тебя!",
                ifRageToSad: "Не переживай, иногда бывают сложные дни...",
            },
            iDontUnderstand: "Я тебя не понимаю."
        };
    },
    // Эмоджи с реакциями.
    emoji:function() {
        return {
            smile: {
                items: ['😀','😃','😄','😁','😆','😂','😊','🤩','🥳'],
                type: 'smile'
            },
            sad: {
                items: ['😒','😞','😔','😟','😕','🙁','😓','😫','😩'],
                type: 'sad'
            },
            rage: {
                items: ['👿','😬','😤','😡','👺','💀','😠','🤯','🤨'],
                type: 'rage'
            }
        };
    }
};