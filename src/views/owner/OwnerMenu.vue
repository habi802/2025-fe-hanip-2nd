<script setup>
import OwnerMenuCard from '@/components/owner/OwnerMenuCard.vue';

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
  </template>

<style scoped>

</style>