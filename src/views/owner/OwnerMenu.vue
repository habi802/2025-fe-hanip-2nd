<script setup>
import OwnerMenuCard from '@/components/owner/OwnerMenuCard.vue';
import { getOneMenu } from '@/services/menuServeice';
import { onMounted } from 'vue';

onMounted( async() => {
    const res = await getOneMenu(1);
    if(res.status === 200) {
        menus = res.data.resultData
    }
})

const menus = [
  {
    id: 1,
    image: "/src/imgs/arrow",
    name: "",
    price: 1,
    description: "",
  },
  // 더 추가...
];

const editMenu = (id) => {
  console.log("수정 페이지로 이동 → 메뉴 ID:", id);
  // 예: router.push(`/owner/menu/edit/${id}`)
};

</script>

<template>
  <div class="owner-title1">메뉴상세</div>
  <div class="owner-title2">
    어서오세요! {{}} 사장님, 관리자 페이지에 다시 오신 것을 환영합니다!
  </div>
  <div class="padding">
    <div class="space-y-6">
      <OwnerMenuCard
        v-for="menu in menus"
        :key="menu.id"
        :image="menu.image"
        :name="menu.name"
        :price="menu.price"
        :description="menu.description"
        @edit="editMenu(menu.id)"
      />
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
  padding-left: 12px;
}
</style>