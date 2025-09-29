<script setup>
import '@/assets/manager/manager.css';
import "flatpickr/dist/flatpickr.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";

import { onMounted, reactive, ref } from 'vue';
import { getStoreList, getStore, patchIsActive } from '@/services/managerService';
import { usePaginationStore } from '@/stores/pagination';
import FlatPickr from "vue-flatpickr-component";
import PageSizeSelect from '@/components/manager/PageSizeSelect.vue';
import DateTable from '@/components/manager/DataTable.vue';
import BoardModal from '@/components/manager/BoardModal.vue';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import AlertModal from '@/components/modal/AlertModal.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';

const pagination = usePaginationStore();

const today = new Date();
const lastWeek = new Date();
lastWeek.setDate(today.getDate() - 7);

const defaultForm = {
    startDate: lastWeek.toISOString().slice(0, 10),
    endDate: today.toISOString().slice(0, 10),
    startOpenDate: '',
    endOpenDate: '',
    name: '',
    ownerName: '',
    businessNumber: '',
    address: '',
    tel: '',
    isActive: '',
    pageNumber: pagination.state.pageNumber,
    pageSize: pagination.state.pageSize
}

const state = reactive({
    form: { ...defaultForm },
    stores: []
});

// 날짜 입력칸 설정
const startDateConfig = {
    locale: Korean,
    dateFormat: 'Y-m-d',
    onChange: (date) => {
        // 선택한 시작일이 종료일보다 크면 자동으로 종료일을 시작일로 입력
        if (date[0] && state.form.endDate) {
            if (date[0] > new Date(state.form.endDate)) {
                state.form.endDate = date[0];
            }
        }
    }
}
const endDateConfig = {
    locale: Korean,
    dateFormat: 'Y-m-d',
    onChange: (date) => {
        // 선택한 종료일이 시작일보다 작으면 자동으로 시작일을 종료일로 입력
        if (date[0] && state.form.startDate) {
            if (date[0] < new Date(state.form.startDate)) {
                state.form.startDate = date[0];
            }
        }
    }
}
const startOpenDateConfig = {
    locale: Korean,
    dateFormat: 'Y-m-d',
    onChange: (date) => {
        // 선택한 시작일이 종료일보다 크면 자동으로 종료일을 시작일로 입력
        if (date[0] && state.form.endOpenDate) {
            if (date[0] > new Date(state.form.endOpenDate)) {
                state.form.endOpenDate = date[0];
            }
        }
    }
}
const endOpenDateConfig = {
    locale: Korean,
    dateFormat: 'Y-m-d',
    onChange: (date) => {
        // 선택한 종료일이 시작일보다 작으면 자동으로 시작일을 종료일로 입력
        if (date[0] && state.form.startOpenDate) {
            if (date[0] < new Date(state.form.startOpenDate)) {
                state.form.startOpenDate = date[0];
            }
        }
    }
}

// 검색 초기화
const resetForm = () => {
    Object.assign(state.form, defaultForm);
};

const loadingModalRef = ref(null);

// 가게 조회
const getStores = async () => {
    loadingModalRef.value.open();

    const res = await getStoreList(state.form);

    if (res !== undefined && res.status === 200) {
        state.stores = res.data.resultData.content;

        pagination.state.totalRow = res.data.resultData.totalRow;
    }

    loadingModalRef.value.hide();
};

const alertModalRef = ref(null);
const confirmModalRef = ref(null);
let items = [];

// 테이블에서 체크된 항목을 items에 추가(선택한 가게의 id와 isActive가 담긴 배열)
const addCheckItems = checkedItems => {
    items = checkedItems;
};

// 상세 조회 중인 가게의 id와 isActive를 items에 추가한 뒤 영업 승인 상태 변경 함수 실행
const addSelectedItem = item => {
    items = [{
        id: item.id,
        isActive: item.isActive
    }];
    setIsActive(item.newIsActive);
}

// 영업 승인 상태 변경
const setIsActive = async isActive => {
    // 선택한 가게가 없을 경우(체크박스 중 체크된 항목이 없을 경우)
    if (items.length === 0) {
        alertModalRef.value.open('선택한 가게가 없습니다.');
        return;
    }

    const isConfirmed = await confirmModalRef.value.showModal('영업 승인 상태를 변경하시겠습니까?');
    if (isConfirmed) {
        loadingModalRef.value.open();

        const ids = items.map(item => item.id);

        const params = { id: ids, isActive };
        const res = await patchIsActive(params);
        
        if (res !== undefined && res.status === 200) {
            alertModalRef.value.open('상태가 변경되었습니다.');

            // 상태가 변경된 항목은 state.stores 에서 제거
            items.forEach(item => {
                const idx = state.stores.findIndex(store => store.storeId === item.id && store.isActive !== isActive);
                if (idx >= 0) {
                    state.stores.splice(idx, 1);
                    pagination.state.totalRow = pagination.state.totalRow - 1;
                }
            });
        }

        loadingModalRef.value.hide();
    }
};

// 상세 조회 모달 창 닫기
const closeModal = () => {
    boardModalRef.value.hide();
};

// 테이블 필드
const fields = [
    { key: 'name', label: '상호명' },
    { key: 'ownerName', label: '대표자명' },
    { key: 'businessNumber', label: '사업자 등록번호' },
    { key: 'address', label: '주소' },
    { key: 'openDate', label: '개업연월일' },
    { key: 'tel', label: '전화번호' },
    { key: 'isActive', label: '영업 승인' },
    { key: 'createdAt', label: '가게 등록일' }
];

// 페이지 사이즈 변경
const changePageSize = size => {
    pagination.setPageSize(size);
    pagination.setPageNumber(1);
    state.form.pageSize = size;
    state.form.pageNumber = 1;

    getStores();
};

// 페이지 이동
const changePage = page => {
    pagination.setPageNumber(page);
    state.form.pageNumber = page;

    getStores();
};

const boardModalRef = ref(null);
const store = ref({});

// 상세 조회
const openBoardModal = async item => {
    loadingModalRef.value.open();

    const res = await getStore(item.storeId);

    if (res !== undefined && res.status === 200) {
        store.value = res.data.resultData;

        boardModalRef.value.open();
    }

    loadingModalRef.value.hide();
};

onMounted(() => {
    getStores();
});
</script>

<template>
    <b-container>
        <h5 class="mb-3">가게 리스트</h5>
        <b-row class="align-items-center">
            <b-col cols="12">
                <b-row class="align-items-center">
                    <b-col cols="12" lg="6" xl="4" xxl="3" class="mb-2">
                        <label for="" class="form-label">가게 등록일</label>
                        <b-row class="align-items-center">
                            <b-col>
                                <FlatPickr class="form-control" v-model="state.form.startDate" :config="startDateConfig" />
                            </b-col>
                            ~
                            <b-col>
                                <FlatPickr class="form-control" v-model="state.form.endDate" :config="endDateConfig" />
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col cols="12" lg="6" xl="4" xxl="3" class="mb-2">
                        <label for="" class="form-label">개업연월일</label>
                        <b-row class="align-items-center">
                            <b-col>
                                <FlatPickr class="form-control" v-model="state.form.startOpenDate" :config="startOpenDateConfig" />
                            </b-col>
                            ~
                            <b-col>
                                <FlatPickr class="form-control" v-model="state.form.endOpenDate" :config="endOpenDateConfig" />
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
                        <label for="isActive" class="form-label">영업 승인</label>
                        <b-form-select id="isActive" v-model="state.form.isActive">
                            <option value="">전체</option>
                            <option value="0">대기</option>
                            <option value="1">완료</option>
                        </b-form-select>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="ms-auto mb-2">
                        <label class="form-label d-block invisible">버튼</label>
                        <b-row>
                            <b-col>
                                <button class="btn btn-secondary w-100" @click="resetForm">초기화</button>
                            </b-col>
                            <b-col>
                                <button class="btn btn-primary w-100" @click="getStores">검색</button>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>

            <b-col cols="12">
                <b-row>
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
                        <button class="btn btn-success mb-2 me-2" @click="setIsActive(1)">영업 승인</button>
                        <button class="btn btn-secondary mb-2" @click="setIsActive(0)">영업 대기</button>
                    </b-col>

                    <b-col cols="12">
                        <DateTable title="store" :items="state.stores" :field="fields" id-key="storeId" @row-selected="openBoardModal" @row-checked="addCheckItems" />
                    </b-col>

                    <b-col cols="12">
                        <b-pagination align="center"
                        v-model="pagination.state.pageNumber" :per-page="pagination.state.pageSize" :total-rows="pagination.state.totalRow" @update:model-value="changePage"></b-pagination>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>

    <BoardModal title="store" :item="store" id-key="storeId" @set-item-status="addSelectedItem" ref="boardModalRef" />

    <LoadingModal ref="loadingModalRef" />
    <AlertModal ref="alertModalRef" @hidden="closeModal" />
    <ConfirmModal ref="confirmModalRef" />
</template>

<style lang="scss" scoped>
</style>