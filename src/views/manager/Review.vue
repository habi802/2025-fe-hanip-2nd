<script setup>
import '@/assets/manager/manager.css'

import { onMounted, reactive, ref } from 'vue';
import { getReviewList, getReview, patchIsHide } from '@/services/managerService';
import { usePaginationStore } from '@/stores/pagination';
import VueDatePicker from '@vuepic/vue-datepicker';
import PageSizeSelect from '@/components/manager/PageSizeSelect.vue';
import DateTable from '@/components/manager/DataTable.vue';
import BoardCard from '@/components/manager/BoardCard.vue';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import AlertModal from '@/components/modal/AlertModal.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';

const pagination = usePaginationStore();

// 날짜 선택 Input의 입력 포맷 지정
const formatDate = (date) => date.toLocaleDateString();

const today = new Date();
const lastWeek = new Date();
lastWeek.setDate(today.getDate() - 7);

const defaultForm = {
    startDate: lastWeek.toISOString().slice(0, 10),
    endDate: today.toISOString().slice(0, 10),
    storeName: '',
    customerName: '',
    comment: '',
    ownerComment: 0,
    isHide: 0,
    pageNumber: pagination.state.pageNumber,
    pageSize: pagination.state.pageSize
}

const state = reactive({
    form: { ...defaultForm },
    reviews: []
});

// 날짜 선택
const changeDate = (key, date) => {
    state.form[key] = date.toISOString().slice(0, 10);
};

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
let ids = [];

// 테이블에서 체크된 항목을 ids에 추가(선택한 리뷰의 id가 담긴 배열)
const addCheckItemIds = checkedItems => {
    ids = checkedItems;
};

// 상세 조회 중인 리뷰의 id를 바로 ids에 추가하여 숨기기 상태 변경
const addSelectedItemId = item => {
    ids = [item.id];
    setIsHide(item.status);
}

// 리뷰 숨기기 상태 변경
const setIsHide = async isHide => {
    // 선택한 리뷰가 없을 경우(체크박스 중 체크된 항목이 없을 경우)
    if (ids.length === 0) {
        alertModalRef.value.open('선택한 리뷰가 없습니다.');
        return;
    }

    const isConfirmed = await confirmModalRef.value.showModal('리뷰 상태를 변경하시겠습니까?');
    if (isConfirmed) {
        loadingModalRef.value.open();

        const params = { id: ids, isHide };
        const res = await patchIsHide(params);
        
        if (res !== undefined && res.status === 200) {
            alertModalRef.value.open('상태가 변경되었습니다.');

            // 상태가 변경된 항목은 state.reviews 에서 제거
            ids.forEach(id => {
                const idx = state.reviews.findIndex(item => item.reviewId === id);
                if (idx >= 0) {
                    state.reviews.splice(idx, 1);
                    pagination.state.totalRow = pagination.state.totalRow - 1;
                }
            });
        }

        loadingModalRef.value.hide();
    }
};

// 테이블 필드
const fields = [
    { key: 'storeName', label: '상호명' },
    { key: 'customerName', label: '작성자' },
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

const boardSection = ref(null);

const review = ref({});

// 상세 조회
const goToBoardSection = async item => {
    loadingModalRef.value.open();

    const res = await getReview(item.reviewId);

    if (res !== undefined && res.status === 200) {
        review.value = res.data.resultData;

        // 상세 정보 보여주는 요소로 스크롤 이동
        boardSection.value?.$el.scrollIntoView({ behavior: "smooth" });
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
                                <VueDatePicker :enable-time-picker="false" :format="formatDate" v-model="state.form.startDate" @update:model-value="date => changeDate('startDate', date)" />
                            </b-col>
                            ~
                            <b-col>
                                <VueDatePicker :enable-time-picker="false" :format="formatDate" v-model="state.form.endDate" @update:model-value="date => changeDate('endDate', date)" />
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
                                <button class="btn btn-primary w-100" @click="getReviews">검색</button>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>
            
            <b-col cols="12">
                <b-row>
                    <b-col cols="12" lg="6">
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
                                <DateTable title="review" :items="state.reviews" :field="fields" id-key="reviewId" @row-selected="goToBoardSection" @row-checked="addCheckItemIds" />
                            </b-col>

                            <b-col cols="12">
                                <b-pagination align="center"
                                v-model="pagination.state.pageNumber" :per-page="pagination.state.pageSize" :total-rows="pagination.state.totalRow" @update:model-value="changePage"></b-pagination>
                            </b-col>
                        </b-row>
                    </b-col>

                    <b-col ref="boardSection" cols="12" lg="6">
                        <BoardCard title="review" :item="review" id-key="reviewId" @set-item-status="addSelectedItemId" />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>

    <LoadingModal ref="loadingModalRef" />
    <AlertModal ref="alertModalRef" />
    <ConfirmModal ref="confirmModalRef" />
</template>

<style scoped>

</style>