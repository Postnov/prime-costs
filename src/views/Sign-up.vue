<template>
    <div class="sign-up">
        <h3>Регистрация</h3>
        <form >
            <div class="form-label">
                <input type="email" v-model="email" placeholder="Ваш email">
            </div>
            <label for="" class="form-label">
                <input :class="{ error: !passwordIsEqual }" :type="typeTextPass ? 'text' : 'password'" @keyup="checkPassword()" v-model="password" placeholder="Пароль">
                <font-awesome-icon class="form-icon" @click="typeTextPass = !typeTextPass" :icon="typeTextPass ? 'eye-slash' : 'eye'"/>
            </label>

            <div class="form-label">
                <input :class="{ error: !passwordIsEqual }" :type="typeTextRepeatPass ? 'text' : 'password'" @keyup="checkPassword()" v-model="repeatPassword" placeholder="Повтор пароля">
                <font-awesome-icon class="form-icon" @click="typeTextRepeatPass = !typeTextRepeatPass" :icon="typeTextRepeatPass ? 'eye-slash' : 'eye'"/>
            </div>

            <p v-if="!passwordIsEqual" class="error">Пароли не совпадают</p>


            <button @click="signUp">Зарегистрироваться</button>

        </form>
        <p>Есть аккаунт? <router-link to="/Login">Войти</router-link>.</p>
    </div>
</template>


<script>
import firebase from 'firebase';

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

            if (that.passwordIsEqual == true)

                firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
                    function(answer){
                        firebase.firestore().collection('users').doc(answer.user.uid).set({
                            createdProfile: new Date(),
                            email: that.email,
                        });
                        alert("Аккаунт создан!!")
                        // console.log(answer.user.uid);
                        that.$router.replace('/Home')
                    },
                    function(err) {
                        alert('Упс:' + err.message)
                    }
                )
            else
                alert('Не могу зарегистрировать, не совпадают пароли')
        }
    }
}
</script>


<style scoped>

    input {
        padding: 15px;
        width: 100%;
        outline: none;
        font-size: inherit;
    }

    .error {
        color: #ce2828;
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

    button {
        font-size: inherit;
        border-radius: 3px;
        background-color: rgb(19, 151, 96);
        color: #fff;
        padding: 10px 25px;
        margin-top: 30px;
        cursor: pointer;
        border: none;
    }
</style>
