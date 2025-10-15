<script setup>
import '@/assets/manager/manager.css'
import "flatpickr/dist/flatpickr.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";
import "flatpickr/dist/plugins/monthSelect/style.css";

import { reactive, ref, computed, onMounted, watch } from 'vue';
import { getUserStats, getStoreStats, getOrderStats, getAmountStats } from '@/services/managerService';
import FlatPickr from "vue-flatpickr-component";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import StatsChartCard from '@/components/manager/StatsChartCard.vue';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import AlertModal from '@/components/modal/AlertModal.vue';

const today = new Date();

const state = reactive({
    form: {
        type: 'YEAR',
        date: today.toISOString().slice(0, 4),
    },
    stats: {
        user: {
            label: ['2025-01-01', '2025-01-01', '2025-01-01'],
            data: [0, 0, 0]
        },
        store: {
            label: ['2025-01-01', '2025-01-01', '2025-01-01'],
            data: [0, 0, 0]
        },
        order: {
            label: ['2025-01-01', '2025-01-01', '2025-01-01'],
            data: [0, 0, 0]
        },
        amount: {
            label: ['2025-01-01', '2025-01-01', '2025-01-01'],
            data: [0, 0, 0]
        }
    }
});

// 기간 선택 시 날짜 선택 시 그 기간에 맞춰 입력됨(연간이면 2025, 월간이면 2025-09 이런 식으로)
const datePickerConfig = computed(() => {
    switch (state.form.type.toUpperCase()) {
        case 'YEAR':
            return {
                locale: Korean,
                plugins: [new monthSelectPlugin({ shorthand: true, dateFormat: 'Y', altFormat: 'Y년' })],
            };
        case 'MONTH':
            return {
                locale: Korean,
                plugins: [new monthSelectPlugin({ shorthand: true, dateFormat: 'Y-m', altFormat: 'Y년 m월' })]
            };
        case 'WEEK':
            return {
                locale: Korean,
                dateFormat: 'Y-m-d',
                onChange: selectDate => {
                    if (selectDate.length) {
                        const date = selectDate[0];
                        const day = date.getDay();
                        const diff = day === 0 ? 6 : day - 1;

                        const monday = new Date(date);
                        monday.setDate(date.getDate() - diff);
                        const sunday = new Date(monday);
                        sunday.setDate(monday.getDate() + 6);
                    }
                }
            };
        default:
            return {
                locale: Korean,
                dateFormat: 'Y-m-d'
            };
    }
});

const loadingModalRef = ref(null);

// 통계 조회
const getStats = async () => {
    loadingModalRef.value.open();

    const userStatsRes = await getUserStats(state.form);
    if (userStatsRes !== undefined || userStatsRes.status === 200) {
        userStatsRes.data.resultData?.forEach((data, idx) => {
            state.stats.user.label[idx] = data.period;
            state.stats.user.data[idx] = data.total;
        });
    }

    const storeStatsRes = await getStoreStats(state.form);
    if (storeStatsRes !== undefined || storeStatsRes.status === 200) {
        storeStatsRes.data.resultData?.forEach((data, idx) => {
            state.stats.store.label[idx] = data.period;
            state.stats.store.data[idx] = data.total;
        });
    }

    const orderStatsRes = await getOrderStats(state.form);
    if (orderStatsRes !== undefined || orderStatsRes.status === 200) {
        orderStatsRes.data.resultData?.forEach((data, idx) => {
            state.stats.order.label[idx] = data.period;
            state.stats.order.data[idx] = data.total;
        });
    }

    const amountStatsRes = await getAmountStats(state.form);
    if (amountStatsRes !== undefined || amountStatsRes.status === 200) {
        amountStatsRes.data.resultData?.forEach((data, idx) => {
            state.stats.amount.label[idx] = data.period;
            state.stats.amount.data[idx] = data.totalAmount;
        });
    }

    loadingModalRef.value.hide();
};

onMounted(() => {
    getStats();
});

watch(() => state.form.type, () => {
    switch (state.form.type.toUpperCase()) {
        case 'YEAR':
            state.form.date = today.toISOString().slice(0, 4);
            break;
        case 'MONTH':
            state.form.date = today.toISOString().slice(0, 7);
            break;
        case 'WEEK':
            state.form.date = today.toISOString().slice(0, 10);
            break;
        case 'DAY':
            state.form.date = today.toISOString().slice(0, 10);
            break;
    }
});
</script>

<template>
    <b-container>
        <h5 class="mb-3">통계 현황</h5>
        <b-row class="align-items-center">
            <b-col cols="12" class="mb-2">
                <b-row class="align-items-center">
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="type" class="form-label">기간</label>
                        <b-form-select id="type" v-model="state.form.type">
                            <option value="YEAR">연도별</option>
                            <option value="MONTH">월별</option>
                            <option value="WEEK">주별</option>
                            <option value="DAY">일별</option>
                        </b-form-select>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="date" class="form-label">날짜</label>
                        <FlatPickr id="date" class="form-control" v-model="state.form.date" :config="datePickerConfig" :key="state.form.type" />
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
                            <StatsChartCard title="가입자 수" :chart-data="state.stats.user" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card p-2">
                            <h5>가게 등록 수</h5>
                            <StatsChartCard title="가게 등록 수" :chart-data="state.stats.store" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card p-2">
                            <h5>주문 건 수</h5>
                            <StatsChartCard title="주문 건 수" :chart-data="state.stats.order" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card p-2">
                            <h5>매출액</h5>
                            <StatsChartCard title="매출액" :chart-data="state.stats.amount" />
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