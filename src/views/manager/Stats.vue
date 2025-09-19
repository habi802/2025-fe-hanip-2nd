<script setup>
import 'v-calendar/style.css'
import '@/assets/manager/manager.css'

import { reactive, ref, computed, watch } from 'vue';
import { getUserStats, getStoreStats, getOrderStats, getAmountStats } from '@/services/managerService';
import StatsChartCard from '@/components/manager/StatsChartCard.vue';
import { DatePicker as VDatePicker } from 'v-calendar'
import dayjs from 'dayjs';
import isoweek from 'dayjs/plugin/isoweek';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import AlertModal from '@/components/modal/AlertModal.vue';

dayjs.extend(isoweek);

const state = reactive({
    form: {
        type: 'year',
        date: '',
    },
    stats: {
        user: [],
        store: [],
        order: [],
        amount: []
    }
});

// input에 표시할 포맷
const formattedDate = computed(() => {
  if (!state.form.date) return ''
  const d = new Date(state.form.date)
  switch(state.form.type) {
    case 'year': return d.getFullYear()
    case 'month': return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    case 'week': {
      // 단순히 선택한 날짜의 주차 표시
      const onejan = new Date(d.getFullYear(),0,1)
      const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay()+1)/7)
      return `${d.getFullYear()}-W${week}`
    }
    case 'day': return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }
});

// 기간 선택 시 날짜 선택하는 부분이 기간에 맞춰 선택할 수 있게 바뀜
const datePickerMode = computed(() => {
    switch (state.form.type) {
        case 'year':
            return 'year';
        case 'month':
            return 'month';
        default:
            return 'single';
    }
});

const loadingModalRef = ref(null);

// 통계 조회
const getStats = async () => {
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
                                <VDatePicker v-model="state.form.date" :mode="datePickerMode">
    <template #default="{ togglePopover }">
      <input
        type="text"
        readonly
        :value="formattedDate"
        @click="togglePopover"
        class="px-3 py-2 border rounded-md w-40"
      />
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
                        <div class="card">
                            <StatsChartCard title="user" :chart-data="state.stats.user" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card">
                            <StatsChartCard title="store" :chart-data="state.stats.store" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card">
                            <StatsChartCard title="order" :chart-data="state.stats.order" />
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6" class="mb-2">
                        <div class="card">
                            <StatsChartCard title="amount" :chart-data="state.stats.amount" />
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