<script setup>
import '@/assets/manager/manager.css'

import { reactive, ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import PageSizeSelect from '@/components/manager/PageSizeSelect.vue';
import DateTable from '@/components/manager/DataTable.vue';
import BoardCard from '@/components/manager/BoardCard.vue';

const formatDate = (date) => date.toLocaleDateString();

const today = new Date();
const lastWeek = new Date();
lastWeek.setDate(today.getDate() - 7);

const defaultForm = {
    startDate: lastWeek,
    endDate: today,
    storeName: '',
    customerName: '',
    comment: '',
    ownerComment: 0,
    isHide: 0
}

const state = reactive({
    form: { ...defaultForm }
});

// 검색 초기화
const resetForm = () => {
    Object.assign(state.form, defaultForm);
};

// 테이블에 들어갈 값 전달을 위해 임의로 만든 객체
const review = [
    {
        storeName: '민병관',
        customerName: 'user01',
        comment: '010-1204-4506',
        ownerComment: 0,
        createdAt: '2025-08-13',
        isHide: 0
    },
    {
        storeName: '민병관',
        customerName: 'user01',
        comment: '010-1204-4506',
        ownerComment: 0,
        createdAt: '2025-08-13',
        isHide: 1
    },
    {
        storeName: '민병관',
        customerName: 'user01',
        comment: '010-1204-4506',
        ownerComment: 1,
        createdAt: '2025-08-13',
        isHide: 1
    }
];
const fields = [
    { key: 'storeName', label: '상호명' },
    { key: 'customerName', label: '작성자' },
    { key: 'comment', label: '내용' },
    { key: 'ownerComment', label: '사장 답변' },
    { key: 'createdAt', label: '작성일' },
    { key: 'isHide', label: '상태' },
];

const boardSection = ref(null);
const goToBoardSection = item => {
    boardSection.value?.$el.scrollIntoView({ behavior: "smooth" });
};
</script>

<template>
    <b-container>
        <h5 class="mb-3">리뷰 리스트</h5>
        <b-row class="align-items-center">
            <b-col cols="12">
                <b-row class="align-items-center">
                    <b-col cols="12" lg="6" xl="4" xxl="3" class="mb-2">
                        <label for="" class="form-label">작성일</label>
                        <b-row class="align-items-center">
                            <b-col>
                                <VueDatePicker :enable-time-picker="false" :format="formatDate" v-model="state.form.startDate" />
                            </b-col>
                            ~
                            <b-col>
                                <VueDatePicker :enable-time-picker="false" :format="formatDate" v-model="state.form.endDate" />
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="loginId" class="form-label">상호명</label>
                        <b-form-input type="text" id="loginId" v-model="state.form.storeName"></b-form-input>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="loginId" class="form-label">작성자</label>
                        <b-form-input type="text" id="loginId" v-model="state.form.customerName"></b-form-input>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="loginId" class="form-label">내용</label>
                        <b-form-input type="text" id="loginId" v-model="state.form.comment"></b-form-input>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="provider" class="form-label">사장 답변</label>
                        <b-form-select id="provider" v-model="state.form.ownerComment">
                            <option value="0">미등록</option>
                            <option value="1">등록</option>
                        </b-form-select>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="provider" class="form-label">상태</label>
                        <b-form-select id="provider" v-model="state.form.isHide">
                            <option value="0">공개</option>
                            <option value="1">숨김</option>
                        </b-form-select>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="ms-auto mb-2">
                        <label class="form-label d-block invisible">버튼</label>
                        <b-row>
                            <b-col>
                                <button class="btn btn-secondary w-100" @click="resetForm">초기화</button>
                            </b-col>
                            <b-col>
                                <button class="btn btn-primary w-100">검색</button>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>
            <b-col cols="12">
                <b-row>
                    <b-col cols="12" lg="6">
                        <b-row>
                            <b-col cols="12" class="text-end mb-2">
                                <PageSizeSelect />
                            </b-col>
                            <b-col cols="12">
                                <DateTable title="review" :items="review" :field="fields" @row-selected="goToBoardSection" />
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col ref="boardSection" cols="12" lg="6">
                        <BoardCard title="review" />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<style scoped>

</style>