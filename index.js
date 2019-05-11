const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const multer = require('multer');
const fs = require('fs');

app.use(multer().none());
app.use(express.static('docs'));

const crypto = require('crypto');
const nBytes = 4;

const password = 'Kurichi120286';
const positionList = [];
const list = [];
const memberName = [
    '飯田', '伊垢離', '石井', '石津', '上田', '太田す', '太田ゆ',
    '岡村', '小川', '尾元', '勝弘', '金田', '久保', '栗原',
    '近藤', '佐藤', '定森', '柴田', '嶋岡', '新定', '鈴川', '諏訪',
    '田口', '田崎', '田中', '寺岡', '西本', '久角', '日高',
    '廣澤', '藤井', '藤岡', '藤本', '的場', '峯', '宮下',
    '宮野', '宗野', '森野', '山加', '山野', '芳岡', 'ダニエル'
];

// 乱数生成(整数)
function secureRandom(){
    const randomBytes = crypto.randomBytes(nBytes);

    const r = randomBytes.readUIntBE(0, nBytes);

    return r % list.length;
}

// list初期化
function setList(num){
    for(let i = 0; i < num; i++){
        list.push(i);
    }
}

// ローカルから席情報を取得
function loadSeats(){
    const result = JSON.parse(fs.readFileSync('seats.json', 'utf8'));
    result.forEach(element => {
        positionList.push(element);
        list.splice(element.position, 1);
    });
}

// 席決め
function setSeats(myId){

    // myIdの抽選が終了していたら配列から返す
    for (var value of positionList){
        if(value.id == myId){
            return value.position;
        }
    }

    // 乱数の取得→席
    const x = secureRandom();
    const n = list[x];
    const temp = {
        id : myId,
        name : memberName[myId - 1],
        position : n
    }
    positionList.push(temp);

    // リストのx番目を削除
    list.splice(x, 1);

    // 全員分終わったらjsonに保存
    // if (list.length == 0){
    //     fs.writeFile('seats.json', JSON.stringify(positionList), function(err, result){
    //         if(err){
    //             console.log('error:', err);
    //         }
    //     });
    // }

    // 位置を返す
    return n;
}

// 初期化
setList(43);

// 接続されたら
io.on('connection', (socket) => {
    // すでに決まった人の位置をすべて送る
    socket.emit('all_seats', JSON.stringify(positionList));

    // 抽選イベント
    socket.on('send_id', (id) => {
        // 席決め
        const n = setSeats(id);

        // 返り値
        const retJson = {
            id : parseInt(id),
            name : memberName[id - 1],
            position : parseInt(n)
        };
        console.log(retJson);
        // 送信者に返す
        socket.emit('set_seat', parseInt(n + 1));
        // 全員に送る
        io.emit('new_seat', JSON.stringify(retJson));
    });

    // 席の予約
    socket.on('res_seat', (myJson) => {
        const element = JSON.parse(myJson);
        const id = parseInt(element.id);
        const position = parseInt(element.position) - 1;
        console.log(myJson);
        // パスワードが違ったら終わり
        if (element.passward != password){
            console.log('password error')
            return;
        }
        // すでに終わっていたら終わり
        if (idIsUse(id)){
            console.log('id error');
            return;
        }
        if (list.indexOf(position) == -1){
            console.log('position error');
            return;
        }
        // listから削除
        list.splice(list.indexOf(position), 1);
        // vue側に返す
        const retJson = {
            id : id,
            name : memberName[id - 1],
            position : position
        };
        positionList.push(retJson);
        console.log(retJson);
        io.emit('new_seat', JSON.stringify(retJson));
    });
});

function idIsUse(num){
    for (elem of positionList){
        if(elem.id == num){
            return true;
        }
    }
    return false;
}

// 3000ポートで開く
const PORT = process.env.PORT || 3000;  // port
http.listen(PORT, () => {
    console.log('Listening on port' + PORT);
});