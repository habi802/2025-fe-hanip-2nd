<script setup>
import OwnerMenuCard from "@/components/owner/OwnerMenuCard.vue";
import { getStoreIdAndMenus, saveMenu } from "@/services/menuService";
import { inject, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import defaultMenuImage from "@/imgs/owner/haniplogo_sample.png";

// router, ref
const router = useRouter();
const addMenuModal = ref(null);
const previewImage = ref(defaultMenuImage);
const ownerName = inject("ownerName", "");

onMounted(async () => {
  // 사장님 전용 조회 api 필요
  const res = await getStoreIdAndMenus();
  if (res.status === 200) {
    state.form = res.data.resultData;
    console.log("res: ", res.data.resultData);
  }
});

// 메뉴 데이터
const state = reactive({
  form: [],
});

// 모달
const newMenu = reactive({
  name: "",
  price: "",
  comment: "",
  imagePath: null,
});

// 모달 창 열기
const openAddMenuModal = () => {
  newMenu.name = "";
  newMenu.price = "";
  newMenu.comment = "";
  newMenu.imagePath = null;
  previewImage.value = defaultMenuImage;

  const modal = new bootstrap.Modal(addMenuModal.value);
  modal.show();
};

// 등록하기
const submitMenu = async () => {
  const formData = new FormData();
  const payload = {
    data: {
      id: state.form.menuId,
      storeId: state.form.storeId,
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


  const res = await saveMenu(formData);
  console.log("imagePath:", newMenu.imagePath);
  console.log("instanceof File:", newMenu.imagePath instanceof File);

  if (!(newMenu.imagePath instanceof File)) {
    alert("이미지를 선택해 주세요");
    return;
  } else if (res.status !== 200) {
    alert("에러 발생");
    return;
  }

  // 입력값 초기화
  newMenu.name = "";
  newMenu.price = "";
  newMenu.comment = "";
  newMenu.imagePath = null;
  previewImage.value = defaultMenuImage;

  alert("등록 성공");

  // 모달 창 닫기
  const modal = bootstrap.Modal.getInstance(addMenuModal.value);
  modal.hide();
};

// 사진 미리보기
const handleFileSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    newMenu.imagePath = file;
  }
};

const fetchMenus = async () => {
  const res = await getStoreIdAndMenus();
  if (res.status === 200) {
    state.form = res.data.resultData;
  }
};
</script>

<template>
  <div class="owner-title1">메뉴상세</div>
  <div class="owner-title2">
    어서오세요! {{ ownerName }} 사장님, 관리자 페이지에 다시 오신 것을
    환영합니다!
  </div>
  <div class="padding pb-5">
    <div class="row gap-3">
      <OwnerMenuCard
        v-for="menu in state.form"
        :key="menu.id"
        :menu="menu"
        @menuUpdated="fetchMenus"
      />
      <div class="card add-card" @click="openAddMenuModal">
        <div class="add-content">+ 메뉴 추가하기</div>
      </div>
    </div>
  </div>

  <!-- 부트스트랩 모달 -->
  <div class="modal fade" ref="addMenuModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">메뉴 추가</h5>
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
          <button class="btn btn-primary" @click="submitMenu">등록</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.owner-title1 {
  font-size: 30px;
  font-weight: bold;
  padding-left: 12px;
  padding-bottom: 2px;
}

.owner-title2 {
  padding-left: 12px;
  padding-bottom: 10px;
  color: #686868;
}

.padding {
  padding-left: 24px;
}

.add-card {
  width: 590px;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 2px dashed #ccc;
  background-color: #f9f9f9;
  transition: background 0.3s;

  &:hover {
    background-color: #eaeaea;
  }

  .add-content {
    font-size: 20px;
    color: #999;
    font-weight: bold;
  }
}
</style>
