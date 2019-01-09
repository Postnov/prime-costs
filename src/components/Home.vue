<template>
	<div class="home">
		<button class="logout" @click="logout">Выйти</button><br><br>



		<div class="section">
			<div class="section__header">
				<div class="section__title">Расчеты</div>
				<div class="section__header-line"></div>
			</div>

			<div class="section__list">
				<article class="section__block block" v-for="(item, index) in primeCostList" :key="index + '-primeCost'">
					<div class="block__name">{{ item.name }}</div>
					<div class="block__total">{{ item.total }}</div>
					<div class="block__buttons">
						<font-awesome-icon @click="primeCost(item.id)" icon="pen" />
						<font-awesome-icon @click="deleteCost(item.id)" icon="times" />
					</div>
				</article>

				<button @click="primeCost()" class="section__block block block--add">
				<font-awesome-icon class="block__plus" icon="plus" />
				<span class="block__add-word">Добавить расчет</span>
				</button>

			</div>


		</div>


		<div class="checks">
			<div class="section__header">
				<div class="section__title">Чеки</div>
				<div class="section__header-line"></div>
			</div>
		</div>

		<div class="section__list">
			<article class="section__block block" v-for="(item, idx) in averageChecks" :key="idx">
				<div class="block__name">{{ item.name }}</div>
				<div class="block__total">{{ item.average }}</div>

				<div class="block__buttons">
					<font-awesome-icon @click="averageCheck(item.id)" icon="pen" />
					<font-awesome-icon @click="deleteCheck(item.id)" icon="times" />
				</div>
			</article>

			<button @click="averageCheck()" class="section__block block block--add">
				<font-awesome-icon class="block__plus" icon="plus" />
				<span class="block__add-word">Добавить чек</span>
			</button>
		</div>


	</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body {
	position: relative;
}

.block__add-word {
	display: block;
	margin-top: 20px;
}

.block__plus {
	width: 100%;
	font-size: 30px;
	color: #555;
}

.block__buttons {
	position: absolute;
	top: 5px;
	right: 10px;

	color: #555;
	font-size: 12px;
	cursor: pointer;
}

.close-btn {
	position: absolute;
	top: 0;
	right: 50px;
}

.section {
	margin-bottom: 30px;
}

.section__list {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	flex-wrap: wrap;
	padding: 30px 0;
}
.section__header {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
}
.section__title {
	margin-right: 10px;
	text-transform: uppercase;
}
.section__header-line {
	flex-grow: 1;
	width: 100%;
	height: 1px;
	background-color: #999;
}
.block {
	border: 1px solid #ccc;
	border-radius: 10px;
	padding: 40px;
	margin-right: 15px;
	position:relative;
	text-align: center;
}
.block__name {
	margin-bottom: 20px;
}
.logout {
	font-size: 14px;
	position: absolute;
	top: 0px;
	right: 50px;
	padding: 3px;
	cursor: pointer;
	color: rgb(245, 91, 91);
	border: none;
	border-bottom: 1px solid ;
}
h1, h2 {
	font-weight: normal;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>


<script>
import firebase,{ storage } from 'firebase';
import { db } from '../main'

export default {
	name: 'Home',
	data() {
		return {
			uid: firebase.auth().currentUser.uid,
			averageChecks: [],
			primeCostList: [],
		};
	},
	computed: {

	},
	firestore () {
		return {
			averageChecks: firebase.firestore().collection('users').doc(this.uid).collection('averageChecks'),
			primeCostList: firebase.firestore().collection('users').doc(this.uid).collection('primeCosts')
		}
	},
	methods: {
		primeCost: function(id) {
			this.$store.commit('uidUser', this.uid);

			// Проверяю, если есть переданное id - добавляю в глобальное хранилище объект с данными текущего чека, если нет - передаю пустой объект
			if (id !== undefined) {
				firebase.firestore().collection('users').doc(this.uid).collection('primeCosts').doc(id).get()
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
					costId: '_' + Math.random().toString(36).substr(2, 9)
				});
				this.$router.replace('/prime-cost');
			}

		},
		averageCheck: function(id) {
			// Передаю данные пользователя чтобы потом записывать данные по его uid
			this.$store.commit('uidUser', this.uid);


			// Проверяю, если есть переданное id - добавляю в глобальное хранилище объект с данными текущего чека, если нет - передаю пустой объект
			if (id !== undefined) {
				firebase.firestore().collection('users').doc(this.uid).collection('averageChecks').doc(id).get()
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
					idCheck: '_#' + Math.random().toString(36).substr(2, 9)
				});
				this.$router.replace('/average-check');
			}
		},
		deleteCost: function(id) {
			firebase.firestore().collection('users').doc(this.uid).collection('primeCosts').doc(id).delete();
		},
		deleteCheck: function(id) {
			firebase.firestore().collection('users').doc(this.uid).collection('averageChecks').doc(id).delete();
		},
		saveName: function() {
			firebase.firestore().collection('users').doc(this.uid).set({
				name: this.name
			}, {merge: true});
		},
		logout: function() {
			firebase.auth().signOut().then(() => {
				this.$router.replace('login');
			})
		}
	},

	created() {

		firebase.firestore().collection('users').doc(this.uid).get()
		.then( (querySnapshot) => {
			// this.name = querySnapshot.data().name;
		});
	}
};
</script>


