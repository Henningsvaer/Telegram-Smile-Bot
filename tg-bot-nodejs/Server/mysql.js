function connectionCreate()
{
    const mysql = require("mysql2");
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "tgdb",
        password: "123456"
    });
}

module.exports = {
    insertSessionsToDb:function (time_session_begin, time_session_end) {
        const connection = connectionCreate();
        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            const sql = "INSERT INTO sessions (time_session_begin, time_session_end) " +
                "VALUES ('"+time_session_begin+"', "+time_session_end+")";
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        });
        connection.end();
    },
    insertMessagesToDb:function (text_message, id_bot, id_client) {
        let session_id = undefined === getLastSessionId()? 1 : 2;
        console.log("session_id:" + session_id);
        const time = new Date().toISOString().slice(0, 10).replace('T', ' ');
        const connection = connectionCreate();
        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            const sql = "INSERT INTO messages (id_session, time, text_message, id_bot, id_client) " +
                "VALUES ('"+session_id+"', "+time+", "+text_message+", "+id_bot+", "+id_client+")";
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        });
        connection.end();
    },
    getLastSessionId:function(){
        const connection = connectionCreate();
        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            const sql = "SELECT MAX(id_session) FROM sessions";
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                connection.end();
                return results;
            });
        });
    },
    getLastMessageId:function(){
        let result;
        const connection = connectionCreate();
        const sql = `SELECT MAX(id) FROM messages`;
        connection.connect();
        connection.query(sql,function(err, results) {
            if(err) result = -1
            else result = results;
        });
        connection.end();
        return result;
    },
    getBotSuccessResponseFromDb:function () {
        /*
        % успешных ответов Бота.
        Успешным считается любой ответ, кроме ответа «Я тебя не понимаю»
         */
        const connection = connectionCreate();
        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            const sql = "SELECT * FROM messages WHERE text_message != 'Я тебя не понимаю";
            connection.query(sql, function (err, result) {
                if (err) throw err;
                connection.end();
                return results;
            });
        });
    },
};