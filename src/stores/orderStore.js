import { defineStore } from "pinia";
import { getOwnerOrder } from "@/services/orderService";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
    isLoading: false,
  }),
  actions: {
    async fetchOrders(id) {
      this.isLoading = true;
      try {
        const res = await getOwnerOrder(id);
        
        console.log("😁res" , res)
        this.orders = res.data.resultData ?? [];
      } catch (err) {
        console.error("fetchOrders 실패:", err);
        this.orders = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
  getters: {
    /* todo
    ORDERED("01", "결제 확인"),
    PAID("02", "결제 완료"),
    PREPARING("03", "음식준비중"),
    DELIVERED("04", "배달중"),
    COMPLETED("05", "배달완료"),
    CANCELED("06", "주문취소"),
    일치시키기
    */
    orderedList: (state) => state.orders.filter((o) => o.status === "01"),
    preparingList: (state) => state.orders.filter((o) => o.status === "03"),
    deliveringList: (state) => state.orders.filter((o) => o.status === "04"),
    completedList: (state) => state.orders.filter((o) => o.status === "05"),
    canceledList: (state) =>state.orders.filter((o) => o.status === "06"),
    nonOrderedList: (state) => state.orders.filter((o) => o.status !== "01"),


    // orderedList: (state) => state.orders.filter((o) => o.status === "ORDERED"),
    // deliveringList: (state) => state.orders.filter((o) => o.status === "DELIVERING"),
    // preparingList: (state) => state.orders.filter((o) => o.status === "PREPARING"),
    // canceledList: (state) =>state.orders.filter((o) => o.status === "CANCELED"),
    // completedList: (state) => state.orders.filter((o) => o.status === "COMPLETED"),
    // nonOrderedList: (state) => state.orders.filter((o) => o.status !== "ORDERED"),
  },
}, { persist: true }
);