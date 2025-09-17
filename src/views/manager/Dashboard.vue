<script setup>
import '@/assets/manager/manager.css'

import StatsCard from '@/components/manager/StatsCard.vue';
import ChartCard from '@/components/manager/ChartCard.vue';
import DashboardCard from '@/components/manager/DashboardCard.vue';
import { computed, ref } from 'vue';

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
const contacts = {
    name: '고객 문의',
    title: ['글쓴이', '제목', '작성일', '답글'],
    data: [
        {
            0: '김재원',
            1: '가게 등록했는데 활성화해주세요',
            2: '2025-08-27',
            3: 1
        },
        {
            0: '이은숙',
            1: '메뉴 등록이 안돼요ㅠ',
            2: '2025-08-26',
            3: 0
        },
        {
            0: '홍상회',
            1: '고객이 주문을 취소했는데 결제 취소할 수 있나요?',
            2: '2025-08-25',
            3: 0
        },
    ]
};

// 차트 부분 select 관련 변수
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
</script>

<template>
    <b-container>
        <b-row>
            <!-- 숫자 통계 -->
            <b-col cols="12" class="stats">
                <b-row>
                    <div class="stats-card-area mb-3">
                        <StatsCard title="금일 가입자 수" :count="1000" />
                    </div>
                    <div class="stats-card-area mb-3">
                        <StatsCard title="금일 가게 등록 수" :count="1187" />
                    </div>
                    <div class="stats-card-area mb-3">
                        <StatsCard title="금일 주문 건 수" :count="4222" />
                    </div>
                    <div class="stats-card-area mb-3">
                        <StatsCard title="금일 매출액" :count="876" />
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

            <!-- 가게 관리, 고객 문의 -->
            <b-col cols="12" class="board">
                <b-row>
                    <!-- 가게 관리 -->
                    <b-col cols="12" xl="6" class="mb-3">
                        <DashboardCard title="가게 관리" board="store" :table="stores" />
                    </b-col>

                    <!-- 고객 문의 -->
                    <b-col cols="12" xl="6" class="mb-3">
                        <DashboardCard title="고객 문의" board="contact" :table="contacts" />
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