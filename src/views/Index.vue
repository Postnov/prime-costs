<template>
    <main class="page main">
        <div class="main__container container">
            <div class="main__left">
                <div class="main__title">Привет! Я помогу тебе
                    <div class="main__title-hidden">
                        <div class="scroll-block js-scroll-words">
                            <p>рассчитать себестоимость услуги</p>
                            <p>рассчитать средний чек</p>
                            <p>сохранить список покупок</p>
                        </div>
                    </div>
                </div>
                <div class="main__subtitle">Теперь не нужно искать тот листок, в котором был средний чек или себестоимость услуги. Храните все в одном месте! Все данные сохраняются в аккаунте.</div>
                <div class="main__buttons">
                    <router-link class="main__button btn-primary" to="/Login">Войти</router-link>
                    <router-link class="main__button btn-gray" to="/Sign-up">Зарегистрироваться</router-link>
                </div>
            </div>
            <div class="main__right">
                <img class="main__img" src="http://www.photohleb.ru/wp-content/uploads/2016/11/BO6A7152.jpg" alt="">
            </div>
        </div>
    </main>
</template>


<script>
import firebase,{ storage } from 'firebase';
import {db} from '../main';

export default {
    name: 'index',
}
</script>
