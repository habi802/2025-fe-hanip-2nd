<script setup>
import '@/assets/manager/manager.css'

import StatsCard from '@/components/manager/StatsCard.vue';
import ChartCard from '@/components/manager/ChartCard.vue';
import DashboardCard from '@/components/manager/DashboardCard.vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { getTodayActorStats, getTodayActionStats } from '@/services/managerService';

const todayUsers = ref(0);
const todayStores = ref(0);
const todayOrders = ref(0);
const todayAmount = ref(0);

// 각종 통계 조회
const getStats = async () => {
    const actorRes = await getTodayActorStats();
    if (actorRes !== undefined && actorRes.status === 200) {
        todayUsers.value = actorRes.data.resultData[0];
        todayStores.value = actorRes.data.resultData[1];
    }

    const actionRes = await getTodayActionStats();
    if (actionRes !== undefined && actionRes.status === 200) {
        todayOrders.value = actionRes.data.resultData[0];
        todayAmount.value = actionRes.data.resultData[1];
    }
};

// 월별 차트 select 관련 변수
const chartOptions = ['월별 가입자 수', '월별 가게 등록 수', '월별 고객 문의 수'];
const selectedChartOption = ref(chartOptions[0]);

// 차트에 들어갈 값 전달을 위해 임의로 만든 객체
const chartData = [
    {
        label: ['2025년 6월', '2025년 7월', '2025년 8월'],
        data: [47, 98, 250],
    },
    {
        label: ['2025년 6월', '2025년 7월', '2025년 8월'],
        data: [32, 63, 194],
    },
    {
        label: ['2025년 6월', '2025년 7월', '2025년 8월'],
        data: [78, 185, 302],
    },
];

// select 값에 따라 현재 차트 데이터 계산
const currentChartData = computed(() => {
    const index = chartOptions.indexOf(selectedChartOption.value);
    return chartData[index];
});

// 가게 관리, 고객 문의 테이블에 들어갈 값 전달을 위해 임의로 만든 객체
const stores = {
    name: '가게 관리',
    title: ['상호명', '소재지', '개업연월일', '상태'],
    data: [
        {
            0: '재원이 두마리 치킨',
            1: '부산광역시 기장군 철마면 철마천로 190',
            2: '2025-08-27',
            3: 0
        },
        {
            0: '숙다방',
            1: '경상북도 구미시 구미대로24길 4',
            2: '2025-08-25',
            3: 0
        },
        {
            0: '홍플러스',
            1: '경기도 화성시 팔탄면 버들로 1337-8',
            2: '2025-08-24',
            3: 1
        }
    ]
};

let interval;

onMounted(() => {
    getStats();

    // 5분마다 통계 조회
    interval = setInterval(() => {
        getStats();
    }, 5 * 60 * 1000);
});

onUnmounted(() => {
    clearInterval(interval);
})
</script>

<template>
    <b-container>
        <b-row>
            <!-- 숫자 통계 -->
            <b-col cols="12" class="stats">
                <b-row>
                    <div class="stats-card-area mb-3">
                        <StatsCard title="금일 가입자 수" :count="todayUsers" />
                    </div>
                    <div class="stats-card-area mb-3">
                        <StatsCard title="금일 가게 등록 수" :count="todayStores" />
                    </div>
                    <div class="stats-card-area mb-3">
                        <StatsCard title="금일 주문 건 수" :count="todayOrders" />
                    </div>
                    <div class="stats-card-area mb-3">
                        <StatsCard title="금일 매출액" :count="todayAmount" />
                    </div>
                </b-row>
            </b-col>

            <!-- 차트 통계 -->
            <b-col cols="12" class="chart">
                <b-row>
                    <b-col cols="12" class="text-end mb-3">
                        <b-form-select size="sm" class="w-auto d-inline-block" :options="chartOptions" v-model="selectedChartOption"></b-form-select>
                    </b-col>

                    <b-col cols="12" class="text-end mb-3">
                        <div class="card" style="height: 375px;">
                            <ChartCard :title="selectedChartOption" :chart-data="currentChartData" />
                        </div>
                    </b-col>
                </b-row>
            </b-col>

            <!-- 가게 관리 -->
            <b-col cols="12" class="board">
                <b-row>
                    <b-col cols="12" class="mb-3">
                        <DashboardCard title="가게 관리" board="store" :table="stores" />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="scss" scoped>
.stats-card-area {
    flex: 0 0 100%;
    max-width: 100%;

    @media (min-width: 480px) {
        flex: 0 0 50%;
        max-width: 50%;
    }

    @media (min-width: 1150px) {
        flex: 0 0 25%;
        max-width: 25%;
    }
}
</style>