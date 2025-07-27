import { defineStore } from "pinia";
import { getOwnerOrder } from "@/services/orderService";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
  }),
  actions: {
    async fetchOrders(id) {
      try {
        const res = await getOwnerOrder(id);
        this.orders = res.data.resultData ?? [];
      } catch (err) {
        console.error("fetchOrders 실패:", err);
        this.orders = [];
      }
    },
  },
  getters: {
    orderedList: (state) => state.orders.filter((o) => o.status === "ORDERED"),
    deliveringList: (state) =>
      state.orders.filter((o) => o.status === "DELIVERING"),
    preparingList: (state) =>
      state.orders.filter((o) => o.status === "PREPARING"),
    canceledList: (state) =>
      state.orders.filter((o) => o.status === "CANCELED"),
    completedList: (state) =>
      state.orders.filter((o) => o.status === "COMPLETED"),
    nonOrderedList: (state) =>
      state.orders.filter((o) => o.status !== "ORDERED"),
  },
});