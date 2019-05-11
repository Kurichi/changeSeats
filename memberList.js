const memberName = [
    '飯田', 
    '伊垢離', 
    '石井', 
    '石津', 
    '上田', 
    '太田す',
    '太田ゆ',
    '岡村', 
    '小川', 
    '尾元', 
    '勝弘', 
    '金田', 
    '久保', 
    '栗原',
    '近藤', 
    '定森', 
    '佐藤', 
    '柴田',
    '嶋岡', 
    '新定', 
    '鈴川', 
    '諏訪',
    '田口', 
    '田崎', 
    '田中', 
    '寺岡', 
    '西本',
    '久角', 
    '日高',
    '廣澤', 
    '藤井', 
    '藤岡', 
    '藤本', 
    '的場', 
    '峯', 
    '宮下',
    '宮野', 
    '宗野', 
    '森野', 
    '山加', 
    '山野', 
    '芳岡', 
    'ダニエル'
];

const mysql = require('mysql');
const path = require('path');
const querystring = require('querystring');
const fs = require('fs');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'changeSeats',
    password: 'password',   // change to your password
    database: 'changeseatsdb'
});

connection.connect(function (err) {
    if (err){
        console.log('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});