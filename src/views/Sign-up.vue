<template>
        <main class="page auth">
            <div class="auth__content">
                <p class="auth__title">Регистрация</p>
                <p class="auth__subtitle">Зарегистрируйте аккаунт для сохранения чеков, рассчетов, списков покупок</p>
                <form class="auth__form" @submit.prevent="signUp">
                    <div class="auth__input-block">
                        <input type="email" v-model="email" placeholder="Email">
                    </div>
                    <div class="auth__input-block">
                        <input :class="{ error: !passwordIsEqual }" :type="typeTextPass ? 'text' : 'password'" @keyup="checkPassword()" v-model="password" placeholder="Пароль">
                        <div class="auth__eye">
                            <span>иконка глаза и не глаза</span>
                            <!-- <font-awesome-icon class="form-icon" @click="typeTextPass = !typeTextPass" :icon="typeTextPass ? 'eye-slash' : 'eye'"/> -->
                        </div>
                    </div>
                    <div class="auth__input-block">
                        <input :class="{ error: !passwordIsEqual }" :type="typeTextRepeatPass ? 'text' : 'password'" @keyup="checkPassword()" v-model="repeatPassword" placeholder="Повторите пароль">
                        <div class="auth__eye">
                            <span>иконка глаза и не глаза</span>
                            <!-- <font-awesome-icon class="form-icon" @click="typeTextRepeatPass = !typeTextRepeatPass" :icon="typeTextRepeatPass ? 'eye-slash' : 'eye'"/> -->
                        </div>

                    </div>
                    <p v-if="!passwordIsEqual" class="password-equal error">Пароли не совпадают</p>

                    <button class="auth__button btn-primary">Зарегистрироваться</button>
                    <div class="auth__links">
                        <div class="auth__link">Есть аккаунт?
                            <router-link to="/Login">Войти</router-link>
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
import {db, swal} from '../main';

export default {
    name: 'signUp',
    data() {
        return {
            email: '',
            password: '',
            repeatPassword: '',
            typeTextRepeatPass: false,
            typeTextPass: false,
            passwordIsEqual: true
        };
    },
    methods: {

        checkPassword: function() {
            if (this.password != this.repeatPassword) {
                this.passwordIsEqual = false;
            }else {
                this.passwordIsEqual = true;
            }
        },
        signUp: function() {
            var that = this;

            if (that.passwordIsEqual == true) {

                firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
                    function(answer){
                        db.collection('users').doc(answer.user.uid).set({
                            createdProfile: new Date(),
                            email: that.email,
                        });
                        swal('Аккаунт создан!', 'Открываю дверь, стелю дорожку', 'success')
                        // console.log(answer.user.uid);
                        that.$router.replace('/Home')
                    },
                    function(err) {
                        console.log(err)
                        switch(err.code) {
                            case 'auth/invalid-email':
                                swal('', 'Неверный формат email', 'error')
                                break;
                            case 'auth/weak-password':
                                swal('', 'Пароль должен быть не менее 6 символов', 'error')
                                break;
                            case 'auth/email-already-in-use':
                                swal('', 'Этот email уже используется', 'error')
                                break;
                        }
                    }
                )
            }
            else {
                swal('Не могу зарегистрировать', 'не совпадают пароли', 'error')
            }
        }
    }
}
</script>


