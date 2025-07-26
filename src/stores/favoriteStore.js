import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useFavoriteStore = defineStore('favorite', () => {
  const state = reactive({
    storeIds: [],
  });

  const toggleFavorite = (storeId) => {
    if (state.storeIds.includes(storeId)) {
      state.storeIds = state.storeIds.filter(id => id !== storeId);
    } else {
      state.storeIds.push(storeId);
    }
    console.log('storeIds:', state.storeIds);
  };

  return { state, toggleFavorite };
});
