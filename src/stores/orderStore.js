import { defineStore } from "pinia";
import { getOrder } from "@/services/orderService";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
  }),
  actions: {
    async fetchOrders() {
      const res = await getOrder();
      this.orders = res.data.resultData;
    },
  },
  getters: {
    orderedList: (state) => state.orders.filter((o) => o.status === "ORDERED"),
    deliveringList: (state) =>
      state.orders.filter((o) => o.status === "DELIVERING"),
    preparingList: (state) =>
      state.orders.filter((o) => o.status === "PREPARING"),
  },
});

