<script setup>
import OwnerMenuCard from '@/components/owner/OwnerMenuCard.vue';
import { getOneMenu } from '@/services/menuServeice';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// router, ref
const router = useRouter();
const addMenuModal = ref(null);

onMounted( async() => {
    const res = await getOneMenu(1);
    if(res.status === 200) {
        state.form = res.data.resultData;
        // console.log("res: ", res.data.resultData)
    }
})

// 데이터
const state = reactive({
  form: []
});

// 수정 버튼
const editMenu = (id) => {
  console.log("수정 페이지로 이동 → 메뉴 ID:", id);
  router.push(`/owner/menu/${id}`)
};

// 모달
const newMenu = reactive({
  name: "",
  price: "",
  comment: "",
})

// 모달 창 열기
const openAddMenuModal = () => {
  const modal = new bootstrap.Modal(addMenuModal.value);
  modal.show();
};

// 등록하기
const submitMenu = () => {
  console.log('새 메뉴 등록:', newMenu);
  // 등록

  //(테스트용)
  state.form.push({
    id: Date.now(),
    name: newMenu.name,
    price: newMenu.price,
    comment: newMenu.comment,
    image: '' // 이미지 경로도 추가 가능
  });

  // 입력값 초기화
  newMenu.name = '';
  newMenu.price = '';
  newMenu.comment = '';

  // 모달 닫기
  const modal = bootstrap.Modal.getInstance(addMenuModal.value);
  modal.hide();
};

</script>

<template>
  <div class="owner-title1">메뉴상세</div>
  <div class="owner-title2">
    어서오세요! {{}} 사장님, 관리자 페이지에 다시 오신 것을 환영합니다!
  </div>
  <div class="padding pb-5">
    <div class="row gap-3">
      <OwnerMenuCard
        v-for="menu in state.form"
        :key="menu.id"
        :menu="menu"
        @edit="editMenu(menu.id)"
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
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input v-model="newMenu.name" type="text" class="form-control mb-2" placeholder="메뉴 이름" />
          <input v-model="newMenu.price" type="number" class="form-control mb-2" placeholder="가격" />
          <textarea v-model="newMenu.comment" class="form-control" placeholder="설명"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
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
  width: 590PX;
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