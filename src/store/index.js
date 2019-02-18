import Vue from 'vue';
import Vuex from 'vuex';
import {firebase, VueFire} from '../config/firebase'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		count: 0,
		primeCostsArray: [],
		averageChecks: [],
		currentCheck: {},
		currentPrimeCost: {},
		user: firebase.auth().currentUser
	},
	getters: {
		makeId: state => symbols => {
			var text = "";
			var possible = "Aasd1231kj2nelaksdo3121321k1elaksnbfaoiuenriu23n4elkqeBCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < symbols; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;
		}
	},
	mutations: {
		getPrimeCostsList(state, listPrimeCostList) {
			state.primeCostsArray = listPrimeCostList;
		},
		getAverageChecks(state, averageChecks) {
			state.averageChecks = averageChecks;
		},
		uidUser(state, uid) {
			state.uidUser = uid;
		},
		currentCheck(state, array) {
			state.currentCheck = array;
			console.log(state.currentCheck);
		},
		currentPrimeCost(state, array) {
			state.currentPrimeCost = array;
		},
		currentBuyList(state, array) {
			state.currentBuyList = array;
		},
		routeTo(state, pash) {
			this.$router.replace(path);
		}

	}
})

export default store;