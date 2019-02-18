import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import {swal, Noty} from '@/config/notifications'
import {firebase, VueFire, db} from '@/config/firebase.js'
import trello from '@/config/trello.js'
import store from '@/store/index.js'
import "@/styles/main.css";


Vue.config.devtools = true;

Vue.config.productionTip = true;
Vue.use(VueFire, Vuex)



let app = '';

firebase.auth().onAuthStateChanged(() => {
	if (!app) {
		app = new Vue({
			el: '#app',
			router,
			components: { App },
			template: '<App/>',
			store,
		});
	}
})


export {
	db,
	swal,
	trello,
	Noty,
};

/* eslint-disable no-new */



