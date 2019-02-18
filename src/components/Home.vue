<template>
	<div class="dashboard">
		<header class="header">
			<div class="header__container container">
				<div class="header__left">
					<div class="nav-mobile-icon fa fa-bars"></div>
					<div class="nav-mobile-icon fa fa-times"></div>
					<nav class="header__nav nav" style="display: block;">
						<ul class="nav__list">
							<!-- <li class="nav__item">
								<a class="nav__link" href="">Главная</a>
							</li> -->
							<li class="nav__item">
								<a class="nav__link" href="#" @click="routeTo('support')">Тех.поддержка</a>
							</li>
						</ul>
					</nav>
				</div>
				<div class="header__right">
					<div class="header__help" @click="routeTo('support-project')">
						<span class="header__buttons-text" >Поддержать проект</span>
						<span>иконка рубля</span>
					</div>
					<div class="header__entry header-entry" @click="logout">
						<span class="header__buttons-text"> Выход</span>
						<span>иконка выхода</span>
					</div>
				</div>
			</div>
		</header>
		<div class="header-mobile">
			<div class="header-mobile__container container">
				<nav class="nav nav--mobile">
					<ul class="nav__list">
						<!-- <li class="nav__item">
							<a class="nav__link" href="">Главная</a>
						</li> -->
						<li class="nav__item">
							<a class="nav__link" href="#" @click="routeTo('support')">Поддержка</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>



 		<div class="page__container container">
            <div class="dashboard__section">
                <p class="dashboard__title">Расчеты себестоимости</p>
                <div class="dashboard__list">
                    <div class="dashboard__item dash-item" v-for="(item, index) in primeCostList" :key="index + '-primeCost'">
                        <div class="dash-item__content">
                            <p class="dash-item__name">{{ item.name }}</p>
							<!-- <p class="dash-item__date">авг 2018</p> -->
                            <div class="dash-item__params">
                                <!-- <p v-if="item.resourses.length > 0">Позиций - {{ item.resourses.length }}</p> -->
                            </div>
                            <p class="dash-item__value">
								{{ item.total }}
                                <span>₽</span>
                            </p>
                        </div>
                        <div class="dash-item__buttons">
                            <button class="dash-item__edit dash-item__button"  @click="primeCost(item.id)">Открыть</button>
                            <button class="dash-item__delete dash-item__button" @click="deleteCost(item.id)">Удалить</button>
							<button class="dash-item__edit dash-item__button" @click="cloneItem('primeCosts', item, index)">Клонировать</button>
                        </div>
                    </div>
                    <div class="dashboard__item dash-item dash-item--add" @click="primeCost()">
                        <div class="dash-item__plus">+</div>
                    </div>
                </div>
            </div>
            <div class="dashboard__section">
                <p class="dashboard__title">Средние чеки</p>
                <div class="dashboard__list">
                    <div class="dashboard__item dash-item" v-for="(item, idx) in averageChecks" :key="idx">
                        <div class="dash-item__content">
                            <p class="dash-item__name">{{ item.name }}</p>
							<!-- <p class="dash-item__date">авг 2018</p> -->
                           <div class="dash-item__params">
                                <p v-if="item.clients">Клиентов - {{item.clients}}</p>
                                <p v-if="item.money">Денег - {{item.money}}₽</p>
                            </div>
                            <p class="dash-item__value">{{ item.average }}
                                <span>₽</span>
                            </p>
                        </div>
                        <div class="dash-item__buttons">
                            <button class="dash-item__edit dash-item__button" @click="averageCheck(item.id)">Открыть</button>
                            <button class="dash-item__delete dash-item__button" @click="deleteCheck(item.id)">Удалить</button>
							<button class="dash-item__delete dash-item__button" @click="cloneItem('averageChecks', item)">Клонировать</button>
                        </div>
                    </div>

                    <div class="dashboard__item dash-item dash-item--add" @click="averageCheck()">
                        <div class="dash-item__plus" >+</div>
                    </div>
                </div>
            </div>


            <div class="dashboard__section">
                <p class="dashboard__title">Списки покупок</p>
                <div class="dashboard__list">
                    <div class="dashboard__item dash-item" v-for="(item, idx) in buyLists" :key="idx">
                        <div class="dash-item__content">
                            <p class="dash-item__name">{{ item.name }}</p>
                           <div class="dash-item__params">
                                <p v-if="item.list.length > 0">Позиций - {{item.list.length}}</p>
                            </div>
                        </div>
                        <div class="dash-item__buttons">
                            <button class="dash-item__edit dash-item__button" @click="buyList(item.id)">Открыть</button>
                            <button class="dash-item__delete dash-item__button" @click="deleteList(item.id)">Удалить</button>
						<button class="dash-item__delete dash-item__button" @click="cloneItem('buyLists', item)">Клонировать</button>

                        </div>
                    </div>

                    <div class="dashboard__item dash-item dash-item--add" @click="buyList()">
                        <div class="dash-item__plus" >+</div>
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
 @import "../styles/main.css";
</style>

<script>
import firebase,{ storage } from 'firebase';
import {db} from '../main'

export default {
	name: 'Home',
	data() {
		return {
			uid: firebase.auth().currentUser.uid,
			averageChecks: [],
			primeCostList: [],
			buyLists: [],
		};
	},
	computed: {

	},
	firestore () {
		return {
			averageChecks: db.collection('users').doc(this.uid).collection('averageChecks'),
			primeCostList: db.collection('users').doc(this.uid).collection('primeCosts'),
			buyLists: db.collection('users').doc(this.uid).collection('buyLists'),
		}
	},
	methods: {
		cloneItem(destination, item, idx) {
			var arr;

			if (destination && item) {

				if (destination == 'primeCosts') {

					arr = {
						name: `Клон ${item.name}`,
						resourses: item.resourses,
						total: item.total,
						costId: this.$store.getters.makeId(30)
					}
				}else if (destination == 'averageChecks') {
					arr = {
						name: `Клон ${item.name}`,
						money: item.money,
						clients: item.clients,
						average: item.average,
						idCheck: this.$store.getters.makeId(30)
					}
				}else if (destination == 'buyLists'){
					arr = {
						name: `Клон ${item.name}`,
						list: item.list,
						idList: this.$store.getters.makeId(30)
					}
				}else {
					return 'error clone element: ' + destination, item;
				}

				db.collection('users').doc(this.uid).collection(destination).add(arr)
			}
		},
  		routeTo: function(path) {
			this.$router.replace(path);
		},
		primeCost: function(id) {
			this.$store.commit('uidUser', this.uid);

			// Проверяю, если есть переданное id - добавляю в глобальное хранилище объект с данными текущего чека, если нет - передаю пустой объект
			if (id !== undefined) {
				db.collection('users').doc(this.uid).collection('primeCosts').doc(id).get()
				.then( (querySnapshot) => {
					this.$store.commit('currentPrimeCost', {
						name: querySnapshot.data().name,
						resourses: querySnapshot.data().resourses,
						total: querySnapshot.data().total,
						costId: id
					});
					this.$router.replace('/prime-cost');
				});
			}else {
				this.$store.commit('currentPrimeCost', {
					costId: this.$store.getters.makeId(30)
				});
				this.$router.replace('/prime-cost');
			}

		},
		averageCheck: function(id) {
			// Передаю данные пользователя чтобы потом записывать данные по его uid
			this.$store.commit('uidUser', this.uid);


			// Проверяю, если есть переданное id - добавляю в глобальное хранилище объект с данными текущего чека, если нет - передаю пустой объект
			if (id !== undefined) {
				db.collection('users').doc(this.uid).collection('averageChecks').doc(id).get()
				.then( (querySnapshot) => {
					this.$store.commit('currentCheck', {
						nameCheck: querySnapshot.data().name,
						money: querySnapshot.data().money,
						clients: querySnapshot.data().clients,
						average: querySnapshot.data().average,
						idCheck: id
					});
					this.$router.replace('/average-check');
				});
			}else {
				this.$store.commit('currentCheck', {
					idCheck: this.$store.getters.makeId(30)
				});
				this.$router.replace('/average-check');
			}
		},
		buyList: function(id) {
			// Передаю данные пользователя чтобы потом записывать данные по его uid
			this.$store.commit('uidUser', this.uid);


			// Проверяю, если есть переданное id - добавляю в глобальное хранилище объект с данными текущего чека, если нет - передаю пустой объект
			if (id !== undefined) {
				db.collection('users').doc(this.uid).collection('buyLists').doc(id).get()
				.then( (querySnapshot) => {
					this.$store.commit('currentBuyList', {
						name: querySnapshot.data().name,
						list: querySnapshot.data().list,
						idList: id
					});
					this.$router.replace('/buy-list');
				});
			}else {
				this.$store.commit('currentBuyList', {
					idList: this.$store.getters.makeId(30)
				});
				this.$router.replace('/buy-list');
			}
		},
		deleteList: function(id) {
			db.collection('users').doc(this.uid).collection('buyLists').doc(id).delete();
		},
		deleteCost: function(id) {
			db.collection('users').doc(this.uid).collection('primeCosts').doc(id).delete();
		},
		deleteCheck: function(id) {
			db.collection('users').doc(this.uid).collection('averageChecks').doc(id).delete();
		},
		saveName: function() {
			db.collection('users').doc(this.uid).set({
				name: this.name
			}, {merge: true});
		},
		logout: function() {
			firebase.auth().signOut().then(() => {
				this.$router.replace('index');
			})
		}
	},

	created() {
		// db.collection('users').doc(this.uid).get()
		// .then( (querySnapshot) => {
		// 	// console.log(querySnapshot.data());
		// });
	}
};
</script>


