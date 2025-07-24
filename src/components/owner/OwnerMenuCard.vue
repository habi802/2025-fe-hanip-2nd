<script setup>
import { defineProps, reactive, ref } from "vue";
import defaultMenuImage from "@/imgs/owner/haniplogo_sample.png";
import { modifyMenu, getMenus, deleteMenu } from "@/services/menuService";
import { useRouter } from "vue-router";

const emit = defineEmits(["menuUpdated"]);

// ref
const previewImage = ref(defaultMenuImage);
const modifyMenuModal = ref(null);
const router = useRouter();

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
});

// 사진 미리보기
previewImage.value = defaultMenuImage;
const MenuImage = `D:/home/download/menu-profile/${props.menu.menuId}/${props.menu.imagePath}`

const handleFileSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    newMenu.imagePath = file;
  }
};

// 모달
const newMenu = reactive({
  id: "",
  name: "",
  price: "",
  comment: "",
  imagePath: null,
});

// 모달 창 열기
const editMenu = () => {
  newMenu.menuId = props.menu.menuId;
  newMenu.name = props.menu.name;
  newMenu.price = props.menu.price;
  newMenu.comment = props.menu.comment;

  const modal = new bootstrap.Modal(modifyMenuModal.value);
  modal.show();
};

// 수정
const submitMenu = async () => {
  const formData = new FormData();
  const payload = {
    data: {
      id: props.menu.menuId,
      storeId: props.menu.storeId,
      name: newMenu.name,
      price: newMenu.price,
      comment: newMenu.comment,
    },
    img: newMenu.imagePath,
  };

  formData.append("img", payload.img);
  formData.append(
    "data",
    new Blob([JSON.stringify(payload.data)], { type: "application/json" })
  );

  const res = await modifyMenu(formData);
  if (res.status != 200) {
    alert("에러");
    return;
  }

  emit("menuUpdated");
  // 모달 창 닫기
  const modal = bootstrap.Modal.getInstance(modifyMenuModal.value);
  modal.hide();
};

// 삭제
const deleteOneMenu = async () => {
  const res = await deleteMenu(props.menu.menuId)
  if (res.status != 200) {
    alert("에러");
    return;
  }
  emit("menuUpdated");
}
</script>

<template>
  <div
    class="card mb-3 shadow-sm w-100"
    style="max-width: 590px; height: 250px"
  >
    <div class="row g-0 h-100">
      <div class="col-md-5 d-flex align-items-center justify-content-center">
        <img
          :src="previewImage || `/pic/menu-profile/${props.menu.menuId}/${props.menu.imagePath}`"
          :alt="`메뉴 사진(${props.menu.name})`"
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
          <h5 class="card-title card-size mb-3">{{ props.menu.name }}</h5>
          <h6 class="text-muted mb-2">
            {{ props.menu.price.toLocaleString() + "원" }}
          </h6>
          <p class="card-text small mt-2">"{{ props.menu.comment }}"</p>
        </div>
        <div class="d-flex gap-2 mt-3 justify-content-end">
          <button @click="editMenu" class="accept-btn">수정</button>
          <button @click="deleteOneMenu" class="delete-btn">삭제</button>
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
          <button class="btn btn-primary" @click="submitMenu">수정</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-size {
  font-weight: 600;
  font-size: 20px;
}

.accept-btn {
  background: #f66463;
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 18px;
  width: 68px;
  height: 42px;
  transition: background-color 0.3s, color 0.3s;
}

.accept-btn:hover {
  background: #d44b4a;
}
.accept-btn:active {
  background: #b23837;
}

.delete-btn {
  background: #a3a3a3;
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 18px;
  width: 68px;
  height: 42px;
  transition: background-color 0.3s, color 0.3s;
}

.delete-btn:hover {
  background: #838383;
}
.delete-btn:active {
  background: #696969;
}
</style>
