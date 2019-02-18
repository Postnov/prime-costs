<template>
    <div>
        <div class="prime-cost__item cost-material">
            <label class="cost-material__label cost-material__label--name">
                <span>Название</span>
                <input
                    ref="name"
                    autofocus
                    class="cost-material__name"
                    v-model="item.name"
                    @keyup="enterQuery(item)">

                <div class="tip-list" v-if="item.showTip">
                    <div
                        v-for="res in filteredList"
                        :key="res.id"
                        @click="resEnter(res, item)">

                        <span class="tip-list__title">{{res.name}}</span>
                        <span class="tip-list__from">{{res.namePrimeCost}}</span>
                    </div>
                </div>
            </label>
            <label class="cost-material__label">
                <span>Стоимость за упаковку/бутылку</span>
                <input
                    class="cost-material__cost"
                    type="tel"
                    v-on:keyup="countResCost(item); countTotalCost(); changeComma(item,'cost')"
                    v-model="item.cost" >
            </label>
            <label class="cost-material__label">
                <span>Кол-во/Объем</span>
                <input
                    class="cost-material__value"
                    type="tel"
                    v-on:keyup="countResCost(item); countTotalCost(); changeComma(item,'value')"
                    v-model="item.value"
                    placeholder="мл/шт">
            </label>
            <label class="cost-material__label">
                <span>Расход на клиента</span>
                <input
                    class="cost-material__per-client"
                    type="tel"
                    v-on:keyup.exact="countResCost(item); countTotalCost(); changeComma(item,'valuePerClient')"
                    v-on:keyup.enter="addRes()"
                    v-model="item.valuePerClient"
                    placeholder="мл/шт">
            </label>
            <div class="cost-material__total-row">
                <div class="cost-material__total"> Итого - {{ item.costPerClient || 0 }} <span>₽</span> </div>
            </div>

            <div class="cost-material__delete" @click="deleteRes(idx)"><span>удалить</span></div>
        </div>

    </div>

</template>



<script>
        // При keyup отправлять на сохранение в базу
        // при удалении отправлять в базу
        // при вводе названия проверять на совместимость с подсказками
        // при создании загрузить все материалы

export default {
    name: 'material',
    data() {
        return {

        }
    },
    methods: {

    },
    computed: {

    },
}
</script>
