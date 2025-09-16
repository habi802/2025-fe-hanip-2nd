<script setup>
import { ref } from "vue";

const menuName = ref("");
const price = ref(0);
const desc = ref("");
const options = ref([
  { category: "필수", name: "맵기", values: [{ opt: "기본맛", extra: 0 }, { opt: "매운맛", extra: 200 }] },
  { category: "선택", name: "재료추가", values: [{ opt: "밥", extra: 1000 }, { opt: "치즈", extra: 1000 }] },
]);
</script>

<template>
  <div class="menu-detail p-3 white-card">
    <!-- 이미지 -->
    <div class="mb-3">
      <img src="" class="detail-img mb-2" />
      <small class="text-muted">이미지를 클릭하면 사진을 변경할 수 있습니다</small>
    </div>

    <!-- 입력 폼 -->
    <div class="mb-3">
      <label>메뉴 명</label>
      <input v-model="menuName" type="text" class="form-control" />
    </div>
    <div class="mb-3">
      <label>가격</label>
      <input v-model="price" type="number" class="form-control" />
    </div>
    <div class="mb-3">
      <label>메뉴 설명</label>
      <textarea v-model="desc" rows="3" class="form-control"></textarea>
    </div>

    <!-- 옵션 -->
    <div class="mb-3" v-for="(group, idx) in options" :key="idx">
      <h6>{{ group.category }} - {{ group.name }}</h6>
      <table class="table table-sm">
        <tr v-for="(opt, i) in group.values" :key="i">
          <td>{{ opt.opt }}</td>
          <td>{{ opt.extra }}원</td>
          <td><button class="btn btn-sm btn-outline-danger">삭제</button></td>
        </tr>
      </table>
    </div>

    <!-- 버튼 -->
    <div class="d-flex justify-content-end gap-2">
      <button class="btn btn-outline-secondary">등록취소</button>
      <button class="btn btn-primary">등록완료</button>
    </div>
  </div>
</template>

<style scoped>
.detail-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}
</style>
