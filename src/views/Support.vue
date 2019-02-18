<template>
    <main class="page support">
        <div class="page__container container content">
            <div class="page__return" @click="routeTo('home')">Вернуться на главную</div>

            <div class="page__title">Техническая поддержка</div>
            <div class="page__content support-content">
                <p class="support-content__title">Контакты для обращения:</p>
                <ul class="support-content__list">
                    <li>Почта
                        <a target="_blank" href="mailto:ddan.postnov@yandex.ru">ddan.postnov@yandex.ru</a>
                    </li>
                    <li>Вконтакте:
                        <a target="_blank" href="https://vk.com/postnov_daniil">https://vk.com/postnov_daniil</a>
                    </li>
                    <li>Номер телефона (с 9 до 21).
                        <a target="_blank" href="tel:89530850203">8 (953) 085-02-03</a>
                    </li>
                    <li>Инстаграм (
                        <a target="_blank" href="https://www.instagram.com/devpostnov">@devpostnov</a>)</li>
                </ul>



                <div class="support-form">
                    <p class="support-content__title">Отправьте вопрос или жалобу через форму:</p>
                    <div class="support-form__flex">
                        <input class="support-form__input" placeholder="Заголовок" v-model="title">
                        <textarea class="support-form__textarea" v-model="text" placeholder="Подробнее о проблеме"></textarea>
                        <div class="support-form__labels">
                            <label class="support-form__label"  >
                                <input type="radio" name="type" checked v-model="type" value="Проблема">
                                <span>Проблема</span>
                            </label>
                            <label class="support-form__label">
                                <input type="radio" name="type" v-model="type" value="Идея">
                                <span >Идея</span>
                            </label>
                        </div>
                    </div>
                    <button class="support-form__btn btn-primary" @click="addIssue()">Добавить заявку</button>
                    <div class="content">
                        <p class="support-form__tip">Когда вопрос будет решен, пришлем письмо на email, указанный при регистрации. Статус вашей заявки вы можете увидеть вверху списка. </p>
                    </div>
                </div>
                <div v-if="issueList.length > 0" class="support-issue">
                    <h2>Все заявки</h2>
                    <div class="support-issue__list">
                        <div class="support-issue__item issue" :class="{'done': issue.label == 10}" v-for="(issue, idx) in issueList" :key="issue.id">
                            <p class="issue__title">{{ issue.title }}</p>
                            <p class="issue__date">{{ issue.date }}</p>
                            <div class="issue__labels">
                                <span class="issue__tag">#{{ issue.tag }}</span>

                                 <div v-if="issue.label == 0" class="issue__label issue__label--success">Новая</div>
                                 <div v-if="issue.label == 4" class="issue__label issue__label--success">Добавлено</div>
                                <div v-if="issue.label == 10" class="issue__label issue__label--success">Решено</div>
                                <div v-if="issue.label == 2" class="issue__label issue__label--work">В работе</div>
                                <div v-if="issue.label == 3" class="issue__label issue__label--later">Отложена</div>
                            </div>
                            <p class="issue__text">{{ issue.text }}</p>



                            <div v-if="userEmail == 'dan.postnov@gmail.com'" >
                                <div class="issue__footer">
                                    <div class="issue__buttons">
                                        <button class="issue__label issue__label--success" @click="setStatusIssue(4, issue.id, idx)">Добавлено</button>
                                        <button class="issue__label issue__label--success" @click="setStatusIssue(10, issue.id, idx)">Решено</button>
                                        <button class="issue__label issue__label--work" @click="setStatusIssue(2, issue.id, idx)">
                                            В работе
                                        </button>
                                        <button class="issue__label issue__label--later" @click="setStatusIssue(3, issue.id, idx)">Отложена</button>
                                    </div>
                                    <p class="issue__email">{{ issue.email }}</p>
                                </div>
                                <button class="issue__delete" @click="delIssue(issue.id)">Удалить</button>
                            </div>
                        </div>
                    </div>
                </div>




            </div>
        </div>
    </main>
</template>


<script>
import firebase,{ storage } from 'firebase';
import {db, swal, trello} from '../main';

export default {
    name: 'Support',
    data() {
        return {
            title: '',
            text: '',
            type: '',
            user: firebase.auth().currentUser,
            userEmail: firebase.auth().currentUser.email,
            issueList: []
        }
    },
    firestore() {
		return {
			issueList: db.collection('issue').orderBy('label','asc')
		}
    },
    methods: {
        // moveIssue(array, oldIndex, newIndex) {
        //     if (newIndex >= array.length) {
        //         newIndex = array.length - 1;
        //     }
        //     array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
        //     return array;
        // },
        setStatusIssue(number, id, idx) {
            db.collection('issue').doc(id).set({
                label: number,
            }, {merge: true});

        },
        delIssue(id) {
            db.collection('issue').doc(id).delete();
        },
        setType(value) {
            this.type = value;
        },
        addIssue: function() {
            var that = this;
            var trelloLabel = this.type;

            if (this.title == '') swal('Упс', 'Вы не ввели заголовок', 'error');
            if (this.text == '') swal('Упс', 'Вы не ввели текст заявки', 'error');
            if (this.type == '') swal('Упс', 'Вы не выбрали тип заявки', 'error');


            if (this.title != '' && this.text != '') {

                var date = new Date();
                var id = '_#' + Math.random().toString(36).substr(2, 9);

                var options = {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                };

                var formatDate =  date.toLocaleString("ru", options);

                db.collection('issue').doc('issue' + id).set({
                        title: this.title,
                        tag: this.type,
                        text: this.text,
                        label: 0,
                        email: that.user.email,
                        id: id,
                        date: formatDate
                    }, {merge: true});



                // console.log(trelloLabel)

                trello.addCard(this.title, this.text, '5c457505bc54920fbff5bbe5',
                    function (error, trelloCard) {
                        if (error) {
                            console.log('Could not add card:', error);
                        }
                        else {
                            console.log('Added card:', trelloCard);
                            var color = (trelloLabel == 'Проблема') ? 'red' : 'blue';


                            var data = null;
                            var xhr = new XMLHttpRequest();

                            xhr.addEventListener("readystatechange", function () {
                            if (this.readyState === this.DONE) {
                                console.log(this.responseText);
                            }
                            });

                            xhr.open("POST", "https://api.trello.com/1/cards/"+trelloCard.id+"/labels?color="+color+"&name="+trelloLabel+"&key=6a32ea848fdd8c41dd0c851b62baa68a&token=fa74591f871b8effd26f8aa8309f2a0135e3610bd9261a8d89526e5ec61ed616");

                            xhr.send(data);
                        }
                });

                this.type = '';
                this.title = '';
                this.text = '';
            }


        },
		routeTo: function(path) {
			this.$router.replace(path);
		},
    }
}
</script>


<style type="text/scss">
  .issue.done {
      opacity: 0.4;
  }

  .support-form__tip {
      margin-top: 10px;
  }
</style>



