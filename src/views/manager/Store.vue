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
    StartCreatedAt: lastWeek,
    EndCreatedAt: today,
    StartOpenDate: lastWeek,
    EndOpenDate: today,
    name: '',
    ownerName: '',
    businessNumber: '',
    address: '',
    tel: '',
    isActive: 0,
}

const state = reactive({
    form: { ...defaultForm }
});

// 검색 초기화
const resetForm = () => {
    Object.assign(state.form, defaultForm);
};

// 테이블에 들어갈 값 전달을 위해 임의로 만든 객체
const store = [
{
        name: '',
        ownerName: '',
        businessNumber: '',
        address: '',
        openDate: '',
        tel: '',
        isActive: 0,
        createdAt: ''
    },
    {
        name: '',
        ownerName: '',
        businessNumber: '',
        address: '',
        openDate: '',
        tel: '',
        isActive: 1,
        createdAt: ''
    },
    {
        name: '',
        ownerName: '',
        businessNumber: '',
        address: '',
        openDate: '',
        tel: '',
        isActive: 1,
        createdAt: ''
    },
];
const fields = [
    { key: 'name', label: '상호명' },
    { key: 'ownerName', label: '대표자명' },
    { key: 'businessNumber', label: '사업자 등록번호' },
    { key: 'address', label: '주소' },
    { key: 'openDate', label: '개업연월일' },
    { key: 'tel', label: '전화번호' },
    { key: 'isActive', label: '상태' },
    { key: 'createdAt', label: '가게 등록일' }
];
</script>

<template>
    <b-container>
        <h5 class="mb-3">가게 리스트</h5>
        <b-row class="align-items-center">
            <b-col cols="12" lg="6" xl="4" xxl="3" class="mb-2">
                <label for="" class="form-label">가게 등록일</label>
                <b-row class="align-items-center">
                    <b-col>
                        <VueDatePicker :enable-time-picker="false" :format="formatDate" v-model="state.form.StartCreatedAt" />
                    </b-col>
                    ~
                    <b-col>
                        <VueDatePicker :enable-time-picker="false" :format="formatDate" v-model="state.form.EndCreatedAt" />
                    </b-col>
                </b-row>
            </b-col>
            <b-col cols="12" lg="6" xl="4" xxl="3" class="mb-2">
                <label for="" class="form-label">개업연월일</label>
                <b-row class="align-items-center">
                    <b-col>
                        <VueDatePicker :enable-time-picker="false" :format="formatDate" v-model="state.form.StartOpenDate" />
                    </b-col>
                    ~
                    <b-col>
                        <VueDatePicker :enable-time-picker="false" :format="formatDate" v-model="state.form.EndOpenDate" />
                    </b-col>
                </b-row>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="name" class="form-label">상호명</label>
                <b-form-input type="text" id="name" v-model="state.form.name"></b-form-input>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="ownerName" class="form-label">대표자명</label>
                <b-form-input type="text" id="ownerName" v-model="state.form.ownerName"></b-form-input>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="businessNumber" class="form-label">사업자 등록번호</label>
                <b-form-input type="text" id="businessNumber" v-model="state.form.businessNumber"></b-form-input>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="address" class="form-label">주소</label>
                <b-form-input type="text" id="address" v-model="state.form.address"></b-form-input>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="tel" class="form-label">전화번호</label>
                <b-form-input type="text" id="tel" v-model="state.form.tel"></b-form-input>
            </b-col>
            <b-col cols="6" xl="4" xxl="3" class="mb-2">
                <label for="isActive" class="form-label">상태</label>
                <b-form-select id="isActive" v-model="state.form.isActive">
                    <option value="0">비활성화</option>
                    <option value="1">활성화</option>
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
                <DateTable title="store" :items="store" :field="fields" />
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="scss" scoped>

</style>