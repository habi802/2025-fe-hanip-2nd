<script setup>
import '@/assets/manager/manager.css'

import { onMounted, reactive, ref } from 'vue';
import { getUserList } from '@/services/managerService';
import { usePaginationStore } from '@/stores/pagination';
import VueDatePicker from '@vuepic/vue-datepicker';
import PageSizeSelect from '@/components/manager/PageSizeSelect.vue';
import DateTable from '@/components/manager/DataTable.vue';
import LoadingModal from '@/components/modal/LoadingModal.vue';

const pagination = usePaginationStore();

// 날짜 선택 Input의 입력 포맷 지정
const formatDate = (date) => date.toLocaleDateString();

const today = new Date();
const lastWeek = new Date();
lastWeek.setDate(today.getDate() - 7);

const defaultForm = {
    startDate: lastWeek.toISOString().slice(0, 10),
    endDate: today.toISOString().slice(0, 10),
    loginId: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    providerType: '00',
    role: '00',
    pageNumber: pagination.state.pageNumber,
    pageSize: pagination.state.pageSize
}

const state = reactive({
    form: { ...defaultForm },
    users: []
});

// 날짜 선택
const changeDate = (key, date) => {
    state.form[key] = date.toISOString().slice(0, 10);
};

// 검색 초기화
const resetForm = () => {
    Object.assign(state.form, defaultForm);

    getUsers();
};

const loadingModalRef = ref(null);

// 유저 조회
const getUsers = async () => {
    loadingModalRef.value.open();

    const res = await getUserList(state.form);

    if (res !== undefined && res.status === 200) {
        state.users = res.data.resultData.content;

        pagination.state.totalRow = res.data.resultData.totalRow;
    }

    loadingModalRef.value.hide();
};

// 테이블 필드
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

// 페이지 사이즈 변경
const changePageSize = size => {
    pagination.setPageSize(size);
    pagination.setPageNumber(1);
    state.form.pageSize = size;
    state.form.pageNumber = 1;

    getUsers();
};

// 페이지 이동
const changePage = page => {
    pagination.setPageNumber(page);
    state.form.pageNumber = page;

    getUsers();
};

onMounted(() => {
    getUsers();
});
</script>

<template>
    <b-container>
        <h5 class="mb-3">회원 리스트</h5>
        <b-row class="align-items-center">
            <b-col cols="12" lg="6" xl="4" xxl="3" class="mb-2">
                <label for="" class="form-label">가입일</label>
                <b-row class="align-items-center">
                    <b-col>
                        <VueDatePicker :enable-time-picker="false" :format="formatDate" v-model="state.form.startDate" @update:model-value="date => changeDate('startDate', date)" locale="ko" />
                    </b-col>
                    ~
                    <b-col>
                        <VueDatePicker :enable-time-picker="false" :format="formatDate" v-model="state.form.endDate" @update:model-value="date => changeDate('startDate', date)" locale="ko" />
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
                <b-form-select id="provider" v-model="state.form.providerType">
                    <option value="00">전체</option>
                    <option value="01">일반</option>
                    <option value="02">카카오</option>
                    <option value="03">네이버</option>
                </b-form-select>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="role" class="form-label">분류</label>
                <b-form-select id="role" v-model="state.form.role">
                    <option value="00">전체</option>
                    <option value="01">고객</option>
                    <option value="02">사장</option>
                </b-form-select>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="ms-auto mb-2">
                <label class="form-label d-block invisible">버튼</label>
                <b-row>
                    <b-col>
                        <button class="btn btn-secondary w-100" @click="resetForm">초기화</button>
                    </b-col>
                    <b-col>
                        <button class="btn btn-primary w-100" @click="getUsers">검색</button>
                    </b-col>
                </b-row>
            </b-col>

            <b-col cols="12">
                <b-row>
                    <b-col cols="6" class="text-start mb-2">
                        총 {{ pagination.state.totalRow }} 건
                    </b-col>

                    <b-col cols="6" class="text-end mb-2">
                        <PageSizeSelect @change-page-size="changePageSize" />
                    </b-col>
                </b-row>
            </b-col>

            <b-col cols="12">
                <DateTable title="user" :items="state.users" :field="fields" />
            </b-col>

            <b-col cols="12">
                <b-pagination align="center"
                v-model="pagination.state.pageNumber" :per-page="pagination.state.pageSize" :total-rows="pagination.state.totalRow" @update:model-value="changePage"></b-pagination>
            </b-col>
        </b-row>
    </b-container>

    <LoadingModal ref="loadingModalRef" />
</template>

<style lang="scss" scoped>

</style>