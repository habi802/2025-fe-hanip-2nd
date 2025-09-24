<script setup>
const props = defineProps({
    address: Object,
    currentAddressId: Number,
});

// 이벤트 전달
const emit = defineEmits(['set-main-address', 'edit', 'remove-address']);

// 기본 주소 변경
const setMainAddress = () => emit('set-main-address', props.address.id);

// 주소 수정 창 열기
const editAddress = () => emit('edit-address', { ...props.address });

// 주소 삭제
const removeAddress = () => emit('remove-address', props.address.id);
</script>

<template>
    <div class="address-card" :class="{ active: address.isMain === 1 }">
        <div class="card-header">
            <h3 class="card-title">{{ address.title }}</h3>
            <button class="current-btn" :class="{ active: address.isMain === 1 }" @click="setMainAddress">
                {{ address.isMain === 1 ? '기본 주소' : '기본 주소로 설정' }}
            </button>
        </div>
        <p>{{ address.postcode }}</p>
        <p>{{ address.address }}</p>
        <p>{{ address.addressDetail }}</p>
        <div class="card-actions">
            <button class="primary-btn" @click="editAddress">수정</button>
            <button class="secondary-btn" @click="removeAddress">삭제</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// 카드 노출 형태
.address-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    justify-items: center; // 가운데 정렬
    margin-bottom: 5rem;
}

// 카드 전체 스타일
.address-card {
    width: 100%;
    max-width: 700px;
    border: 1px solid #797979;
    border-radius: 20px;
    padding: 1.5rem;
    background: #fff;
    position: relative;
    transition: border 0.2s, box-shadow 0.2s;

    &.active {
        border-color: #ff6666;
    }

    // 카드 헤더
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        // 카드 주소지 타이틀
        .card-title {
            font-size: 24px;
            font-weight: 600;
        }

        // 현재 주소지 설정 버튼
        .current-btn {
            width: 250px;
            height: 40px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            border: 1px solid #ff6666;
            background-color: white;
            color: #ff6666;
            transition: all 0.15s;

            &:hover {
                background-color: #ffe6e6;
            }

            &.active {
                background-color: #ff6666;
                color: white;
                border: none;
            }
        }
    }

    // 상세 주소지
    p {
        font-size: 20px;
        margin-bottom: 10px;
    }

    // 수정 삭제 버튼
    .card-actions {
        margin-top: 1rem;
        display: flex;
        justify-content: flex-end;
        gap: 10px;

        .primary-btn {
            width: 100px;
            height: 40px;
            background-color: #ff6666;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;

            &:hover {
                background-color: darken(#ff6666, 5%);
            }
        }

        .secondary-btn {
            width: 100px;
            height: 40px;
            background-color: white;
            color: #ff6666;
            border: 1.5px solid #ff6666;
            border-radius: 8px;
            cursor: pointer;

            &:hover {
                background-color: #ffe6e6;
            }
        }
    }
}
</style>
