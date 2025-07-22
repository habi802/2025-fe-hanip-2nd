<script setup>
import { defineProps, reactive, ref } from "vue";
import defaultMenuImage from "@/imgs/owner/haniplogo_sample.png";

// ref
const previewImage = ref(defaultMenuImage);
const modifyMenuModal = ref(null);

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
});

// 사진 미리보기
previewImage.value = defaultMenuImage;

const handleFileSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    newMenu.imagePath = file;
  }
};

// 모달
const newMenu = reactive({
  name: "",
  price: "",
  comment: "",
  imagePath: null,
});

// 모달 창 열기
const editMenu = () => {
  newMenu.name = props.menu.name;
  newMenu.price = props.menu.price;
  newMenu.comment = props.menu.comment;

  const modal = new bootstrap.Modal(modifyMenuModal.value);
  modal.show();
};
</script>

<template>
  <div
    class="card mb-3 shadow-sm w-100"
    style="max-width: 590px; height: 250px"
  >
    <div class="row g-0 h-100">
      <div class="col-md-5 d-flex align-items-center justify-content-center">
        <img
          :src="previewImage"
          alt="메뉴 사진 미리보기"
          style="
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
            border-radius: 12px;
          "
        />
      </div>
      <div class="col-md-7 d-flex flex-column justify-content-between p-3">
        <div>
          <h5 class="card-title">{{ props.menu.name }}</h5>
          <h6 class="text-muted">{{ props.menu.price.toLocaleString() + "원" }}</h6>
          <p class="card-text small mt-2">{{ props.menu.comment }}</p>
        </div>
        <div class="d-flex gap-2 mt-3 justify-content-end">
          <button @click="editMenu" class="btn btn-primary mt-3">수정</button>
          <button @click="deleteMenu" class="btn btn-danger mt-3">삭제</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 부트스트랩 모달 -->
  <div class="modal fade" ref="modifyMenuModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">메뉴 수정</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <!-- 프리뷰 -->
          <div v-if="previewImage" class="text-center">
            <img
              :src="previewImage"
              alt="미리보기"
              style="
                max-width: 70%;
                height: auto;
                border-radius: 8px;
                margin-top: 10px;
                margin-bottom: 10px;
              "
            />
            <!-- 이미지 업로드 -->
            <input
              type="file"
              accept="image/*"
              @change="handleFileSelected"
              class="form-control mb-2"
            />
          </div>
          <input
            v-model="newMenu.name"
            type="text"
            class="form-control mb-2"
            placeholder="메뉴 이름"
          />
          <input
            v-model="newMenu.price"
            type="number"
            class="form-control mb-2"
            placeholder="가격"
          />
          <textarea
            v-model="newMenu.comment"
            class="form-control"
            placeholder="설명"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            취소
          </button>
          <button class="btn btn-primary" @click="submitMenu">수정</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
