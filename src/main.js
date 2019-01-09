// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import Notifications from 'vue-notification'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee, faTimes, faPlus, faEye, faEyeSlash, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee, faTimes, faPlus, faEye, faEyeSlash, faPen)

Vue.config.devtools = true;

let app = '';

// Vue.config.productionTip = false;
Vue.use(VueFire)
Vue.use(Vuex)
Vue.use(Notifications)


firebase.initializeApp({
  apiKey: "AIzaSyDl2dijlGNRmC9pmR3TbpuVc75noemFG3c",
  authDomain: "costperclient.firebaseapp.com",
  databaseURL: "https://costperclient.firebaseio.com",
  projectId: "costperclient",
});


const store = new Vuex.Store({
  state: {
    count: 0,
    primeCostsArray: [],
    averageChecks: [],
    currentCheck: {},
    currentPrimeCost: {}
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
    }

  }
})

Vue.component('font-awesome-icon', FontAwesomeIcon)

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>',
      store
    });


  }
})




const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);



export default db;

/* eslint-disable no-new */



