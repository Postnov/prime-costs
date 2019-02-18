
<template>
        <main class="page auth">
            <div class="auth__content">
                <p class="auth__title">Вход</p>
                <form class="auth__form" @submit.prevent="login">
                    <div class="auth__input-block">
                        <input v-model="email" type="email" placeholder="Email">
                    </div>
                    <div class="auth__input-block">
                        <input placeholder="Пароль" :type="textPass ? 'text' : 'password'" v-model="password" >
                        <div class="auth__eye">
                            <span>иконка глаза и не глаза</span>
                            <!-- <font-awesome-icon class="form-icon" @click="textPass = !textPass" :icon="textPass ? 'eye-slash' : 'eye'"/> -->
                        </div>
                    </div>
                    <button class="auth__button btn-primary">Войти</button>
                    <div class="auth__social">
                        <div class="auth__social-item google-social" @click="socialSign">
                            <img src="../assets/google-plus.png" alt="google logo">
                        </div>
                    </div>
                    <div class="auth__links">
                        <div class="auth__link">Нет аккаунта?
                            <router-link to="/Sign-up">Зарегистрироваться</router-link>
                        </div>
                        <div class="auth__link">Забыли пароль?
                            <router-link to="/Reset-password">Восстановить</router-link>
                        </div>
                    </div>
                </form>
            </div>
        </main>
</template>


<script>
import firebase from 'firebase';
import {db} from '../main';

export default {
    name: 'login',
    data() {
        return {
            email: '',
            password: '',
            textPass: false
        };
    },
    methods: {
        login: function() {
            var that = this;

            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
                function(answer){
                    swal('Успешный вход', 'Открываю дверь, стелю дорожку', 'success')
                    that.$router.replace('/Home');
                },
                function(err){
                    console.log(err)
                    switch(err.code) {
                        case 'auth/email-already-exists':
                            swal('', 'Пользователь с таким email уже существует', 'error')
                            break;
                        case 'auth/user-not-found':
                            swal('', 'Пользователь не найден', 'error')
                            break;
                        case 'auth/invalid-email-verified':
                            swal('', 'Неверный email', 'error')
                            break;
                        case 'auth/invalid-email':
                            swal('', 'Неверный формат email', 'error')
                            break;
                        case 'auth/wrong-password':
                            swal('', 'Пароль неверный или отсутствует', 'error');
                            break;
                    }
                }
            )
        },
        socialSign: function() {
            const provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider).then((result) => {
                this.$router.replace('home');

                var userUid = result.user.uid,
                    cityRef = db.collection('users').doc(userUid),
                    that = this;

                cityRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            console.log("Такого документа нет!");
                            db.collection('users').doc(userUid).set({
                                createdProfile: new Date(),
                                email: result.user.email,
                                averageChecks: [],
                                primeCosts: []
                            });
                            console.log("Документ создан!");
                        } else {
                            console.log('Данные документа:', doc.data());
                        }
                    })
                    .catch(err => {
                        console.log('Ошибка получения документа', err);
                    });

            }).catch( (err) => {
                alert('Ошибка: ' + err.message)
            })
        }
    }
}
</script>

