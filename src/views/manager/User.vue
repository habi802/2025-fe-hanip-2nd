<script setup>
import '@/assets/manager/manager.css'

import { reactive } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import PageSizeSelect from '@/components/manager/PageSizeSelect.vue';
import DateTable from '@/components/manager/DataTable.vue';

const formatDate = (date) => date.toLocaleDateString();

const today = new Date();
const lastWeek = new Date();
lastWeek.setDate(today.getDate() - 7);

const defaultForm = {
    startDate: lastWeek,
    endDate: today,
    loginId: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    provider: '01',
    role: '01'
}

const state = reactive({
    form: { ...defaultForm }
});

// 검색 초기화
const resetForm = () => {
    Object.assign(state.form, defaultForm);
};

// 테이블에 들어갈 값 전달을 위해 임의로 만든 객체
const user = [
    {
        name: '민병관',
        loginId: 'user01',
        address: '13630, 경기 성남시 분당구 돌마로 46, 광천프라자 5층 503호',
        phone: '010-1204-4506',
        email: 'people@gmail.com',
        providerType: '01',
        role: '01',
        createdAt: '2025-08-13'
    },
    {
        name: '김장수',
        loginId: 'user01',
        address: '46757, 부산광역시 강서구 녹산산단382로14번가길 13번지 (송정동)',
        phone: '010-5896-9383',
        email: 'longlife@naver.com',
        providerType: '03',
        role: '02',
        createdAt: '2025-08-29'
    },
    {
        name: '임택원',
        loginId: 'user02',
        address: '41937, 대구 중구 중앙대로 394, 제일빌딩 5층',
        phone: '010-5959-3939',
        email: 'chooseone@daum.net',
        providerType: '02',
        role: '03',
        createdAt: '2025-09-01'
    }
];
const fields = [
    { key: 'name', label: '이름' },
    { key: 'loginId', label: '아이디' },
    { key: 'address', label: '주소' },
    { key: 'phone', label: '전화번호' },
    { key: 'email', label: '이메일' },
    { key: 'providerType', label: '가입 유형' },
    { key: 'role', label: '분류' },
    { key: 'createdAt', label: '가입일' },
];
</script>

<template>
    <b-container>
        <h5 class="mb-3">회원 리스트</h5>
        <b-row class="align-items-center">
            <b-col cols="12" lg="6" xl="4" xxl="3" class="mb-2">
                <label for="" class="form-label">가입일</label>
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
                <label for="loginId" class="form-label">아이디</label>
                <b-form-input type="text" id="loginId" v-model="state.form.loginId"></b-form-input>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="name" class="form-label">이름</label>
                <b-form-input type="text" id="name" v-model="state.form.name"></b-form-input>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="address" class="form-label">주소</label>
                <b-form-input type="text" id="address" v-model="state.form.address"></b-form-input>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="phone" class="form-label">전화번호</label>
                <b-form-input type="text" id="phone" v-model="state.form.phone"></b-form-input>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="email" class="form-label">이메일</label>
                <b-form-input type="text" id="email" v-model="state.form.email"></b-form-input>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="provider" class="form-label">가입 유형</label>
                <b-form-select id="provider" v-model="state.form.provider">
                    <option value="01">일반</option>
                    <option value="02">카카오</option>
                    <option value="03">네이버</option>
                </b-form-select>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="role" class="form-label">분류</label>
                <b-form-select id="role" v-model="state.form.role">
                    <option value="01">고객</option>
                    <option value="02">사장</option>
                    <option value="03">배달원</option>
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

            <b-col cols="12" class="text-end mb-2">
                <PageSizeSelect />
            </b-col>

            <b-col cols="12">
                <DateTable title="user" :items="user" :field="fields" />
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="scss" scoped>

</style>