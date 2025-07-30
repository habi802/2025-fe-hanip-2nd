import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';

export const useCartStore = defineStore('carts', () => {
  const state = reactive({
    items: JSON.parse(localStorage.getItem('cart-items')) || [],
    latestOrder: []
  });

  const addMenus = (menus) => {
    menus.forEach(menu => {
      const existing = state.items.find(item => item.menuId === menu.menuId);
      if (existing) {
        existing.quantity += menu.quantity;
      } else {
        state.items.push({ ...menu });
      }
    });
  };

  const setLatestOrder = (items) => {
    state.latestOrder = items;
  };

  const clearCart = () => {
    state.items = [];
  };

  // 🧠 장바구니가 변경될 때마다 localStorage에 저장
  watch(
    () => state.items,
    (newItems) => {
      localStorage.setItem('cart-items', JSON.stringify(newItems));
    },
    { deep: true }
  );

  return { state, addMenus, clearCart, setLatestOrder };
});
