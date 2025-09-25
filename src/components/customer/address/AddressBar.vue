<script setup>
import { ref } from 'vue';

const searchAddress = ref('');

const emit = defineEmits(['create-address']);

const createAddress = () => {
    emit('create-address', searchAddress.value);
};
</script>

<template>
    <div class="address-bar">
        <div class="container">
            <!-- 검색 input -->
            <div class="search-wrapper">
                <img src="@/imgs/location.png" alt="검색" class="search-icon" />
                <input type="text" v-model="searchAddress" class="search-input" placeholder="지번, 도로명, 건물명으로 검색" />
            </div>

            <!-- 현재 위치 버튼 -->
            <button class="location-btn" @click="createAddress">
                주소 추가
                <img src="@/imgs/gps.png" alt="위치" class="location-icon" />
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@font-face {
    font-family: "Pretendard-Regular";
    src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
        format("woff");
    font-weight: 400;
    font-style: normal;
}

* {
    font-family: "Pretendard-Regular";
    font-size: 20px;
}

.address-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;

    .container {
        display: flex;
        align-items: center;
    }

    /* 검색 input 래퍼 */
    .search-wrapper {
        position: relative;
        flex: 1;
        width: 1000px;
        margin-right: 20px;

        .search-icon {
            position: absolute;
            left: 30px;
            top: 50%;
            transform: translateY(-50%);
            width: 24px;
            height: 30px;
            pointer-events: none; // 아이콘 클릭 시 input이 클릭되도록
        }

        .search-input {
            width: 100%;
            height: 60px;
            padding: 0.75rem 1rem 0.75rem 50px; // 왼쪽 padding 넉넉히
            border: 2px solid #ff6666;
            border-radius: 20px;
            text-align: center;

            &::placeholder {
                color: #ff6666;
            }
        }
    }

    /* 현재 위치 버튼 */
    .location-btn {
        height: 60px;
        width: 200px;
        background-color: #ff6666;
        color: #fff;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px; // 버튼 텍스트와 아이콘 사이 간격

        .location-icon {
            width: 24px;
            height: 24px;
        }

        &:hover {
            background-color: darken(#ff6666, 5%);
        }
    }
}
</style>
