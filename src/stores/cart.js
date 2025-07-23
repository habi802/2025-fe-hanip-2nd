import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useCartStore = defineStore('carts', () => {
    const state = reactive({
        items: [],
    });

    return { state };
});