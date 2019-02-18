<template>
    <main>
        <div class="page prime-cost">
            <div class="page__container container">
                <div class="page__return" @click="routeTo('home')">Назад и сохранить</div>
                <div class="check__field">
                    <div class="check__label">Название услуги</div>
                   <input type="text" v-model="namePrimeCost" placeholder='Маникюр Декабрь, Наращивание Февраль'>
                </div>
                <div class="prime-cost__total">
                    Итог:
                    <span>{{ totalCost }}</span> ₽
                </div>
                <div class="prime-cost__list">
                    <div class="prime-cost__item cost-material" v-for="(item, idx) in resourses" :key="idx">
                        <label v-if="item.name !== undefined" class="cost-material__label cost-material__label--name">
                            <span>Название</span>
                            <input ref="name" autofocus class="cost-material__name" v-model="item.name" @keyup="enterQuery(item)">
                            <div class="tip-list" v-if="item.showTip">
                                <div v-for="res in filteredList" :key="res.id" @click="resEnter(res, item)">
                                    <span class="tip-list__title">{{res.name}}</span>
                                    <span class="tip-list__from">{{res.namePrimeCost}}</span>

                                </div>
                            </div>
                        </label>
                        <label v-if="item.cost !== undefined" class="cost-material__label">
                            <span>Стоимость за упаковку/бутылку</span>
                            <input class="cost-material__cost" type="tel" v-on:keyup="countResCost(item); countTotalCost(); changeComma(item,'cost')"  v-model="item.cost" >
                        </label>
                        <label v-if="item.value !== undefined" class="cost-material__label">
                            <span>Кол-во/Объем</span>
                            <input class="cost-material__value" type="tel" v-on:keyup="countResCost(item); countTotalCost(); changeComma(item,'value')"  v-model="item.value" placeholder="мл/шт">
                        </label>
                        <label v-if="item.valuePerClient !== undefined" class="cost-material__label">
                            <span>Расход на клиента</span>
                            <input class="cost-material__per-client" type="tel" v-on:keyup.exact="countResCost(item); countTotalCost(); changeComma(item,'valuePerClient')" v-on:keyup.enter="addRes()"   v-model="item.valuePerClient" placeholder="мл/шт">
                        </label>
                        <div class="cost-material__total-row">
                            <div class="cost-material__total">
                                Итого - {{ item.costPerClient || 0 }}
                                <span>₽</span>
                            </div>
                        </div>

                        <div class="cost-material__delete" @click="deleteRes(idx)">
                            <span>удалить</span>
                        </div>
                    </div>

                </div>
                <div class="prime-cost__add-buttons">
                    <div class="prime-cost__add-material btn-primary" @click="addRes()">Добавить</div>
                </div>
                <div v-if="resourses.length > 3">
                    <div class="prime-cost__total">
                        Итог:
                        <span>{{ totalCost }}</span> ₽
                    </div>
                    <div class="page__return" @click="routeTo('home')">Назад и сохранить</div>
                </div>

            </div>
        </div>


    </main>



</template>





<script>
import firebase,{ storage } from 'firebase';
import {db, Noty} from '../main';

export default {
    name: 'primeCost',
    data() {
        return {
            resourses: this.$store.state.currentPrimeCost.resourses || [],
            namePrimeCost: this.$store.state.currentPrimeCost.name || '',
            totalCost: this.$store.state.currentPrimeCost.totalCost || 0,
            costId: this.$store.state.currentPrimeCost.costId || false,
            tipsRes: [],
            searchQuery: ''
        }
    },
	firestore () {
		return {
			tipsRes: db.collection('users').doc(this.$store.state.uidUser).collection('materials'),
		}
	},
    computed: {
        filteredList() {
            return this.tipsRes.filter(res => {
                return res.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            })
        }
    },
    methods: {
        enterQuery(item) {
            if (item.name != '') {
                 this.searchQuery = item.name;
                 item.showTip = true;
            }
        },
        resEnter(res, item) {
            for (var key in res) {
                item[key] = res[key]
            }

            this.searchQuery = '';
            item.showTip = false;
            this.updatePrimeCost();

            this.countTotalCost();
        },
        changeComma(item, property) {
            var str = item[property].replace(',', '.');
            item[property] = str;
        },
        routeTo(path) {
            if (this.resourses.length > 0 && this.namePrimeCost == '') {
                new Noty({
                    type: 'error',
                    text: 'Введите название расчета',
                }).show();
            }else if (this.resourses.length == 0 && this.namePrimeCost == '') {
                this.$router.replace(path);
                db.collection('users').doc(this.$store.state.uidUser).collection('primeCosts').doc(this.costId).delete();
            }else {
                this.$router.replace(path);
                this.updatePrimeCost();

                new Noty({
                    type: 'success',
                    text: 'Расчет сохранен',
                }).show();
            }
        },
        countResCost: function(item) {
            // для расчета материала
            if (item.cost != undefined && item.value != undefined && item.valuePerClient != undefined) {
                var calcResult = item.cost / item.value * item.valuePerClient;

                if (!isNaN(calcResult) && calcResult != Infinity)
                    item.costPerClient = calcResult.toFixed(1)
                else
                    item.costPerClient = 0;
            }

            // для суммы материала
            else {
                if (!isNaN(item.resSum) && item.resSum != Infinity )
                    item.costPerClient = item.resSum;
                else
                    item.costPerClient = 0;
            }

            this.updatePrimeCost(1000);
        },
        countTotalCost: function() {
            this.totalCost = 0;

            this.resourses.forEach((item, i) => {
                this.totalCost += +item.costPerClient;
            });

            this.totalCost = this.totalCost.toFixed(1)
        },
        addRes: function(id = false) {
            this.resourses.push({
                name: '',
                cost: '',
                value: '',
                valuePerClient: '',
                costPerClient: 0,
                id: this.$store.getters.makeId(30),
                showTip: false
            });

            this.clearResValue();
            this.countTotalCost();
            this.updatePrimeCost();

            // фокус на первом поле при создании
            // if (this.resourses.length > 2) {
            //     var names = this.$refs.name;

            //     setTimeout(function() {
            //         names[names.length - 1].focus();
            //     }, 50)
            // }

        },
        changeRes: function() {
            this.resEdit = !this.resEdit;
            this.countTotalCost();
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

            // db.collection('users').doc(this.$store.state.uidUser).collection('primeCosts').doc(this.costId).get()
            // .then( (querySnapshot) => {
            //     console.log(querySnapshot);
            // });

            if(time) {
                setTimeout(() => {
                    db.collection('users').doc(this.$store.state.uidUser).collection('primeCosts').doc(this.costId).set({
                        name: this.namePrimeCost,
                        resourses: this.resourses,
                        total: this.totalCost
                    }, {merge: true})
                }, time)
            }else {
                db.collection('users').doc(this.$store.state.uidUser).collection('primeCosts').doc(this.costId).set({
                    name: this.namePrimeCost,
                    resourses: this.resourses,
                    total: this.totalCost
                }, {merge: true})
            }

            var that = this;

            this.resourses.forEach((item, idx) => {
                item.namePrimeCost = this.namePrimeCost;
                db.collection('users').doc(this.$store.state.uidUser).collection('materials').doc(item.id).set( item , {merge: true});
            })


            // else {
            //     db.collection('users').doc(this.$store.state.uidUser).collection('primeCosts').doc(this.costId).set({
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




