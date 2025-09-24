<script setup>
import { ref, watch, computed, onMounted } from "vue";
import defaultImage from "@/imgs/owner/haniplogo_sample.png";

const props = defineProps({
  menu: { type: Object, default: null },
  mode: { type: String, default: "create" },
});

const emit = defineEmits(["saved", "deleted", "hide", "soldOut"]);

onMounted(async () => {
  console.log("menuId:", props.menu.menuId, "// 메뉴 정보: ", props.menu);
  console.log("imgSrc:", imgSrc.value);
});

// 폼 상태
const menuName = ref("");
const price = ref(0);
const desc = ref("");
const category = ref("단품");

// 이미지
const fileInput = ref(null);
const selectedFile = ref(null);
const previewImage = ref(defaultImage);
const baseUrl = ref(import.meta.env.VITE_BASE_URL);

const imgSrc = computed(() => {
  if (previewImage.value && previewImage.value !== defaultImage) {
    return previewImage.value;
  }
  if (props.menu?.imagePath && props.menu.imagePath !== "null") {
    return `${baseUrl.value}/images/store/${props.menu.storeId}/menu/${props.menu.menuId}/${props.menu.imagePath}`;
  }
  return defaultImage;
});

// 옵션 그룹
const options = ref([
  { category: "필수", name: "", values: [{ opt: "", extra: 0 }] },
]);

const resetForm = () => {
  menuName.value = "";
  price.value = 0;
  desc.value = "";
  category.value = "단품";
  options.value = [
    { category: "필수", name: "", values: [{ opt: "", extra: 0 }] },
  ];
  selectedFile.value = null;
  previewImage.value = defaultImage;
};

// 응답 -> 폼
watch(
  () => props.menu,
  (m) => {
    if (!m) {
      resetForm();
      return;
    }
    menuName.value = m.name ?? "";
    price.value = Number(m.price ?? 0);
    desc.value = m.comment ?? "";
    category.value = m.menuType ?? "단품";
    const toValues = (node) => {
      if (Array.isArray(node.children) && node.children.length) {
        return node.children.map((c) => ({
          id: c.optionId ?? nullm,
          opt: c.comment ?? c.name ?? "",
          extra: Number(c.price ?? 0),
        }));
      }
      return [
        {
          opt: node.comment ?? node.name ?? "",
          extra: Number(node.price ?? 0),
        },
      ];
    };
    options.value = (m.options ?? []).map((g) => ({
      id: g.optionId ?? null,
      category: g.isRequired === 1 ? "필수" : "선택",
      name: g.comment ?? g.name ?? "",
      values: toValues(g),
    }));
    previewImage.value = "";
    selectedFile.value = null;
  },
  { immediate: true }
);

// 파일 처리
const triggerFileInput = () => fileInput.value?.click();
const handleFileSelected = (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  selectedFile.value = f;
  previewImage.value = URL.createObjectURL(f);
};

// 옵션
const addGroup = () => {
  options.value.push({
    category: "필수",
    name: "",
    values: [{ opt: "", extra: 0 }],
  });
};
const removeGroup = (idx) => options.value.splice(idx, 1);
const addOption = (groupIdx) =>
  options.value[groupIdx].values.push({ opt: "", extra: 0 });
const removeOption = (groupIdx, valIdx) =>
  options.value[groupIdx].values.splice(valIdx, 1);

// 메뉴 등록
const save = () => {
  const payload = {
    menuId: props.menu?.menuId ?? null,
    name: menuName.value,
    price: Number(price.value ?? 0),
    comment: desc.value,
    menuType: category.value,
    options: options.value.map((g) => ({
      isRequired: g.category === "필수" ? 1 : 0,
      comment: g.name ?? "",
      children: (g.values ?? []).map((v) => ({
        comment: v.opt ?? "",
        price: Number(v.extra ?? 0),
      })),
    })),
  };
  emit("saved", payload, selectedFile.value);
};

// 메뉴 삭제
const remove = () => {
  if (props.menu?.menuId) emit("deleted", props.menu.menuId);
};

// 메뉴 숨김
const isHide = ref(props.menu?.isHide ?? 0);
const toggleHide = () => {
  const payload = {
    menuId: props.menu?.menuId,
    isHide: props.menu?.isHide
  }
  console.log("토글 요청 payload:", payload)
  emit("hide", payload);
}

// 메뉴 품절
const isSoldOut = ref(props.menu?.isSoldOut ?? 0);
const toggleSoldOut = () => {
  const payload = {
    menuId: props.menu?.menuId,
    isSoldOut: props.menu?.isSoldOut
  }
  console.log("토글 요청 payload:", payload)
  emit("soldOut", payload);
}
</script>

<template>
  <div class="menu-detail container-fluid py-3">
    <!-- 헤더 -->
    <div class="text-center mb-4">
      <h4 class="fw-bold">{{ mode === "edit" ? "메뉴수정" : "메뉴등록" }}</h4>
    </div>

    <!-- 상단: 이미지 + 입력 폼 -->
    <div class="row mb-4">
      <!-- 이미지 -->
      <div class="col-md-4 text-center">
        <img
          :src="imgSrc"
          alt="메뉴 이미지"
          class="detail-img mb-2"
          @click="triggerFileInput"
        />
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          class="d-none"
          @change="handleFileSelected"
        />
        <small class="text-muted d-block">
          * 이미지를 클릭하면 사진을 변경할 수 있습니다.
        </small>
      </div>

      <!-- 입력 폼 -->
      <div class="col-md-8">
        <div class="mb-3 d-flex align-items-center">
          <label class="form-label col-3">메뉴 명</label>
          <input v-model="menuName" type="text" class="form-control" />
        </div>
        <div class="mb-3 d-flex align-items-center">
          <label class="form-label col-3">가격</label>
          <div class="input-group">
            <input
              v-model.number="price"
              type="number"
              min="0"
              class="form-control"
            />
            <span class="input-group-text">원</span>
          </div>
        </div>
        <div class="mb-3 d-flex">
          <label class="form-label col-3">메뉴 설명</label>
          <textarea v-model="desc" rows="3" class="form-control"></textarea>
        </div>
        <div class="mb-3 d-flex align-items-center">
          <label class="form-label col-3">메뉴 종류</label>
          <select v-model="category" class="form-select">
            <option>단품</option>
            <option>세트</option>
            <option>사이드</option>
            <option>음료수</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 옵션 그룹 -->
    <div class="menu-options">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold">메뉴 옵션</h5>
        <button class="btn btn-sm btn-outline-success" @click="addGroup">
          + 옵션 그룹 추가
        </button>
      </div>

      <div class="options-scroll">
        <div
          v-for="(group, idx) in options"
          :key="`group-${idx}`"
          class="option-group mb-4 p-3 border rounded"
        >
          <!-- 그룹 헤더 -->
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex gap-2 flex-grow-1">
              <select
                v-model="group.category"
                class="form-select"
                style="width: 150px"
              >
                <option>필수</option>
                <option>선택</option>
              </select>
              <input
                v-model="group.name"
                type="text"
                class="form-control form-control-sm"
                placeholder="이름 (예: 맵기, 추가토핑)"
              />
            </div>
            <button
              class="btn btn-sm btn-outline-danger ms-2"
              @click="removeGroup(idx)"
            >
              그룹삭제
            </button>
          </div>

          <!-- 옵션 리스트 -->
          <table class="table table-sm align-middle">
            <thead>
              <tr>
                <th>옵션명</th>
                <th>추가가격(원)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(opt, i) in group.values" :key="`opt-${idx}-${i}`">
                <td>
                  <input
                    v-model="opt.opt"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="옵션명"
                  />
                </td>
                <td>
                  <input
                    v-model.number="opt.extra"
                    type="number"
                    class="form-control form-control-sm"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="removeOption(idx, i)"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <button
            class="btn btn-sm btn-outline-primary"
            @click="addOption(idx)"
          >
            + 옵션 추가
          </button>
        </div>
      </div>
    </div>

    <!-- 버튼 -->
<div class="d-flex justify-content-between align-items-center mt-4">
  <!-- 왼쪽: 숨김 버튼 -->
  <div>
    <button 
      v-if="mode === 'edit'"
      class="btn-icon" 
      @click="toggleHide"
      :title="!props.menu?.isHide ? '숨김 해제' : '숨김 처리'"
      >
      <img
        v-if="!props.menu?.isHide"
        src="@/imgs/owner/hide.png"
        alt="숨김"
        class="icon-img"
      />
      <img
        v-else
        src="@/imgs/owner/show.png"
        alt="보임"
        class="icon-img"
      />
    </button>
    <button 
      v-if="mode === 'edit'"
      class="btn-icon" 
      @click="toggleSoldOut"
      :title="!props.menu?.isSoldOut ? '품절 해제' : '품절 처리'"
      >
      <img
        v-if="!props.menu?.isSoldOut"
        src="@/imgs/owner/soldout.png"
        alt="품절됨"
        class="icon-img"
      />
      <img
        v-else
        src="@/imgs/owner/sold.png"
        alt="판매 가능"
        class="icon-img"
      />
    </button>
  </div>

  <!-- 오른쪽: 삭제 + 수정/등록 버튼 -->
  <div class="d-flex gap-2">
    <button
      v-if="mode === 'edit'"
      class="btn btn-outline-danger"
      @click="remove"
    >
      삭제
    </button>
    <button class="owner-btn-white" @click="save">
      {{ mode === "edit" ? "수정완료" : "등록완료" }}
    </button>
  </div>
</div>
  </div>
</template>

<style scoped>
.detail-img {
  width: 100%;
  max-width: 240px;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #ddd;
}
.menu-options {
  display: flex;
  flex-direction: column;
  max-height: 450px;
  overflow: hidden;
}
.options-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  scrollbar-gutter: stable;
}
.option-group {
  background: #fafafa;
}

.btn-icon {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.icon-img {
  width: 50px; 
  height: 50px;
  display: inline-block;
}
</style>
