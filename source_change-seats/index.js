/**
 * < index.js >
 *      yarn add express
 *      yarn add socket.io
 *
 * < Home.vue >
 *      yarn add -D @types/socket.io-client
 */

const echo = (elm) => console.log(elm);   // log の簡略化

// modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// dist/ のファイルを静的に
app.use(express.static(__dirname + '/client/dist/'));

// / にアクセスしたとき
//      example => localhost:3000/
app.get('/', (req, res) => {
    // ファイルを送る
    res.sendFile(__dirname + '/client/dist/');
});

// node 実行後、サーバーと接続されたら
io.on('connection', (socket) => {
    echo('connected');  // log of check connection

    // vue から emit されたら
    socket.on('message', (msg, id)=> {
        // vue に msg のデータを送る
        io.emit('message', msg, id);

        echo(`message: ${msg}, id: ${id}`);    // log of send data
    });
});

const PORT = process.env.PORT || 3000;  // port
http.listen(PORT, () => {
    echo('server listening. Port:' + PORT); // log of check listen
});
