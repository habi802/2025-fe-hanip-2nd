import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useCartStore = defineStore('carts', () => {
    const state = reactive({
        items: [],
    });

    const addMenus = menus => {
        menus.forEach(menu => {
      const existing = state.items.find(item => item.id === menu.id);
      if (existing) {
        existing.quantity += menu.quantity;
      } else {
        state.items.push({ ...menu });
      }
    });
}
  const clearCart = () => {
    state.items = [];
  };

  const getItems = () => state.items;

    return { state, addMenus, clearCart, getItems };
});