<template>
    <main class="">
        <div class="page check">
            <div class="page__container container">
                <div class="page__return" @click="routeTo('home')">Назад и сохранить</div>

                <div class="check__field">
                    <div class="check__label">Название чека</div>
                    <input type="text" v-model="nameCheck">
                </div>
                <div class="check__field">
                    <div class="check__label">Количество денег</div>
                    <input type="number"  v-on:keyup="countAverageCheck()"  v-model="money" >
                </div>
                <div class="check__field">
                    <div class="check__label">Количество клиентов</div>
                <input type="number"  v-on:keyup="countAverageCheck()" v-model="clients">
                </div>
                <div class="check__total">Средний чек - {{ average }} руб.</div>
            </div>

        </div>


    </main>

</template>


<script>
import firebase,{ storage } from 'firebase';
import {db} from '../main';
import store from '../store/index'

export default {
    name: 'averageCheck',
    data() {
        return {
            money: this.$store.state.currentCheck.money || '',
            nameCheck:  this.$store.state.currentCheck.nameCheck || '',
            clients:  this.$store.state.currentCheck.clients || '',
            average:  this.$store.state.currentCheck.average || 0,
            idCheck: this.$store.state.currentCheck.idCheck || false
        }
    },
    methods: {
        routeTo: function(path) {
            if(this.nameCheck == '' && (this.money != '' || this.clients != '')) {
                new Noty({
                    text: 'Введите название чека',
                    type: 'error'
                }).show();
            }else if (this.nameCheck == '' && this.money == '' && this.clients == '') {
                this.$router.replace(path);
                db.collection('users').doc(this.$store.state.uidUser).collection('averageChecks').doc(this.idCheck).delete();
            }else {
                this.$router.replace(path);
                this.updateCheck();
                new Noty({
                    type: 'success',
                    text: 'Чек сохранен',
                }).show();
            }
		},
        countAverageCheck: function() {
            if (this.money != false && this.clients != false) {
                this.average = (this.money / this.clients).toFixed(0);
            }

            this.updateCheck(500)
        },
        updateCheck: function(time) {
            // Проверяю, есть ли id у среднего чека, если нет - создаем новый чек, если есть - вносим изменения в существующий

            var arr = {
                name: this.nameCheck,
                clients: this.clients,
                money: this.money,
                average: this.average || 0
            }


            if(time) {
                setTimeout(() => {
                    db.collection('users').doc(this.$store.state.uidUser).collection('averageChecks').doc(this.idCheck).set(arr)
                }, time)
            } else {
                db.collection('users').doc(this.$store.state.uidUser).collection('averageChecks').doc(this.idCheck).set(arr)
                this.$router.replace('/home');
            }
        }
    },

    created() {
        if (this.idCheck == false) {
            this.$router.replace('home')
        }
    }
}
</script>
