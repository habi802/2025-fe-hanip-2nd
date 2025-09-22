<script setup>
import { ref } from 'vue';
import { useOwnerStore } from '@/stores/account';
import defaultImage from '@/imgs/owner/owner-service2.png';

const owner = useOwnerStore();

const props = defineProps({
    form: Object
});

const emit = defineEmits(['update-form']);

const storeImageFileInput = ref(null);
const storePreviewImage = ref(defaultImage);

// 가게 이미지 미리보기 div 클릭 시 보이지 않게 해놓은 input을 강제로 클릭하게 하여 파일 첨부하는 창 열리게 함
const selectStoreImageFile = () => {
    storeImageFileInput.value?.click();
};

// 이미지 파일 선택 시 가게 이미지 미리보기가 바뀌게 하는 함수
const changeStoreImageFile = e => {
    const file = e.target.files[0];
    if (file) {
        storePreviewImage.value = URL.createObjectURL(file);
        updateForm('imagePath', file);
    }
};

// 부모 컴포넌트(StatusStore.vue)에 입력한 값 전달
const updateForm = (key, value) => {
    emit('update-form', { ...props.form, [key]: value })
}
</script>

<template>
    <form>
        <div class="store-info-wrap1">
            <span>대표자 이름</span>
            <div class="gray-content">{{ owner.state.storeData.ownerName }}</div>
            <span>가게 상호명</span>
            <div class="gray-content">{{ owner.state.storeData.name }}</div>
            <span>사업자 등록번호</span>
            <div class="gray-content">{{ owner.state.storeData.businessNumber }}</div>
            <span>가게 주소</span>
                <div class="address-box gray-content">
                    {{ `${owner.state.storeData.postCode}, ${owner.state.storeData.address + (owner.state.storeData.addressDetail ? ', ' + owner.state.storeData.addressDetail : '')}` }}
                </div>
            <span>가게 전화</span>
            <div class="call-box d-flex gap-2">
                <select v-model="props.form.tel1" @change="updateForm('tel1', $event.target.value)" class="gray-content">
                    <option>02</option>
                    <option>053</option> 
                    <option>010</option>
                </select>
                <input v-model="props.form.tel2" @input="updateForm('tel2', $event.target.value)" class="gray-content"></input> 
                <input v-model="props.form.tel3" @input="updateForm('tel3', $event.target.value)" class="gray-content"></input>
            </div>

            <span>업종</span>
            <select multiple class="gray-content">
                <option value="01">한식</option>
                <option value="02">중식</option>
                <option value="03">일식</option>
                <option value="04">양식</option>
                <option value="05">디저트</option>
                <option value="06">분식</option>
                <option value="07">패스트푸드</option>
                <option value="08">아시안</option>
                <option value="09">치킨</option>
                <option value="10">피자</option>
                <option value="11">야식</option>
            </select>
        </div>

        <div class="store-info-wrap2">
            <span>가게 대표 이미지</span>
            <div class="store-image" @click="selectStoreImageFile">
                <template v-if="storePreviewImage">
                    <img :src="storePreviewImage" @error="e => e.target.src = defaultImage" alt="가게 대표 이미지 미리보기" />
                </template>
                <template v-else>
                    이미지를 등록하세요
                </template>
            </div>
            <input id="imgInput" ref="storeImageFileInput" type="file" accept="image/*" @change="changeStoreImageFile" style="display: none" />
            <span>가게 소개글</span>
            <div class="store-comment-wrapper">
                <textarea class="store-comment p-2" v-model="props.form.comment" @input="updateForm('comment', $event.target.value)"></textarea>
                <span class="store-comment-placeholder" v-if="!props.form.comment">
                    최대 200자 이하<br/>
                    짧은 홍보 문구를 작성해보세요!
                </span>
            </div>
        </div>
    </form>
</template>

<style scoped lang="scss">
form {
    display: flex;
    gap: 50px;
}

.store-info-wrap1 {
    display: grid;
    grid-template-columns: 100px 620px;
    align-items: center;
    gap: 20px;

    .call-box {
        display: flex;
    }
}

.store-info-wrap2 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .address-box {
        display: flex;
        flex-direction: column;
    }

    .store-image {
        width: 420px;
        height: 230px;
        cursor: pointer;
        background-color: #E8E8E8;
        border-radius: var(--card-lg-radius);
        border: none;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: var(--card-lg-radius);
        }
    }

    .store-comment-wrapper {
        position: relative;
        height: 150px;

        .store-comment {
            border-radius: var(--card-lg-radius);
            border: 1px solid var(--grey2);
            width: 100%;
            height: 100%;
        }

        .store-comment-placeholder {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            color: #999;
            text-align: center;
        }
    }
}
</style>