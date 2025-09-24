import { defineStore } from "pinia";
import axios from "axios";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
  }),
  actions: {
    async getCart() {
      try {
        const res = await axios.get("/cart");
        this.items = res.data.resultData; 
        console.log("카트 데이터:", this.items);
      } catch (error) {
        console.error("카트 가져오기 실패", error);
      }
    },
    addItem(item) {
      const idx = this.items.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        this.items[idx].quantity += item.quantity;
      } else {
        this.items.push(item);
      }
    },
    removeItem(id) {
      this.items = this.items.filter((i) => i.id !== id);
    },
    updateQuantity(id, qty) {
      const item = this.items.find((i) => i.id === id);
      if (item) item.quantity = qty;
    },
  },
});