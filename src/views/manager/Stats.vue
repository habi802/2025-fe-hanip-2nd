<script setup>
import '@/assets/manager/manager.css'

import { reactive, computed, watch } from 'vue';
import ChartCard from '@/components/manager/ChartCard.vue';
import VueDatePicker from '@vuepic/vue-datepicker';

const state = reactive({
    form: {
        periodType: 'year',
        period: '',
    }
});

// 기간 선택 시 날짜 선택하는 부분이 기간에 맞춰 선택할 수 있게 바뀜
const datePickerType = computed(() => {
    switch (state.form.periodType) {
        case 'year':
            return 'year';
        case 'month':
            return 'month';
        case 'week':
            return 'week';
        default:
            return 'date';
    }
});
const datePickerFormat = computed(() => {
    switch (state.form.periodType) {
        case 'year':
            return 'YYYY';
        case 'month':
            return 'YYYY-MM';
        case 'week':
            return 'YYYY-[W]WW';
        default:
            return 'YYYY-MM-DD';
    }
});

// 기간 선택 시 날짜 초기화
watch(() => state.form.periodType, () => {
    state.form.period = ''
})

// 통계 조회
const getStats = () => {

};
</script>

<template>
    <b-container>
        <h5 class="mb-3">통계 현황</h5>
        <b-row class="align-items-center">
            <b-col cols="12">
                <b-row class="align-items-center">
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="isActive" class="form-label">기간</label>
                        <b-form-select id="isActive" v-model="state.form.periodType">
                            <option value="year">연간</option>
                            <option value="month">월간</option>
                            <option value="week">주간</option>
                            <option value="day">일간</option>
                        </b-form-select>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="" class="form-label">날짜</label>
                        <b-row class="align-items-center">
                            <b-col>
                                <VueDatePicker :enable-time-picker="false" ::type="datePickerType" :format="datePickerFormat" v-model="state.form.period" locale="ko" />
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label class="form-label d-block invisible">버튼</label>
                        <b-row>
                            <b-col>
                                <button class="btn btn-primary w-50" @click="getStats">조회</button>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>

            <b-col cols="12">
                <b-row>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card">
                            <ChartCard title="가입자 수" :chart-data="[111, 112, 113]" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card">
                            <ChartCard title="가게 등록 수" :chart-data="[111, 112, 113]" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card">
                            <ChartCard title="주문 건 수" :chart-data="[111, 112, 113]" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card">
                            <ChartCard title="매출액" :chart-data="[111, 112, 113]" />
                        </div>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<style scoped>

</style>