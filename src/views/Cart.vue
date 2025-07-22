<script setup>
import { reactive, onMounted } from 'vue';
import { getItems, removeCart, removeItem } from '@/services/cartService';

const state = reactive({
  items: [],
});

onMounted(() => {
  load();
})

const load = async () => {
  const res = await getItems();
  if (res === undefined || res.status !== 200) {
    return;
  }
  state.items = res.data;
}

const remove = async (cartId) => {
  console.log('힘들어와유..');
  const res = await removeItem(cartId);
  if (res === undefined || res.status !== 200) {
    return;
  }
  load();
}

const clear = async () => {
  const res = await removeCart();
  if (res.status !== 200) {
    return;
  }
  load();
}
</script>

<template>
  
</template>

<style scoped>

</style>