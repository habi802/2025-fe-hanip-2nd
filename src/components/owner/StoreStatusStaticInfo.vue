<script setup>
import { ref, computed, onMounted } from 'vue';
import { useOwnerStore } from '@/stores/account';
import defaultImage from '@/imgs/owner/owner-service2.png';
import BannerCropperModal from '../modal/BannerCropperModal.vue';

const owner = useOwnerStore();

const props = defineProps({
  form: Object,
  isActive: Number
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

const changeBannerImageFile = (e) => {
  const input = e.target;
  const file = input.files && input.files[0];
  if (file) {
    bannerFile.value = file;        
    showCropModal.value = true;     
  }
  input.value = '';                
};

const onCroppedBanner = (file) => {
  updateForm("bannerPath", file);
  bannerPreviewImage.value = URL.createObjectURL(file);
};

// 카테고리
const selectedCategory = ref([]);
const showCategoryDropdown = ref(false);
const categoryOption = ['한식','중식','일식','양식','디저트','분식','패스트푸드','아시안','치킨','피자','야식'];
const categoryWrapRef = ref(null);

const onClickOutsideCategory = (e) => {
  if (!showCategoryDropdown.value) return;
  const el = categoryWrapRef.value;
  if (el && !el.contains(e.target)) {
    showCategoryDropdown.value = false;
  }
};

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
  document.addEventListener('click', onClickOutsideCategory);
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
            <select
              v-model="props.form.tel1"
              @change="updateForm('tel1', $event.target.value)"
              class="form-select w-auto"
              :disabled="props.isActive === 1"
            >
              <option>02</option>
              <option>053</option>
              <option>010</option>
            </select>
            <input
              v-model="props.form.tel2"
              @input="updateForm('tel2', $event.target.value)"
              class="form-control w-25"
              :disabled="props.isActive === 1"
            />
            <input
              v-model="props.form.tel3"
              @input="updateForm('tel3', $event.target.value)"
              class="form-control w-25"
              :disabled="props.isActive === 1"
            />
          </div>
        </div>

        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">업종</label>
          <div class="col-sm-8">
            <!-- 인풋+드롭다운 고정폭 래퍼 -->
            <div class="category-field" ref="categoryWrapRef">
              <input
                type="text"
                class="form-control w-100"
                :value="sortedSelectedCategory.join(', ')"
                readonly
                @click="showCategoryDropdown = !showCategoryDropdown"
                @keydown.esc.prevent="showCategoryDropdown = false"
                @keydown.enter.prevent
                :disabled="props.isActive === 1"
              />
              <ul v-if="showCategoryDropdown" class="dropdown-menu show category-dropdown">
                <li
                  v-for="option in categoryOption"
                  :key="option"
                  @click="toggleCategoryItem(option)"
                  :class="[
                    'dropdown-item',
                    selectedCategory.includes(option) ? 'active' : '',
                    !selectedCategory.includes(option) && selectedCategory.length >= 3 ? 'disabled text-muted' : ''
                  ]"
                  style="cursor: pointer;"
                >
                  {{ option }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">가게 소개글</label>
          <div class="col-sm-8">
            <textarea
              class="form-control"
              rows="4"
              v-model="props.form.comment"
              @input="updateForm('comment', $event.target.value)"
              placeholder="최대 200자 이하, 짧은 홍보 문구를 작성해보세요!"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- 이미지 관리 -->
    <h5 class="mt-4 mb-3 fw-bold border-bottom pb-2 text-center">이미지 관리</h5>
    <div class="row g-4 align-items-stretch justify-content-center">
      <!-- 대표 이미지 (정사각형 유지 + 카드 높이 동기화) -->
      <div class="col-md-4 d-flex">
        <div class="image-upload-card flex-fill">
          <div class="card-title">대표 이미지</div>

          <!-- 바깥 컨테이너: 배너와 동일한 비율(카드 높이 동일화) -->
          <div class="outer-wrapper hoverable" @click="selectStoreImageFile">
            <!-- 내부 정사각형 박스 -->
            <div class="square-box">
              <img
                :src="storePreviewImage"
                @error="e => e.target.src = defaultImage"
                alt="대표 이미지"
              />
              <div class="overlay">대표 이미지 변경</div>
            </div>
          </div>

          <button
            type="button"
            class="btn btn-outline-secondary mt-auto w-100"
            @click="selectStoreImageFile"
          >
            대표 이미지 변경
          </button>
          <input
            ref="storeImageFileInput"
            type="file"
            accept="image/*"
            @change="changeStoreImageFile"
            hidden
          />
        </div>
      </div>

      <!-- 배너 이미지 -->
      <div class="col-md-8 d-flex">
        <div class="image-upload-card flex-fill banner-card">
          <div class="card-title">배너 이미지 (1900×400)</div>

          <div class="image-wrapper banner hoverable" @click="selectBannerImageFile">
            <img
              :src="bannerPreviewImage"
              @error="e => e.target.src = defaultImage"
              alt="배너 이미지"
            />
            <div class="overlay">배너 이미지 변경</div>
          </div>

          <button
            type="button"
            class="btn btn-outline-secondary mt-auto w-100"
            @click="selectBannerImageFile"
          >
            배너 이미지 변경
          </button>
          <input
            ref="bannerImageFileInput"
            type="file"
            accept="image/*"
            @change="changeBannerImageFile"
            hidden
          />
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
/* ===== 이미지 카드 ===== */
.image-upload-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  padding: 12px;

  .card-title {
    font-weight: 600;
    color: #212529;
  }
}

.outer-wrapper {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 100 / 45;   
  background: #f8f9fa;
  border-radius: var(--card-lg-radius);
  border: 2px dashed #dee2e6;
  overflow: hidden;
}

.square-box {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 100%;    
  width: auto;
  aspect-ratio: 1 / 1; 
  transform: translate(-50%, -50%);
  border-radius: var(--card-lg-radius);
  overflow: hidden;
}

.square-box > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .3s ease;
}

.image-wrapper.banner {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 1900 / 400;
  background: #f8f9fa;
  border-radius: var(--card-lg-radius);
  border: 2px dashed #dee2e6;
  overflow: hidden;

  @media (min-width: 992px) {
    min-height: 160px;
  }
}
.image-wrapper.banner img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .3s ease;
}

/* 공통 hover */
.hoverable .overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,.55);
  color: #fff; font-weight: 600; letter-spacing: .5px;
  opacity: 0; transition: opacity .25s ease;
  border-radius: var(--card-lg-radius);
}
.square-box:hover > img,
.image-wrapper.banner:hover img { transform: scale(1.05); }
.hoverable:hover .overlay { opacity: 1; }

.banner-card {
  max-width: 1100px;
  margin: 0 auto;
}

.category-field {
  position: relative;
  width: 323px; 
  max-width: 100%;
}

.category-dropdown {
  position: absolute;
  left: 0;
  top: calc(100% + 2px);
  width: 100%;   
  max-height: 240px;
  overflow: auto;
  z-index: 1050;
  border-radius: .375rem;
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.08);
  padding: .25rem 0;
}
.category-dropdown .dropdown-item { line-height: 1.6; }
.category-dropdown .dropdown-item.disabled { pointer-events: none; opacity: .6; }

@media (max-width: 575.98px) {
  .category-field { width: 100%; }
}
</style>
