<template>
    <main class="page auth">
        <div class="auth__content">
            <p class="auth__title">Восстановление пароля</p>
            <p class="auth__subtitle">Вышлем ссылку для восстановления на ваш email</p>
            <form class="auth__form" @submit.prevent="reset">
                <div class="auth__input-block">
                     <input v-model="email" type="email" placeholder="Email">
                </div>
                <div class="auth__button btn-primary">Восстановить</div>
                <div class="auth__links">
                    <div class="auth__link">Есть аккаунт?
                        <router-link to="/Sign-up">Войти</router-link>
                    </div>
                    <div class="auth__link">Нет аккаунта?
                        <router-link to="/Sign-up">Зарегистрироваться</router-link>
                    </div>
                </div>
            </form>
        </div>
    </main>
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
                swal('Отправил','Письмо поступит на указанный email', 'success')
        }).catch((err) => {
                switch(err.code) {
                    case 'auth/user-not-found':
                        swal('', 'Пользователь не найден', 'error')
                        break;
                    case 'auth/invalid-email-verified':
                        swal('', 'Неверный email', 'error')
                        break;
                    case 'auth/invalid-email':
                        swal('', 'Неверный формат email', 'error')
                        break;
                }
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
