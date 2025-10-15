<script setup>
import '@/assets/manager/manager.css'
import "flatpickr/dist/flatpickr.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";

import { onMounted, reactive, ref } from 'vue';
import { getReviewList, getReview, patchIsHide } from '@/services/managerService';
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
    storeName: '',
    userName: '',
    comment: '',
    ownerComment: '',
    isHide: '',
    pageNumber: pagination.state.pageNumber,
    pageSize: pagination.state.pageSize
}

const state = reactive({
    form: { ...defaultForm },
    reviews: []
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

// 검색 초기화
const resetForm = () => {
    Object.assign(state.form, defaultForm);
};

const loadingModalRef = ref(null);

// 리뷰 조회
const getReviews = async () => {
    loadingModalRef.value.open();

    const res = await getReviewList(state.form);

    if (res !== undefined && res.status === 200) {
        state.reviews = res.data.resultData.content;

        pagination.state.totalRow = res.data.resultData.totalRow;
    }

    loadingModalRef.value.hide();
};

const alertModalRef = ref(null);
const confirmModalRef = ref(null);
let items = [];

// 테이블에서 체크된 항목을 items에 추가(선택한 리뷰의 id와 isHide가 담긴 배열)
const addCheckItems = checkedItems => {
    items = checkedItems;
};

// 상세 조회 중인 리뷰의 id와 isHide를 바로 items에 추가하여 숨기기 상태 변경
const addSelectedItem = item => {
    items = [{
        id: item.id,
        isHide: item.isHide
    }];
    setIsHide(item.newIsHide);
}

// 리뷰 숨기기 상태 변경
const setIsHide = async isHide => {
    // 선택한 리뷰가 없을 경우(체크박스 중 체크된 항목이 없을 경우)
    if (items.length === 0) {
        alertModalRef.value.open('선택한 리뷰가 없습니다.');
        return;
    }

    const isConfirmed = await confirmModalRef.value.showModal('리뷰 상태를 변경하시겠습니까?');
    if (isConfirmed) {
        loadingModalRef.value.open();

        const ids = items.map(item => item.id);

        const params = { id: ids, isHide };
        const res = await patchIsHide(params);
        
        if (res !== undefined && res.status === 200) {
            alertModalRef.value.open('상태가 변경되었습니다.');

            // 상태가 변경된 항목은 state.reviews 에서 제거하거나 상태를 바꿈
            if (state.form.isHide !== '') {
                items.forEach(item => {
                    const idx = state.reviews.findIndex(review => review.reviewId === item.id && review.isHide !== isHide);
                    if (idx >= 0) {
                        state.reviews.splice(idx, 1);
                        pagination.state.totalRow = pagination.state.totalRow - 1;
                    }
                });
            } else {
                items.forEach(item => {
                    const idx = state.reviews.findIndex(review => review.reviewId === item.id && review.isHide !== isHide);
                    if (idx >= 0) {
                        state.reviews[idx].isHide = isHide;
                    }
                });
            }
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
    { key: 'storeName', label: '상호명' },
    { key: 'userName', label: '작성자' },
    { key: 'comment', label: '내용' },
    { key: 'ownerComment', label: '사장 답변' },
    { key: 'createdAt', label: '작성일' },
    { key: 'isHide', label: '상태' },
];

// 페이지 사이즈 변경
const changePageSize = size => {
    pagination.setPageSize(size);
    pagination.setPageNumber(1);
    state.form.pageSize = size;
    state.form.pageNumber = 1;

    getReviews();
};

// 페이지 이동
const changePage = page => {
    pagination.setPageNumber(page);
    state.form.pageNumber = page;

    getReviews();
};

const boardModalRef = ref(null);
const review = ref({});

// 상세 조회
const openBoardModal = async item => {
    loadingModalRef.value.open();

    const res = await getReview(item.reviewId);

    if (res !== undefined && res.status === 200) {
        review.value = res.data.resultData;
        console.log(review.value);

        boardModalRef.value.open();
    }

    loadingModalRef.value.hide();
};

onMounted(() => {
    getReviews();
});
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
                                <FlatPickr class="form-control" v-model="state.form.startDate" :config="startDateConfig" />
                            </b-col>
                            ~
                            <b-col>
                                <FlatPickr class="form-control" v-model="state.form.endDate" :config="endDateConfig" />
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="loginId" class="form-label">상호명</label>
                        <b-form-input type="text" id="loginId" v-model="state.form.storeName"></b-form-input>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="loginId" class="form-label">작성자</label>
                        <b-form-input type="text" id="loginId" v-model="state.form.userName"></b-form-input>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="loginId" class="form-label">내용</label>
                        <b-form-input type="text" id="loginId" v-model="state.form.comment"></b-form-input>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="provider" class="form-label">사장 답변</label>
                        <b-form-select id="provider" v-model="state.form.ownerComment">
                            <option value="">전체</option>
                            <option value="0">미등록</option>
                            <option value="1">등록</option>
                        </b-form-select>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="provider" class="form-label">상태</label>
                        <b-form-select id="provider" v-model="state.form.isHide">
                            <option value="">전체</option>
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
                                <button class="btn btn-primary w-100" @click="getReviews">검색</button>
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
                        <button class="btn btn-danger mb-2 me-2" @click="setIsHide(1)">리뷰 숨기기</button>
                        <button class="btn btn-secondary mb-2" @click="setIsHide(0)">숨김 해제</button>
                    </b-col>

                    <b-col cols="12">
                        <DateTable title="review" :items="state.reviews" :field="fields" id-key="reviewId" @row-selected="openBoardModal" @row-checked="addCheckItems" />
                    </b-col>

                    <b-col cols="12">
                        <b-pagination align="center"
                        v-model="pagination.state.pageNumber" :per-page="pagination.state.pageSize" :total-rows="pagination.state.totalRow" @update:model-value="changePage"></b-pagination>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>

    <BoardModal title="review" :item="review" id-key="reviewId" @set-item-status="addSelectedItem" ref="boardModalRef" />

    <LoadingModal ref="loadingModalRef" />
    <AlertModal ref="alertModalRef" @hidden="closeModal" />
    <ConfirmModal ref="confirmModalRef" />
</template>

<style scoped>

</style>