<template>
    <div class="average-checks">
        <input type="text" v-model="nameCheck" @blur="updateCheck(500)" placeholder="Имя чека">
        <input type="number"  v-on:keyup="countAverageCheck()" @blur="updateCheck(500)" v-model="money" placeholder="Количество денег">
        <input type="number"  v-on:keyup="countAverageCheck()" @blur="updateCheck(500)" v-model="clients" placeholder="Количество клиентов">
        <button class="close-btn" @click="updateCheck(); ">
            <font-awesome-icon class="form-icon" icon="times"/>
        </button>
        <p class="check__average">Средний чек: {{ average }} рублей</p>

    </div>
</template>


<script>
import firebase,{ storage } from 'firebase';

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
        countAverageCheck: function() {
            if (this.money != false && this.clients != false) {
                this.average = (this.money / this.clients).toFixed(0);
            }
        },
        updateCheck: function(time) {
            // Проверяю, есть ли id у среднего чека, если нет - создаем новый чек, если есть - вносим изменения в существующий

            var arr = {
                name: this.nameCheck,
                clients: this.clients,
                money: this.money,
                average: parseInt(this.money / this.clients)
            }


            if(time) {
                setTimeout(() => {
                    firebase.firestore().collection('users').doc(this.$store.state.uidUser).collection('averageChecks').doc(this.idCheck).set(arr)

                    this.$notify({
                        group: 'foo',
                        title: 'Изменения сохранены',
                        type: 'success'
                    });
                }, time)
            } else {
                firebase.firestore().collection('users').doc(this.$store.state.uidUser).collection('averageChecks').doc(this.idCheck).set(arr)
                this.$router.replace('/home');
                this.$notify({
                    group: 'foo',
                    title: 'Изменения сохранены',
                    type: 'success'
                });
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



<style >

    .average-checks {
        margin-left: 50px;
    }

    .average-checks input {
        padding: 10px;
        border: none;
        border-bottom: 1px solid #eee;
        font-size: 20px;
        display: block;
        margin-bottom: 30px;
        width: 400px;
    }
</style>

