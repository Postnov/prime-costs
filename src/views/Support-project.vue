<template>
    <main>

        <div class="page support">

            <div class="page__container container">
                <div class="page__return" @click="routeTo('home')">Вернуться на главную</div>

                <div class="page__title">Поддержать проект</div>
                <div class="page__content support-content">
                    <p class="support-content__title">Морально:
                        <ul class="support-content__list">
                            <li>Добавиться в друзья и сказать спасибо:
                                <a target="_blank" href="https://vk.com/postnov_daniil">https://vk.com/postnov_daniil</a>
                            </li>
                            <li>Порекомендовать друзьям как разработчика.
                                <a target="_blank" href="https://dev-postnov.ru">https://dev-postnov.ru</a>
                            </li>
                            <li>Подписаться в instagram (
                                <a target="_blank" href="https://www.instagram.com/devpostnov">@devpostnov</a>)</li>
                        </ul>
                    </p>
                    <p class="support-content__title">Материально:
                        <ul class="support-content__list">
                            <li>Яндекс Деньги - 410014067988268</li>
                            <li>Тинькофф - 5536 9137 6097 0190</li>
                            <li>Сбербанк - 4276 3000 3684 7872</li>
                            <li>Webmoney - R319304074907</li>
                            <li>Paypal -
                                <a target="_blank" href="https://www.paypal.me/postnovdaniil">https://www.paypal.me/postnovdaniil</a>
                            </li>
                            <li>QIWI - по номеру телефона 89530850203</li>
                        </ul>
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>


<script>
import firebase,{ storage } from 'firebase';
import {db} from '../main';

export default {
    name: 'Support-project',
    methods: {
		routeTo: function(path) {
			this.$router.replace(path);
		},
    }
}
</script>

