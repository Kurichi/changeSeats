<template lang='pug'>
v-layout#Home(fill-height column).elevation-4

    .flex-container
        v-text-field(label='input' v-model='msg.mask' outline clearable) {{ maskMsg() }}
        v-btn(@click='onSend') send
    //- v-select(v-model='selectNum' :items="selectOption" single-line menu-props="auto" hide-details label="出席番号" return-object)
    v-select(v-model='selectNum' :items='selectOption' label='attend')

    h3 Send Messages:
    ul
        li(v-for='item in numbers' :key='item') {{ item }}

</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import io from 'socket.io-client';

@Component({
    components: {},
})

export default class Home extends Vue {
    // tslint: disable
    protected socket = io();
    protected msg = {
        pre: '',
        mask: '',
    };
    protected numbers = [] as string[];

    protected selectOption = [] as number[];
    protected selectNum = 0;

    // アロー関数にすると this.msg で値が取れない
    protected onSend() {
        // 値がなかったら Send しない
        if (this.msg.mask === '') { return; }

        // node.js の'message'に this.msg のデータを送る
        this.socket.emit('message', this.msg.pre, this.selectNum - 1);

        console.log(this.msg.mask); // log
        console.log(this.msg.pre);  // log

        // フィールドの入力値を空にする
        [this.msg.mask, this.msg.pre] = ['', ''];
        this.selectNum = 0;
    }

    protected maskMsg() {
        const char = this.msg.mask.charAt(this.msg.mask.length - 1);

        // 複数回呼ばれるため一文字に対して一回だけ
        if (char !== '*') {
            this.msg.pre += char;   // 末尾にマスク前の文字列を追加
            this.msg.mask = this.msg.mask.replace(/\S/g, '*');  // 全ての文字を置き換える

            console.log(char);  // log of last index
            console.log(this.msg.pre);  // log of pre message
        }
    }

    protected created() {
        // 初期化
        for (let i = 1; i <= 43; ++i) {
            this.numbers.push(`${i}`);
            this.selectOption.push(i);
        }

        // node.js から emit されたら
        this.socket.on('message', (msg: string, id: number) => {
            // 番号を文字列に変更
            this.numbers[id] = msg;

            // vue側の描画イベントを発生させるため
            this.numbers.push('');
            this.numbers.pop();
        });
    }
}
</script>

<style lang='stylus'>
@require '~@/assets/styles/entry/_view.styl';

html
    scroll-view: true;
    // static-view: true;


#Home
    padding: 2rem
    margin: auto
    max-width: 80vm

    .flex-container
        display: flex
        justify-content: space-between
</style>
