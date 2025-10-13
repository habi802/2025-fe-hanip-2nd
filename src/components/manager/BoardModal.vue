<script setup>
import { computed, defineExpose, ref } from 'vue';
import defaultImage from "@/imgs/owner/haniplogo_sample4.png";

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
    },
    hide() {
        show.value = false;
    }
});

const emit = defineEmits(['set-item-status']);

const setItemStatus = (id, status, newStatus) => {
    if (props.title === 'store') {
        emit('set-item-status', { id, isActive: status, newIsActive: newStatus });
    } else if (props.title === 'order') {
        emit('set-item-status', { id, status, newStatus });
    } else {
        emit('set-item-status', { id, isHide: status, newIsHide: newStatus });
    }
};

const baseUrl = import.meta.env.VITE_BASE_URL;

// 이미지 표시
const showImage = (title, image) => {
    return image !== undefined && image !== null && image !== ''
        ? `${baseUrl}/images/${title}/${props.item.id}/${image}`
        : defaultImage;
};
</script>

<template>
    <b-modal v-model="show" :title="`${props.title === 'store' ? '가게' : (props.title === 'order' ? '주문' : '리뷰')} 정보`" size="lg" hide-footer centered scrollable @shown="onModalShown">
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
                    <b-col cols="3"><strong>소재지</strong></b-col>
                    <b-col cols="9">{{ isExistItem ? props.item.address : '' }}</b-col>
                </b-row>
                <b-row>
                    <b-col cols="3"><strong>카테고리</strong></b-col>
                    <b-col cols="9">{{ isExistItem ? props.item.categories.join(', ') : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="6"><strong>가게 이미지</strong></b-col>
                    <b-col cols="6"><strong>사업자 등록증</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="6" class="content">
                        
                    </b-col>
                    <b-col cols="6" class="content">
                        <template v-if="isExistItem">
                            <img :src="showImage('user', props.item.licensePath)" :alt="`${props.item.name}의 사업자 등록증 이미지`" />
                        </template>
                        <template v-else>

                        </template>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12"><strong>가게 배너 이미지</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="content">

                    </b-col>
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
                    <b-col cols="9">{{ isExistItem
                        ? ((props.item.minDeliveryFee === undefined || props.item.minDeliveryFee === 0) && (props.item.maxDeliveryFee === undefined || props.item.maxDeliveryFee === 0) ? '0원' : `${props.item.minDeliveryFee.toLocaleString()} ~ ${props.item.maxDeliveryFee.toLocaleString()}원`)
                        : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12"><strong>메뉴</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="content">

                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12"><strong>이벤트 공지</strong></b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="content">{{ isExistItem ? (props.item.eventComment || '-') : '' }}</b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" class="d-flex justify-content-center">
                        <button class="btn btn-success me-2" @click="setItemStatus(props.item[props.idKey], props.item.isActive, 1)" :disabled="!isExistItem || props.item.isActive === 1">영업 승인</button>
                        <button class="btn btn-secondary" @click="setItemStatus(props.item[props.idKey], props.item.isActive, 0)" :disabled="!isExistItem || props.item.isActive === 0">영업 대기</button>
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
                    <b-col cols="12" class="content">

                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="3"><strong>주문 상태</strong></b-col>
                    <b-col cols="3">
                        <template v-if="isExistItem">
                            <span v-if="props.item.status === '01'" class="badge bg-secondary fs-6">미결제</span>
                            <span v-else-if="props.item.status === '02'" class="badge bg-success fs-6">결제 완료</span>
                            <span v-else-if="props.item.status === '03'" class="badge bg-warning fs-6">음식 준비중</span>
                            <span v-else-if="props.item.status === '04'" class="badge bg-info fs-6">배달중</span>
                            <span v-else-if="props.item.status === '05'" class="badge bg-primary fs-6">배달 완료</span>
                            <span v-else-if="props.item.status === '06'" class="badge bg-danger fs-6">주문 취소</span>
                        </template>
                    </b-col>
                    <b-col cols="3"><strong>결제 수단</strong></b-col>
                    <b-col cols="3">
                        <template v-if="isExistItem">
                            <span v-if="props.item.payment === '01'" class="badge bg-secondary fs-6">미결제</span>
                            <span v-else-if="props.item.payment === '02'" class="badge bg-kakao fs-6">카카오페이</span>
                            <span v-else-if="props.item.payment === '03'" class="badge bg-naver fs-6">네이버페이</span>
                        </template>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" class="d-flex justify-content-center">
                        <button class="btn btn-danger me-2" @click="setItemStatus(props.item[props.idKey], 1)" :disabled="!isExistItem || props.item.status === '06'">주문 취소</button>
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
                    <b-col cols="12" class="content">

                    </b-col>
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
                        <button class="btn btn-danger me-2" @click="setItemStatus(props.item[props.idKey], props.item.isHide, 1)" :disabled="!isExistItem || props.item.isHide === 1">리뷰 숨기기</button>
                        <button class="btn btn-secondary" @click="setItemStatus(props.item[props.idKey], props.item.isHide, 0)" :disabled="!isExistItem || props.item.isHide === 0">숨김 해제</button>
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

/* 결제 수단 스타일 */
.bg-kakao {
    background-color: #F9E000 !important;
    color: black;
}

.bg-naver {
    background-color: #00B074;
    color: white;
}
</style>