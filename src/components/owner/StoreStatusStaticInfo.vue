<script setup>
import { ref, computed, onMounted } from 'vue';
import { useOwnerStore } from '@/stores/account';
import defaultImage from '@/imgs/owner/owner-service2.png';

const owner = useOwnerStore();

const props = defineProps({
    form: Object
});

const emit = defineEmits(['update-form']);

const baseUrl = import.meta.env.VITE_BASE_URL;

const storeImageFileInput = ref(null);
const storePreviewImage = ref(`${baseUrl}/images/store/${owner.state.storeData.id}/${props.form.imagePath}`);

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

const selectedCategory = ref([]);
const showCategoryDropdown = ref(false);

// 카테고리 option 선택
function toggleCategoryItem(option) {
    const idx = selectedCategory.value.indexOf(option);
    if (idx === -1) {
        selectedCategory.value.push(option);
    } else {
        selectedCategory.value.splice(idx, 1);
    }

    updateForm('categories', [...sortedSelectedCategory.value]);
}

const categoryOption = ['한식', '중식', '일식', '양식', '디저트', '분식', '패스트푸드', '아시안', '치킨', '피자', '야식'];

// 선택한 카테고리 정렬
const sortedSelectedCategory = computed(() => categoryOption.filter(option => selectedCategory.value.includes(option)));

// 백엔드에서 받아 온 가게의 카테고리를 selectedCategory에 넣음
onMounted(() => {
    selectedCategory.value = props.form.categories.filter(val => categoryOption.includes(val));
});

// 부모 컴포넌트(StatusStore.vue)에 입력한 값 전달
const updateForm = (key, value) => {
    emit('update-form', { ...props.form, [key]: value });
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
            <div class="gray-content select-category">
                <input type="text" :value="sortedSelectedCategory.join(', ')" @click="showCategoryDropdown = !showCategoryDropdown" readonly />
                <ul v-if="showCategoryDropdown" class="select-category-dropdown">
                    <li @click="toggleCategoryItem('한식')" :class="{ selected: selectedCategory.includes('한식') }">한식</li>
                    <li @click="toggleCategoryItem('중식')" :class="{ selected: selectedCategory.includes('중식') }">중식</li>
                    <li @click="toggleCategoryItem('일식')" :class="{ selected: selectedCategory.includes('일식') }">일식</li>
                    <li @click="toggleCategoryItem('양식')" :class="{ selected: selectedCategory.includes('양식') }">양식</li>
                    <li @click="toggleCategoryItem('디저트')" :class="{ selected: selectedCategory.includes('디저트') }">디저트</li>
                    <li @click="toggleCategoryItem('분식')" :class="{ selected: selectedCategory.includes('분식') }">분식</li>
                    <li @click="toggleCategoryItem('패스트푸드')" :class="{ selected: selectedCategory.includes('패스트푸드') }">패스트푸드</li>
                    <li @click="toggleCategoryItem('아시안')" :class="{ selected: selectedCategory.includes('아시안') }">아시안</li>
                    <li @click="toggleCategoryItem('치킨')" :class="{ selected: selectedCategory.includes('치킨') }">치킨</li>
                    <li @click="toggleCategoryItem('피자')" :class="{ selected: selectedCategory.includes('피자') }">피자</li>
                    <li @click="toggleCategoryItem('야식')" :class="{ selected: selectedCategory.includes('야식') }">야식</li>
                </ul>
            </div>
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

    .select-category {
        position: relative;
    }

    .select-category input {
        width: 100%;
        border: none;
        outline: none;
        box-shadow: none;
        cursor: pointer;
    }

    .select-category-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        border: 1px solid #ccc;
        background: white;
        list-style: none;
        margin: 0;
        padding: 0;
        max-height: 150px;
        overflow-y: auto;
        z-index: 10;
    }

    .select-category-dropdown li {
        padding: 5px;
        cursor: pointer;
    }

    .select-category-dropdown li.selected {
        background-color: #dedede;
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