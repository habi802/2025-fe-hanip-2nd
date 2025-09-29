<script setup>
import { computed, defineExpose, ref } from 'vue';

const props = defineProps({
    title: String,
    item: Object,
    idKey: { type: String, default: 'id' }
});

const show = ref(false);

const isExistItem = computed(() => Object.keys(props.item).length > 0);

defineExpose({
    open() {
        show.value = true;
    }
});

const emit = defineEmits(['set-item-status']);

const setItemStatus = (id, status) => {
    emit('set-item-status', { id, status });
};
</script>

<template>
    <b-modal v-model="show" :title="`${props.title === 'store' ? '가게' : (props.title === 'order' ? '주문' : '리뷰')} 정보`" size="lg" hide-footer centered>
        <b-card class="border-0" body-class="pt-0">
            <!-- 가게 상세 조회 -->
            <template v-if="props.title === 'store'">
                <b-row>
                    <b-col cols="3"><strong>상호명</strong></b-col>
                    <b-col cols="3">{{ isExistItem ? props.item.name : '' }}</b-col>
                    <b-col cols="3"><strong>대표자명</strong></b-col>
                    <b-col cols="3">{{ isExistItem ? props.item.ownerName : '' }}</b-col>
                </b-row>
                <b-row>
                    <b-col cols="3"><strong>개업연월일</strong></b-col>
                    <b-col cols="9">{{ isExistItem ? props.item.openDate : '' }}</b-col>
                </b-row>
                <b-row>
                    <b-col cols="3"><strong>사업자 등록 번호</strong></b-col>
                    <b-col cols="9">{{ isExistItem ? props.item.businessNumber : '' }}</b-col>
                </b-row>
                <b-row>
                    <b-col cols="3"><strong>카테고리</strong></b-col>
                    <b-col cols="9">{{ isExistItem ? props.item.categories.join(', ') : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12"><strong>가게 이미지</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="content">{{ isExistItem ? '가게 이미지' : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12"><strong>가게 소개</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="content">{{ isExistItem ? (props.item.comment || '-') : '' }}</b-col>
                </b-row>
                
                <b-row>
                    <b-col cols="3"><strong>영업 승인</strong></b-col>
                    <b-col cols="3">
                        <template v-if="isExistItem">
                            <span v-if="props.item.isActive === 0" class="badge bg-danger fs-6">대기</span>
                            <span v-else-if="props.item.isActive === 1" class="badge bg-success fs-6">완료</span>
                        </template>
                    </b-col>
                    <b-col cols="3"><strong>금일 영업</strong></b-col>
                    <b-col cols="3">{{ isExistItem ? (props.item.isOpen === 0 ? '준비중' : '영업중') : '' }}</b-col>
                </b-row>
                <b-row>
                    <b-col cols="3"><strong>영업 시간</strong></b-col>
                    <b-col cols="9">{{ isExistItem ? `${props.item.openTime} ~ ${props.item.closeTime}` : '' }}</b-col>
                </b-row>
                <b-row>
                    <b-col cols="3"><strong>최소 주문 금액</strong></b-col>
                    <b-col cols="3">{{ isExistItem ? `${props.item.minAmount.toLocaleString()}원` : '' }}</b-col>
                    <b-col cols="3"><strong>포장 주문</strong></b-col>
                    <b-col cols="3">{{ isExistItem ? (props.item.isPickUp === 0 ? '불가' : '가능') : '' }}</b-col>
                </b-row>
                <b-row>
                    <b-col cols="3"><strong>배달료</strong></b-col>
                    <b-col cols="9">{{ isExistItem ? `${props.item.minDeliveryFee.toLocaleString()} ~ ${props.item.maxDeliveryFee.toLocaleString()}원` : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12"><strong>메뉴</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="content">{{ isExistItem ? '가게 메뉴' : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12"><strong>이벤트 공지</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="content">{{ isExistItem ? (props.item.eventComment || '-') : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" class="d-flex justify-content-center">
                        <button class="btn btn-success me-2" @click="setItemStatus(props.item[props.idKey], 1)" :disabled="!isExistItem">영업 승인</button>
                        <button class="btn btn-secondary" @click="setItemStatus(props.item[props.idKey], 0)" :disabled="!isExistItem">영업 대기</button>
                    </b-col>
                </b-row>
            </template>

            <!-- 주문 상세 조회 -->
            <template v-else-if="props.title === 'order'">
                <b-row>
                    <b-col cols="3"><strong>주문일</strong></b-col>
                    <b-col cols="9">{{ isExistItem ? props.item.createdAt : '' }}</b-col>
                </b-row>
                <b-row>
                    <b-col cols="3"><strong>주문자명</strong></b-col>
                    <b-col cols="3">{{ isExistItem ? props.item.userName : '' }}</b-col>
                    <b-col cols="3"><strong>상호명</strong></b-col>
                    <b-col cols="3">{{ isExistItem ? props.item.storeName : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12"><strong>메뉴</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="content">{{ isExistItem ? '주문 메뉴' : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="3"><strong>주문 상태</strong></b-col>
                    <b-col cols="3">{{ isExistItem ? props.item.status : '' }}</b-col>
                    <b-col cols="3"><strong>결제 수단</strong></b-col>
                    <b-col cols="3">{{ isExistItem ? props.item.payment : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" class="d-flex justify-content-center">
                        <button class="btn btn-danger me-2" @click="setItemStatus(props.item[props.idKey], 1)" :disabled="!isExistItem">주문 취소</button>
                    </b-col>
                </b-row>
            </template>

            <!-- 리뷰 상세 조회 -->
            <template v-else>
                <b-row>
                    <b-col cols="3"><strong>작성일</strong></b-col>
                    <b-col cols="3">{{ isExistItem ? props.item.createdAt : '' }}</b-col>
                    <b-col cols="3"><strong>작성자</strong></b-col>
                    <b-col cols="3">{{ isExistItem ? props.item.userName : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12"><strong>이미지</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="content">{{ isExistItem ? '리뷰 이미지' : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12"><strong>내용</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="content">{{ isExistItem ? props.item.comment : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12"><strong>답변</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="content">{{ isExistItem ? props.item.ownerComment : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" class="d-flex justify-content-center">
                        <button class="btn btn-danger me-2" @click="setItemStatus(props.item[props.idKey], 1)" :disabled="!isExistItem">리뷰 숨기기</button>
                        <button class="btn btn-secondary" @click="setItemStatus(props.item[props.idKey], 0)" :disabled="!isExistItem">숨김 해제</button>
                    </b-col>
                </b-row>
            </template>
        </b-card>
    </b-modal>
</template>

<style lang="scss" scoped>
.card {
    .row {
        border-left: 1px solid #dee2e6;
        border-bottom: 1px solid #dee2e6;

        &:first-child {
            border-top: 1px solid #dee2e6;
        }

        > div {
            border-right: 1px solid #dee2e6;
            padding: 0.5rem;
        }
    }
}

.content {
    min-height: 180px;
}
</style>