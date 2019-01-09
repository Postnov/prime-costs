<template>
    <div class="login">
        <h3>Вход</h3>
        <form action="">
            <div class="form-label">
                <input v-model="email" type="email" placeholder="Email">
            </div>
            <div class="form-label">
                <input :type="textPass ? 'text' : 'password'" v-model="password" placeholder="Пароль">
                <font-awesome-icon class="form-icon" @click="textPass = !textPass" :icon="textPass ? 'eye-slash' : 'eye'"/>
            </div>
            <button class="form-button" v-on:click="login" >Войти</button>
        </form>
        <h3>Войти через соц.сети:</h3>
        <button @click="socialSign" class="button-google">
            <img src="https://bit.ly/2RxfbDB" alt="">
        </button>
        <p>У вас не аккаунта? <router-link to="/Sign-up">Создать аккаунт</router-link></p>
        <p>Забыли пароль? <router-link to="/Reset-password">Восстановить пароль</router-link></p>
    </div>
</template>


<script>
import firebase from 'firebase';

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
                    alert('Вы вошли в приложение!');
                    that.$router.replace('/Home');
                },
                function(err){
                    alert('Упс:' + err.message)
                }
            )
        },
        socialSign: function() {
            const provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider).then((result) => {
                this.$router.replace('home');

                var userUid = result.user.uid,
                    cityRef = firebase.firestore().collection('users').doc(userUid),
                    that = this;

                cityRef.get()
                    .then(doc => {
                        console.log(doc);

                        if (!doc.exists) {
                            console.log("Такого документа нет!");
                            firebase.firestore().collection('users').doc(userUid).set({
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


<style scoped>
    .login {
        margin-top: 40px;
        text-align: center;
    }

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
