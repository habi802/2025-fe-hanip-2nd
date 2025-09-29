<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    title: String,
    items: Array,
    field: Array,
    idKey: { type: String, default: 'id' }
});

// 체크박스 컬럼 정의
const checkboxField = { key: 'selected', label: '', sortable: false };

// title에 따라 체크박스 컬럼이 추가되는지 결정(유저 빼고 다 있을듯)
const computedFields = computed(() => {
    if (props.title !== 'user') {
        return [checkboxField, ...props.field];
    }
    return props.field;
});

// 체크박스 전체 선택/해제
const allSelected = ref(false);
const toggleSelectAll = () => {
    allSelected.value = !allSelected.value
    props.items.forEach(item => (item._checked = allSelected.value))
};

const emit = defineEmits(['row-selected', 'row-selected']);

// 체크된 항목을 부모 컴포넌트로 전달
const emitSelectedItems = () => {
    const checkedItems = props.items.filter(item => item._checked).map(item => {
        if (props.title === 'store') {
            return { id: item[props.idKey], isActive: item.isActive };
        } else if (props.title === 'order') {
            return { id: item[props.idKey], status: item.status };
        } else {
            return { id: item[props.idKey], isHide: item.isHide };
        }
    });
    emit('row-checked', checkedItems)
}

// 테이블 안 항목들의 체크박스 상태가 바뀔 때마다 실행
watch(
    () => props.items.map(i => i._checked),
    () => {
        emitSelectedItems()
    },
    { deep: true }
)

// 행 클릭 시 선택한 행 item의 id를 부모 컴포넌트로 전달
const rowClicked = item => {
    emit('row-selected', item);
};
</script>

<template>
    <b-table :items="props.items" :fields="computedFields" @row-clicked="rowClicked" show-empty bordered hover>
        <template #empty>
            <div class="text-center py-3">데이터가 없습니다.</div>
        </template>

        <!-- 체크박스 컬럼 헤더 (전체 선택) -->
        <template #head(selected)>
            <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
        </template>

        <!-- 체크박스 셀 -->
        <template #cell(selected)="row">
            <input type="checkbox" v-model="row.item._checked" />
        </template>

        <!-- 가입 유형 컬럼 커스텀 -->
        <template #cell(providerType)="row">
            <span v-if="row.item.providerType === '01'" class="badge bg-dark fs-6">일반</span>
            <span v-else-if="row.item.providerType === '02'" class="badge bg-kakao fs-6">카카오</span>
            <span v-else-if="row.item.providerType === '03'" class="badge bg-naver fs-6">네이버</span>
        </template>

        <!-- 회원 분류 컬럼 커스텀 -->
        <template #cell(role)="row">
            <span v-if="row.item.role === '01'" class="badge bg-success fs-6">고객</span>
            <span v-else-if="row.item.role === '02'" class="badge bg-owner fs-6">사장</span>
            <span v-else-if="row.item.role === '03'" class="badge bg-primary fs-6">배달원</span>
        </template>

        <!-- 가게 영업 승인 상태 컬럼 커스텀 -->
        <template #cell(isActive)="row">
            <span v-if="row.item.isActive === 0" class="badge bg-danger fs-6">대기</span>
            <span v-else-if="row.item.isActive === 1" class="badge bg-success fs-6">완료</span>
        </template>

        <!-- 주문 상태 컬럼 커스텀 -->
        <template #cell(status)="row">
            <span v-if="row.item.status === '01'" class="badge bg-secondary fs-6">미결제</span>
            <span v-else-if="row.item.status === '02'" class="badge bg-success fs-6">결제 완료</span>
            <span v-else-if="row.item.status === '03'" class="badge bg-warning fs-6">음식 준비중</span>
            <span v-else-if="row.item.status === '04'" class="badge bg-info fs-6">배달중</span>
            <span v-else-if="row.item.status === '05'" class="badge bg-primary fs-6">배달 완료</span>
            <span v-else-if="row.item.status === '06'" class="badge bg-danger fs-6">주문 취소</span>
        </template>

        <!-- 결제 수단 컬럼 커스텀 -->
        <template #cell(payment)="row">
            <span v-if="row.item.payment === '01'" class="badge bg-secondary fs-6">미결제</span>
            <span v-else-if="row.item.payment === '02'" class="badge bg-kakao fs-6">카카오페이</span>
            <span v-else-if="row.item.payment === '03'" class="badge bg-naver fs-6">네이버페이</span>
        </template>

        <!-- 고객 주문 내역 삭제 상태 컬럼 커스텀 -->
        <template #cell(isDeleted)="row">
            <span v-if="row.item.isDeleted === 0" class="badge bg-success fs-6">정상</span>
            <span v-else-if="row.item.isDeleted === 1" class="badge bg-danger fs-6">삭제됨</span>
        </template>

        <!-- 사장 답변 등록 여부 컬럼 커스텀 -->
        <template #cell(ownerComment)="row">
            <span v-if="row.item.ownerComment === 0" class="badge bg-danger fs-6">미등록</span>
            <span v-else-if="row.item.ownerComment === 1" class="badge bg-primary fs-6">등록</span>
        </template>

        <!-- 리뷰 숨김 여부 컬럼 커스텀 -->
        <template #cell(isHide)="row">
            <span v-if="row.item.isHide === 0" class="badge bg-success fs-6">공개</span>
            <span v-else-if="row.item.isHide === 1" class="badge bg-dark fs-6">숨김</span>
        </template>
    </b-table>
</template>

<style scoped>
/* 가입 유형 스타일 */
.bg-kakao {
    background-color: #F9E000 !important;
    color: black;
}

.bg-naver {
    background-color: #00B074;
    color: white;
}

/* 회원 분류 스타일 */
.bg-owner {
    background-color: #0100FF;
    color: white;
}
</style>