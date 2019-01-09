<template>
    <div class="prime-cost">

        <input class="prime-cost__name" type="text" @focus="nameEdit = !nameEdit" @blur="nameEdit = !nameEdit; updatePrimeCost()" v-model="namePrimeCost" placeholder="Введите название расчета">

        <div class="total">
            {{ totalCost }} рублей на клиента
        </div>

        <button class="addres" @click="addRes()">Добавить ресурс</button>


        <div class="costs-list">
            <div class="cost-item" v-for="(item, idx) in resourses" :key="idx">
                <input v-model="item.name" @blur="updatePrimeCost(500)" placeholder="Имя ресурса"><br>
                <input v-on:keyup="countResCost(item); countTotalCost()" @blur="updatePrimeCost(500)" v-model="item.cost" placeholder="Стоимость упаковки"><br>
                <input v-on:keyup="countResCost(item); countTotalCost()" @blur="updatePrimeCost(500)" v-model="item.value" placeholder="Объем упаковки"><br>
                <input v-on:keyup="countResCost(item); countTotalCost()" @blur="updatePrimeCost(500)"  v-model="item.valuePerClient" placeholder="Трата на клиента"><br>

                {{ item.costPerClient }}<br>
                <button class="cost-item__cross" @click="deleteRes(idx)">
                    <font-awesome-icon  icon="times"/>
                </button>
            </div>
        </div>




        <button class="close-btn" @click="updatePrimeCost(); routeTo('home')">
            <font-awesome-icon  icon="times"/>
        </button>

    </div>
</template>


<style>
    .costs-list {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .cost-item {
        margin-right: 30px;
        border: 1px solid #ccc;
        padding: 30px 20px;
        position: relative;
        margin-bottom: 20px;
    }
    .cost-item__cross {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
    }

    .prime-cost{}
    .prime-cost__name {
        border: none;
        border-bottom: 1px solid #ccc;
        background: transparent;
        outline: none;
        padding: 20px;
        font-size: 20px;
        width: 300px;
    }

    .total {
        margin: 30px 0;
    }

    .addres {
        padding: 10px 20px;
        color: #fff;
        background-color: green;
        margin-bottom: 20px;
        border: none;
    }
</style>



<script>
import firebase,{ storage } from 'firebase';
export default {
    name: 'primeCost',
    data() {
        return {

            resourses: this.$store.state.currentPrimeCost.resourses || [],
            namePrimeCost: this.$store.state.currentPrimeCost.name || '',
            totalCost: this.$store.state.currentPrimeCost.totalCost || 0,
            costId: this.$store.state.currentPrimeCost.costId || false,
        }
    },
    computed: {

    },
    methods: {
        routeTo: function(path) {
            this.$router.replace(path);
        },
        countResCost: function(item) {
            if (item.cost != false && item.value != false && item.valuePerClient != false) {
                item.costPerClient = (item.cost / item.value * item.valuePerClient).toFixed(2)
            }
        },
        countTotalCost: function() {
            this.totalCost = 0;

            this.resourses.forEach((item, i) => {
                this.totalCost += +item.costPerClient;
            });

            this.totalCost = this.totalCost.toFixed(2)
        },
        addRes: function(id = false) {
            this.resourses.push({
                name: '',
                cost: '',
                value: '',
                valuePerClient: '',
                costPerClient: 0,
            });

            this.clearResValue();
            this.countTotalCost();

            this.updatePrimeCost();
        },
        changeRes: function() {
            this.resEdit = !this.resEdit;
            this.countTotalCost();
            this.updatePrimeCost();
        },
        deleteRes: function(index) {
            this.resourses = this.resourses.filter((item, i) => i !== index);
            this.countTotalCost();
            this.updatePrimeCost();
        },
        clearResValue: function() {
            this.name = '';
            this.cost = '';
            this.value = '';
            this.valuePerClient = '';
        },
        updatePrimeCost: function(time) {

            if(time) {
                setTimeout(() => {
                    firebase.firestore().collection('users').doc(this.$store.state.uidUser).collection('primeCosts').doc(this.costId).set({
                        name: this.namePrimeCost,
                        resourses: this.resourses,
                        total: this.totalCost
                    }, {merge: true})

                    this.$notify({
                        group: 'foo',
                        title: 'Изменения сохранены',
                        type: 'success'
                    });
                }, time)
            }else {
                firebase.firestore().collection('users').doc(this.$store.state.uidUser).collection('primeCosts').doc(this.costId).set({
                    name: this.namePrimeCost,
                    resourses: this.resourses,
                    total: this.totalCost
                }, {merge: true})


                this.$notify({
                    group: 'foo',
                    title: 'Изменения сохранены',
                    type: 'success'
                });
            }


            // else {
            //     firebase.firestore().collection('users').doc(this.$store.state.uidUser).collection('primeCosts').doc(this.costId).set({
            //         name: this.namePrimeCost,
            //         resourses: this.resourses,
            //         total: this.totalCost
            //     });
            // }
        }
    },
    mounted() {
        this.countTotalCost();
    },
    created() {
        if (this.costId == false) {
            this.$router.replace('home');
        }
    }
}
</script>




