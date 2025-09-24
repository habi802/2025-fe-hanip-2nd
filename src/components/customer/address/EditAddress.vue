<script setup>
import { watch, nextTick, reactive } from "vue";
import { useGeocodeStore } from "@/stores/geocode";

const geocode = useGeocodeStore();

const props = defineProps({
    isShow: Boolean,
    form: Object,
    mode: { type: String, default: 'add' }
});

const emit = defineEmits(['save-address', 'close-modal']);

let lat;
let lng;
let map = null; // 지도를 띄우기 위한 변수
let marker = null; // 지도에 마커를 찍기 위한 변수

// 모달이 열릴 때(props.isShow가 true로 바뀔 때)마다 입력한 주소(props.form.address)의 위치를 지도에 표시
watch(
    () => props.isShow,
    (newVal) => {
        if (newVal) {
            setErrorsTitle();
            setErrorsAddress();

            nextTick(async () => {
                try {
                    const geocodeRes = await geocode.fetchCoordinates(props.form.address);
                    if (geocodeRes !== undefined) {
                        if (props.mode === 'add') {
                            props.form.postcode = geocodeRes.postcode;
                            props.form.address = geocodeRes.roadAddress;
                        }
                        lat = geocodeRes.lat;
                        lng = geocodeRes.lng;

                        showMap(lat, lng);
                    }
                } catch (err) {
                    document.querySelector('#map').innerHTML = '<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background-color: #E8E8E8; border-radius: 12px;">지도를 불러올 수 없습니다.</div>';
                }
            });
        }
    }
);

// 지도 그리는 함수
const showMap = (latitude, longitude) => {
    map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(latitude, longitude),
        zoom: 16,
    });

    marker = new naver.maps.Marker({
        map,
        position: map.getCenter()
    });
}

// 모달 창에서 입력한 주소의 위치 표시
const markWithAddress = async address => {
    const geocodeRes = await geocode.fetchCoordinates(address);
    if (geocodeRes !== undefined) {
        const position = new naver.maps.LatLng(geocodeRes.lat, geocodeRes.lng);

        if (map instanceof naver.maps.Map) {
            map.setCenter(position);
            marker.setPosition(position);     
        } else {
            showMap(geocodeRes.lat, geocodeRes.lng);
        }
    }
};

// 주소 검색
const searchAddress = () => {
    new window.daum.Postcode({
        oncomplete: (data) => {
            // 주소 값 채우고 상세 주소 입력값에 포커스
            props.form.postcode = data.zonecode;
            props.form.address = data.roadAddress;
            document.querySelector("input[placeholder='상세 주소']").focus();

            // 지도에 검색된 주소 표시
            markWithAddress(data.roadAddress);

            setErrorsAddress();
        },
    }).open();
};

// 유효성 검사 관련 변수 및 함수들
const errors = reactive({
    title: false,
    postcode: false,
    address: false
});

const setErrorsTitle = () => {
    errors.title = false;
}

const setErrorsAddress = () => {
    errors.postcode = false;
    errors.address = false;
}

// 주소 추가 및 수정
const saveAddress = () => {
    errors.title = !props.form.title;
    errors.postcode = !props.form.postcode;
    errors.address = !props.form.address;

    if (errors.title || errors.postcode || errors.address) {
        return;
    }

    emit('save-address', { ...props.form, mode: props.mode });
};
</script>

<template>
    <div v-if="props.isShow" class="modal-overlay">
        <div class="modal-content">
            <!-- 모드에 따라 제목 변경 -->
            <h2>{{ props.mode === 'edit' ? '주소 수정' : '주소 추가' }}</h2>

            <!-- 지도 영역 -->
            <div id="map"></div>

            <!-- 주소 입력 -->
            <div class="input-wrapper">
                <input v-model="props.form.title" :class="{ 'input-error': errors.title }" placeholder="주소 제목" @input="setErrorsTitle" />
                <p v-if="errors.title" class="error-text">주소 제목을 입력하세요.</p>
            </div>
            <div class="postcode-wrapper">
                <input v-model="props.form.postcode" class="postcode-input" :class="{ 'input-error': errors.postcode }" placeholder="우편번호" readonly />
                <button @click="searchAddress" class="location-btn">주소 검색</button>
            </div>
            <div class="input-wrapper">
                <input v-model="props.form.address" :class="{ 'input-error': errors.address }" placeholder="주소" readonly />
                <p v-if="errors.postcode || errors.address" class="error-text">찾으시는 주소를 검색하여 입력하세요.</p>
            </div>
            <input v-model="props.form.addressDetail" placeholder="상세 주소" />

            <!-- 안내 문구 -->
            <span>
                입력된 공동 현관 비밀 번호는 원활한 배달을 위해 필요한 정보로, 배달을 진행하는
                라이더와 사장님께만 전달됩니다.
            </span>

            <!-- 버튼 영역 -->
            <div class="modal-actions">
                <button class="cancle-btn" @click="$emit('close-modal')">취소</button>
                <button class="save-btn" @click="saveAddress">
                    {{ props.mode === 'edit' ? '수정' : '추가' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#map {
    width: 700px;
    height: 350px;
    border-radius: 12px;
    margin-bottom: 20px;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;

    h2 {
        text-align: center;
        font-size: 25px;
        font-weight: 600;
        margin-bottom: 20px;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 20px;
        width: 800px;
        height: 850px;
        display: flex;
        flex-direction: column;
        align-items: center;

        input:not(.postcode-input) {
            width: 700px;
            height: 60px;
            border: 1px solid #c8c8c8;
            margin-bottom: 20px;
            border-radius: 8px;
            padding: 15px 15px;

            &.input-error {
                border: 1px solid red;
            }
        }

        input:read-only {
            background-color: #f5f5f5;
            cursor: default;
            pointer-events: none;
            color: #7d7d7d;

            &.input-error {
                border: 1px solid red;
            }
        }

        .location-btn {
            width: 130px;
            height: 60px;
            background-color: white;
            color: #ff6666;
            border: 1.5px solid #ff6666;
            border-radius: 8px;
            cursor: pointer;

            &:hover {
                background-color: #ffe6e6;
            }
        }

        .modal-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;
            gap: 30px;

            .cancle-btn {
                width: 330px;
                height: 70px;
                background-color: #ff6666;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;

                &:hover {
                    background-color: darken(#ff6666, 5%);
                }
            }

            .save-btn {
                width: 330px;
                height: 70px;
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

    span {
        width: 700px;
        color: #bcbcbc;
        font-weight: 600;
        font-size: 20px;
    }
}

.error-text {
    color: #ff6666;
    font-size: 13px;
    margin-top: -15px;
    margin-bottom: 0.5rem;
}

.postcode-wrapper {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .postcode-input {
        width: 560px;
        height: 60px;
        border: 1px solid #c8c8c8;
        border-radius: 8px;
        padding: 15px;
    }

    .location-btn {
        width: 130px;
        height: 60px;
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
</style>
