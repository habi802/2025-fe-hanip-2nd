<script setup>
import { ref, computed, onMounted } from 'vue';
import { useOwnerStore } from '@/stores/account';
import defaultImage from '@/imgs/owner/owner-service2.png';
import BannerCropperModal from '../modal/BannerCropperModal.vue';

const owner = useOwnerStore();

const props = defineProps({
  form: Object
});
const emit = defineEmits(['update-form']);

const baseUrl = import.meta.env.VITE_BASE_URL;

const bannerFile = ref(null);
const showCropModal = ref(false);

const storeImageFileInput = ref(null);
const bannerImageFileInput = ref(null);
const storePreviewImage = ref(`${baseUrl}/images/store/${owner.state.storeData.id}/${props.form.imagePath}`);
const bannerPreviewImage = ref(`${baseUrl}/images/store/${owner.state.storeData.id}/${props.form.bannerPath}`);

// 이미지 선택
const selectStoreImageFile = () => storeImageFileInput.value?.click();
const selectBannerImageFile = () => bannerImageFileInput.value?.click();

const changeStoreImageFile = e => {
  const file = e.target.files[0];
  if (file) {
    storePreviewImage.value = URL.createObjectURL(file);
    updateForm('imagePath', file);
  }
};
const changeBannerImageFile = e => {
  const file = e.target.files[0];
  if (file) {
    bannerPreviewImage.value = URL.createObjectURL(file);
    updateForm('bannerPath', file);
    // bannerFile.value = file;
    // showCropModal.value = true;
  }
};
const onCroppedBanner = (file) => {
  updateForm("bannerPath", file);
  bannerPreviewImage.value = URL.createObjectURL(file);
};

// 카테고리
const selectedCategory = ref([]);
const showCategoryDropdown = ref(false);
const categoryOption = ['한식','중식','일식','양식','디저트','분식','패스트푸드','아시안','치킨','피자','야식'];

function toggleCategoryItem(option) {
  const idx = selectedCategory.value.indexOf(option);
  if (idx === -1) selectedCategory.value.push(option);
  else selectedCategory.value.splice(idx, 1);
  updateForm('categories', [...sortedSelectedCategory.value]);
}
const sortedSelectedCategory = computed(() =>
  categoryOption.filter(option => selectedCategory.value.includes(option))
);

onMounted(() => {
  selectedCategory.value = props.form.categories.filter(val => categoryOption.includes(val));
});

const updateForm = (key, value) => {
  emit('update-form', { ...props.form, [key]: value });
};
</script>

<template>
  <div class="container-fluid">

    <!-- 기본정보 + 수정정보 2열 -->
    <h5 class="mb-3 fw-bold border-bottom pb-2 text-center">가게 기본정보</h5>
    <div class="row align-items-start">
      <!-- 좌측: 고정정보 -->
      <div class="col-md-6">
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">대표자 이름</label>
          <div class="col-sm-8 pt-2">{{ owner.state.storeData.ownerName }}</div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">가게 상호명</label>
          <div class="col-sm-8 pt-2">{{ owner.state.storeData.name }}</div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">사업자 등록번호</label>
          <div class="col-sm-8 pt-2">{{ owner.state.storeData.businessNumber }}</div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">가게 주소</label>
          <div class="col-sm-8 pt-2">
            {{ `${owner.state.storeData.postCode}, ${owner.state.storeData.address}${owner.state.storeData.addressDetail ? ', ' + owner.state.storeData.addressDetail : ''}` }}
          </div>
        </div>
      </div>

      <!-- 우측: 수정 가능한 필드 -->
      <div class="col-md-6">
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">가게 전화</label>
          <div class="col-sm-8 d-flex gap-2">
            <select v-model="props.form.tel1" @change="updateForm('tel1', $event.target.value)" class="form-select w-auto">
              <option>02</option>
              <option>053</option>
              <option>010</option>
            </select>
            <input v-model="props.form.tel2" @input="updateForm('tel2', $event.target.value)" class="form-control w-25" />
            <input v-model="props.form.tel3" @input="updateForm('tel3', $event.target.value)" class="form-control w-25" />
          </div>
        </div>

        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">업종</label>
          <div class="col-sm-8 position-relative">
            <input type="text" class="form-control" :value="sortedSelectedCategory.join(', ')" readonly
                   @click="showCategoryDropdown = !showCategoryDropdown" />
            <ul v-if="showCategoryDropdown" class="dropdown-menu show w-100">
              <li v-for="option in categoryOption" :key="option"
                  @click="toggleCategoryItem(option)"
                  :class="{ 'dropdown-item': true, active: selectedCategory.includes(option) }">
                {{ option }}
              </li>
            </ul>
          </div>
        </div>

        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">가게 소개글</label>
          <div class="col-sm-8">
            <textarea class="form-control" rows="4" v-model="props.form.comment"
                      @input="updateForm('comment', $event.target.value)"
                      placeholder="최대 200자 이하, 짧은 홍보 문구를 작성해보세요!"></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- 이미지 관리 -->
    <h5 class="mt-4 mb-3 fw-bold border-bottom pb-2 text-center">이미지 관리</h5>
    <div class="row g-4 justify-content-center">
      <div class="col-md-4">
        <div class="image-upload-card">
          <div class="image-wrapper" @click="selectStoreImageFile">
            <img :src="storePreviewImage" @error="e => e.target.src = defaultImage" alt="대표 이미지" />
            <div class="overlay">대표 이미지 변경</div>
          </div>
          <input ref="storeImageFileInput" type="file" accept="image/*" @change="changeStoreImageFile" style="display: none" />
        </div>
      </div>

      <div class="col-md-8">
        <div class="image-upload-card">
          <div class="image-wrapper banner" @click="selectBannerImageFile">
            <img :src="bannerPreviewImage" @error="e => e.target.src = defaultImage" alt="배너 이미지" />
            <div class="overlay">배너 이미지 변경</div>
          </div>
          <input ref="bannerImageFileInput" type="file" accept="image/*" @change="changeBannerImageFile" style="display: none" />
        </div>
      </div>
    </div>

    <!-- 크롭 모달 -->
    <BannerCropperModal
      :file="bannerFile"
      :show="showCropModal"
      @close="showCropModal = false"
      @cropped="onCroppedBanner"
    />
  </div>
</template>

<style scoped lang="scss">
.image-upload-card {
  .image-wrapper {
    position: relative;
    width: 300px;
    height: 280px;
    background: #f8f9fa;
    border-radius: var(--card-lg-radius);
    cursor: pointer;
    overflow: hidden;
    border: 2px dashed #dee2e6;
    transition: all 0.3s ease;

    &.banner {
        width: 900px;
        height: 280px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--card-lg-radius);
      transition: transform 0.3s ease;
    }

    .overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      opacity: 0;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: opacity 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
    &:hover .overlay {
      opacity: 1;
    }
  }
}
</style>
