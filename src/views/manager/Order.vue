<script setup>
import '@/assets/manager/manager.css';
import "flatpickr/dist/flatpickr.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";

import { onMounted, reactive, ref } from 'vue';
import { getOrderList, getOrder, patchOrderStatus } from '@/services/managerService';
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
    userName: '',
    storeName: '',
    address: '',
    status: '00',
    payment: '00',
    isDeleted: '',
    pageNumber: pagination.state.pageNumber,
    pageSize: pagination.state.pageSize
}

const state = reactive({
    form: { ...defaultForm },
    orders: []
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

// 주문 조회
const getOrders = async () => {
    loadingModalRef.value.open();

    const res = await getOrderList(state.form);

    if (res !== undefined && res.status === 200) {
        state.orders = res.data.resultData.content;

        pagination.state.totalRow = res.data.resultData.totalRow;
    }

    loadingModalRef.value.hide();
};

const alertModalRef = ref(null);
const confirmModalRef = ref(null);
let items = [];

// 테이블에서 체크된 항목을 items에 추가(선택한 리뷰의 id와 status가 담긴 배열)
const addCheckItems = checkedItems => {
    items = checkedItems;
};

// 상세 조회 중인 주문의 id와 status를 바로 items에 추가하여 숨기기 상태 변경
const addSelectedItem = item => {
    items = [{
        id: item.id,
        status: item.status
    }];
    setIsHide(item.newStatus);
}

// 주문 취소
const cancelOrder = async status => {
    // 선택한 주문이 없을 경우(체크박스 중 체크된 항목이 없을 경우)
    if (items.length === 0) {
        alertModalRef.value.open('선택한 주문이 없습니다.');
        return;
    }

    const isConfirmed = await confirmModalRef.value.showModal('주문 취소 시 고객의 결제도 함께 취소됩니다. 주문 상태를 취소로 변경하시겠습니까?');
    if (isConfirmed) {
        loadingModalRef.value.open();

        const ids = items.map(item => item.id);

        const params = { id: ids, status };
        const res = await patchOrderStatus(params);
        
        if (res !== undefined && res.status === 200) {
            alertModalRef.value.open('상태가 변경되었습니다.');

            // 상태가 변경된 항목은 state.orders 에서 제거
            items.forEach(item => {
                const idx = state.orders.findIndex(order => order.orderId === item.id && order.status !== status);
                if (idx >= 0) {
                    state.orders.splice(idx, 1);
                    pagination.state.totalRow = pagination.state.totalRow - 1;
                }
            });
        }

        loadingModalRef.value.hide();
    }
};

// 테이블 필드
const fields = [
    { key: 'createdAt', label: '주문일' },
    { key: 'userName', label: '주문자명' },
    { key: 'storeName', label: '상호명' },
    { key: 'address', label: '배달 주소' },
    { key: 'status', label: '주문 상태' },
    { key: 'payment', label: '결제 수단' },
    { key: 'isDeleted', label: '고객 삭제 상태' },
];

// 페이지 사이즈 변경
const changePageSize = size => {
    pagination.setPageSize(size);
    pagination.setPageNumber(1);
    state.form.pageSize = size;
    state.form.pageNumber = 1;

    getOrders();
};

// 페이지 이동
const changePage = page => {
    pagination.setPageNumber(page);
    state.form.pageNumber = page;

    getOrders();
};

const boardModalRef = ref(null);
const order = ref({});

// 상세 조회
const openBoardModal = async item => {
    loadingModalRef.value.open();

    const res = await getOrder(item.orderId);

    if (res !== undefined && res.status === 200) {
        order.value = res.data.resultData;
        console.log(order.value);

        boardModalRef.value.open();
    }

    loadingModalRef.value.hide();
};

onMounted(() => {
    getOrders();
});
</script>

<template>
    <b-container>
        <h5 class="mb-3">주문 리스트</h5>
        <b-row class="align-items-center">
            <b-col cols="12">
                <b-row class="align-items-center">
                    <b-col cols="12" lg="6" xl="4" xxl="3" class="mb-2">
                        <label for="" class="form-label">주문일</label>
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
                        <label for="loginId" class="form-label">주문자명</label>
                        <b-form-input type="text" id="loginId" v-model="state.form.userName"></b-form-input>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="loginId" class="form-label">상호명</label>
                        <b-form-input type="text" id="loginId" v-model="state.form.storeName"></b-form-input>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="loginId" class="form-label">배달 주소</label>
                        <b-form-input type="text" id="loginId" v-model="state.form.address"></b-form-input>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="provider" class="form-label">주문 상태</label>
                        <b-form-select id="provider" v-model="state.form.status">
                            <option value="00">전체</option>
                            <option value="01">미결제</option>
                            <option value="02">결제 완료</option>
                            <option value="03">음식 준비중</option>
                            <option value="04">배달중</option>
                            <option value="05">배달 완료</option>
                            <option value="06">주문 취소</option>
                        </b-form-select>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="provider" class="form-label">결제 수단</label>
                        <b-form-select id="provider" v-model="state.form.payment">
                            <option value="00">전체</option>
                            <option value="01">미결제</option>
                            <option value="02">카카오페이</option>
                            <option value="03">네이버페이</option>
                        </b-form-select>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="mb-2">
                        <label for="isActive" class="form-label">고객 삭제 상태</label>
                        <b-form-select id="isActive" v-model="state.form.isDeleted">
                            <option value="">전체</option>
                            <option value="0">정상</option>
                            <option value="1">삭제됨</option>
                        </b-form-select>
                    </b-col>
                    <b-col cols="6" xl="4" xxl="3" class="ms-auto mb-2">
                        <label class="form-label d-block invisible">버튼</label>
                        <b-row>
                            <b-col>
                                <button class="btn btn-secondary w-100" @click="resetForm">초기화</button>
                            </b-col>
                            <b-col>
                                <button class="btn btn-primary w-100" @click="getOrders">검색</button>
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
                        <button class="btn btn-danger mb-2 me-2" @click="cancelOrder()">주문 취소</button>
                    </b-col>

                    <b-col cols="12">
                        <DateTable title="order" :items="state.orders" :field="fields" id-key="orderId" @row-selected="openBoardModal" @row-checked="addCheckItems" />
                    </b-col>

                    <b-col cols="12">
                        <b-pagination align="center"
                        v-model="pagination.state.pageNumber" :per-page="pagination.state.pageSize" :total-rows="pagination.state.totalRow" @update:model-value="changePage"></b-pagination>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>

    <BoardModal title="order" :item="order" id-key="orderId" @set-item-status="addSelectedItem" ref="boardModalRef" />

    <LoadingModal ref="loadingModalRef" />
    <AlertModal ref="alertModalRef" />
    <ConfirmModal ref="confirmModalRef" />
</template>

<style scoped>

</style>