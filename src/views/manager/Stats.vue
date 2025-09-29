<script setup>
import '@/assets/manager/manager.css'

import { reactive, ref, computed } from 'vue';
import { getUserStats, getStoreStats, getOrderStats, getAmountStats } from '@/services/managerService';
import StatsChartCard from '@/components/manager/StatsChartCard.vue';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import AlertModal from '@/components/modal/AlertModal.vue';

const state = reactive({
    form: {
        type: 'year',
        date: null,
    },
    stats: {
        user: [],
        store: [],
        order: [],
        amount: []
    }
});

// 기간 선택 시 날짜 선택 시 그 기간에 맞춰 입력됨(연간이면 2025, 월간이면 2025-09 이런 식으로)
const datePickerMode = computed(() => {
    switch (state.form.type) {
        case 'year':
            return 'year';
        case 'month':
            return 'month';
        case 'week':
            return 'single';
        default:
            return 'day';
    }
});

// 날짜 input에 표시할 포맷
const formattedDate = computed(() => {
    if (!state.form.date) {
        return '';
    }

    const d = new Date(state.form.date);
    switch (state.form.type) {
        case 'year':
            return d.getFullYear();
        case 'month':
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        case 'week':
            const onejan = new Date(d.getFullYear(), 0, 1);
            const week = Math.ceil((((d - onejan) / 86400000 + onejan.getDay() + 1) / 7));
            return `${d.getFullYear()}-W${week}`;
        case 'day':
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }
});

// 주간 선택에서 선택한 주를 강조하는 함수
const calendarAttributes = computed(() => {
    if (state.form.type !== 'week' || !state.form.date) {
        return [];
    }

    const d = new Date(state.form.date);
    const dayOfWeek = (d.getDay() + 6) % 7;

    const startOfWeek = new Date(d);
    startOfWeek.setDate(d.getDate() - dayOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return [{
        key: 'selected-week',
        highlight: true,
        dates: { start: startOfWeek, end: endOfWeek },
        dot: false,
        style: { backgroundColor: '#CCE5ff' }
    }];
});

const loadingModalRef = ref(null);

// 통계 조회
const getStats = async () => {
    console.log(state.form);
    loadingModalRef.value.open();

    const userStatsRes = await getUserStats(state.form);
    if (userStatsRes !== undefined || userStatsRes.status === 200) {
        state.stats.user = userStatsRes.data.resultData;
    }

    const storeStatsRes = await getStoreStats(state.form);
    if (storeStatsRes !== undefined || storeStatsRes.status === 200) {
        state.stats.store = storeStatsRes.data.resultData;
    }

    const orderStatsRes = await getOrderStats(state.form);
    if (orderStatsRes !== undefined || orderStatsRes.status === 200) {
        state.stats.order = orderStatsRes.data.resultData;
    }

    const amountStatsRes = await getAmountStats(state.form);
    if (amountStatsRes !== undefined || amountStatsRes.status === 200) {
        state.stats.amount = amountStatsRes.data.resultData;
    }

    console.log(state.stats);

    loadingModalRef.value.hide();
};

// 차트에 들어갈 값 전달을 위해 임의로 만든 객체
const chartData1 = {
    label: ['2025년 6월', '2025년 7월', '2025년 8월'],
    data: [132, 176, 200],
};
const chartData2 = {
    label: ['2025년 6월', '2025년 7월', '2025년 8월'],
    data: [178, 302, 264],
};
const chartData3 = {
    label: ['2025년 6월', '2025년 7월', '2025년 8월'],
    data: [274, 355, 361],
};
const chartData4 = {
    label: ['2025년 6월', '2025년 7월', '2025년 8월'],
    data: [412, 543, 645],
};
</script>

<template>
    <b-container>
        <h5 class="mb-3">통계 현황</h5>
        <b-row class="align-items-center">
            <b-col cols="12" class="mb-2">
                <b-row class="align-items-center">
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="isActive" class="form-label">기간</label>
                        <b-form-select id="isActive" v-model="state.form.type">
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
                                <VDatePicker v-model="state.form.date" :mode="datePickerMode" :attributes="calendarAttributes">
                                    <template #default="{ togglePopover }">
                                        <input type="text" readonly :value="formattedDate" @click="togglePopover" class="px-3 py-2 border rounded-md w-40" />
                                    </template>
                                </VDatePicker>
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
                        <div class="card p-2">
                            <h5>가입자 수</h5>
                            <StatsChartCard title="가입자 수" :chart-data="chartData1" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card p-2">
                            <h5>가게 등록 수</h5>
                            <StatsChartCard title="가게 등록 수" :chart-data="chartData2" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card p-2">
                            <h5>주문 건 수</h5>
                            <StatsChartCard title="주문 건 수" :chart-data="chartData3" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card p-2">
                            <h5>매출액</h5>
                            <StatsChartCard title="매출액" :chart-data="chartData4" />
                        </div>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>

    <LoadingModal ref="loadingModalRef" />
    <AlertModal ref="alertModalRef" />
</template>

<style scoped>

</style>