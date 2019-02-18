import firebase from 'firebase/app'
import 'firebase/firestore'
import VueFire from 'vuefire'



firebase.initializeApp({
    apiKey: "AIzaSyDl2dijlGNRmC9pmR3TbpuVc75noemFG3c",
	authDomain: "costperclient.firebaseapp.com",
	databaseURL: "https://costperclient.firebaseio.com",
	projectId: "costperclient",
});

firebase.auth().languageCode = 'ru';

const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);


export {firebase, VueFire, db};