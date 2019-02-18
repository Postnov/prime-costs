<template>
    <main class="page">
        <div class="page__container">
            <div class="container">
                <div class="page__return" @click="routeTo('home')">Вернуться на главную</div>
                <div class="check__field">
                    <div class="check__label" >Название списка</div>
                    <input value="" v-model="nameList">
                    <p class="help">Сохраняется автоматически</p>
                </div>
            </div>



            <div class="buy-item-add container">
                <div class="buy-item-add__label">Добавить позицию</div>
                <input class="buy-item-add__input" type="text" @keypress.enter="addPosition()" v-model="positionName">
                <button class="buy-item-add__btn btn-primary" @click="addPosition()">Добавить</button>
            </div>

            <div class="container">
                <div class="buy-list">
                    <div class="buy-list__item container" :class="{'done': item.done}" v-for="item in list" :key="item.id">
                        <label class="buy-list__label">
                            <input class="buy-list__checkbox" type="checkbox" v-model="item.done" value="0">
                            <div class="buy-list__input-custom">
                                <span>иконка чекбокса</span>
                            </div>
                            <input v-if="item.edit" class="buy-list__input" value="Перчатки" v-model="item.name">
                            <span v-if="!item.edit" class="buy-list__name">{{item.name}}</span>
                        </label>
                        <span v-if="!item.edit" @click="item.edit = !item.edit; updateBuyList(500)" class="buy-list__icon">Иконка редактирования</span>
                        <span v-if="item.edit" @click="item.edit = !item.edit; updateBuyList(500)" class="buy-list__icon">Иконка сохранения</span>
                        <span class="buy-list__icon buy-list__delete" @click="deletePosition(item.id)">Иконка крестика</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="page__return" @click="routeTo('home')">Вернуться на главную</div>
        </div>
    </main>
</template>




<script>
import firebase,{ storage } from 'firebase';
import {db} from '../main';

export default {
    name: 'buyList',
    data() {
        return {
            positionName: '',
            list: this.$store.state.currentBuyList.list || [],
            nameList: this.$store.state.currentBuyList.name || '',
            idList: this.$store.state.currentBuyList.idList || false
        }
    },
    methods: {
        routeTo(path) {
            if (this.list.length > 0 && this.nameList == '') {
                new Noty({
                    type: 'error',
                    text: 'Введите название списка',
                }).show();
            }else if (this.list.length == 0 && this.nameList == '') {
                this.$router.replace(path);
                db.collection('users').doc(this.$store.state.uidUser).collection('buyLists').doc(this.idList).delete();
            }else {
                this.$router.replace(path);
                this.updateBuyList();
                new Noty({
                    type: 'success',
                    text: 'Список сохранен',
                }).show();
            }
        },
        addPosition: function() {
            this.list.push({
                name: this.positionName,
                edit: false,
                id: this.list.length,
                done: false
            })
            this.positionName = '';
            this.updateBuyList();
        },
        deletePosition: function(id) {
            this.list = this.list.filter((item, i) => item.id !== id);
            this.updateBuyList();
        },
        updateBuyList: function(time) {

            if(time) {
                setTimeout(() => {
                    db.collection('users').doc(this.$store.state.uidUser).collection('buyLists').doc(this.idList).set({
                        name: this.nameList,
                        list: this.list,
                    }, {merge: true})
                }, time)
            }else {
                db.collection('users').doc(this.$store.state.uidUser).collection('buyLists').doc(this.idList).set({
                    name: this.nameList,
                    list: this.list,
                }, {merge: true})
            }
        }
    },
    computed: {

    },

    mounted() {
    },
    created() {
        if (this.costId == false) {
            this.$router.replace('home');
        }
    }
}
</script>



