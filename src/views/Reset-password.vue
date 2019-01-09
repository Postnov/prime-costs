<template>
    <div class="login">
        <h3>Восстановление пароля</h3>
        <form action="">
            <input v-model="email" type="email" placeholder="Email">
            <button class="form-button" v-on:click="reset" >Восстановить</button>
        </form>
        <p>У вас не аккаунта? <router-link to="/Sign-up">Создать аккаунт</router-link></p>
        <p>Вспомнили пароль <router-link to="/Login">Войти</router-link></p>
    </div>
</template>


<script>
import firebase from 'firebase';

export default {
    name: 'Reset-password',
    data() {
        return {
            email: '',
        };
    },
    methods: {
        reset: function() {
            firebase.auth().sendPasswordResetEmail(this.email).then(() => {
                alert('Письмо отправлено!')
            }).catch((err) => {
                alert('Ошибка отправки' + err.message)
            })
        }
    }
}
</script>


<style scoped>
    .login {
        margin-top: 40px;
        text-align: center;
    }

    input {
        margin: 10px;
        padding: 15px;
        width: 100%;
        outline: none;
        font-size: inherit;
    }

    form {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        width: 300px;
        margin: 0 auto;
        font-size: 16px;
    }

    .form-button {
        font-size: inherit;
        border-radius: 3px;
        background-color: rgb(19, 151, 96);
        color: #fff;
        padding: 10px 25px;
        margin-top: 30px;
        cursor: pointer;
    }

    .button-google {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
    }

    img {
        max-width: 100%;
    }
</style>
