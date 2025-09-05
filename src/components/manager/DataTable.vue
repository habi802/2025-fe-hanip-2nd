<script setup>
import { ref, computed, watch, reactive } from 'vue';

const props = defineProps({
    title: String,
    items: Array,
    field: Array
});

// 체크박스 컬럼 정의
const checkboxField = { key: 'selected', label: '', sortable: false };

// title에 따라 체크박스 컬럼이 추가되는지 결정
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

// 행 클릭 시 선택한 행 item의 id를 부모 컴포넌트로 전달
const emit = defineEmits(['row-selected']);
const rowClicked = item => {
    console.log(item);
    emit('row-selected', item);
};
</script>

<template>
    <b-table :items="props.items" :fields="computedFields" @row-clicked="rowClicked" bordered hover>
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
            <span v-if="row.item.providerType === '01'" class="badge bg-dark">일반</span>
            <span v-else-if="row.item.providerType === '02'" class="badge bg-kakao">카카오</span>
            <span v-else-if="row.item.providerType === '03'" class="badge bg-naver">네이버</span>
        </template>

        <!-- 회원 분류 컬럼 커스텀 -->
        <template #cell(role)="row">
            <span v-if="row.item.role === '01'" class="badge bg-success">고객</span>
            <span v-else-if="row.item.role === '02'" class="badge bg-owner">사장</span>
            <span v-else-if="row.item.role === '03'" class="badge bg-primary">배달원</span>
        </template>

        <!-- 가게 활성화 여부 컬럼 커스텀 -->
        <template #cell(isActive)="row">
            <span v-if="row.item.isActive === 0" class="badge bg-danger">비활성화</span>
            <span v-else-if="row.item.isActive === 1" class="badge bg-primary">활성화</span>
        </template>

        <!-- 사장 답변 등록 여부 컬럼 커스텀 -->
        <template #cell(ownerComment)="row">
            <span v-if="row.item.ownerComment === 0" class="badge bg-danger">미등록</span>
            <span v-else-if="row.item.ownerComment === 1" class="badge bg-primary">등록</span>
        </template>

        <!-- 리뷰 숨김 여부 컬럼 커스텀 -->
        <template #cell(isHide)="row">
            <span v-if="row.item.isHide === 0" class="badge bg-success">공개</span>
            <span v-else-if="row.item.isHide === 1" class="badge bg-dark">숨김</span>
        </template>

        <!-- 관리자 답변 등록 여부 컬럼 커스텀 -->
        <template #cell(managerComment)="row">
            <span v-if="row.item.managerComment === 0" class="badge bg-danger">미등록</span>
            <span v-else-if="row.item.managerComment === 1" class="badge bg-primary">등록</span>
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