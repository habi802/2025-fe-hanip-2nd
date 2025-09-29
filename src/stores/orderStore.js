import { defineStore } from "pinia";
import {
  getOwnerPaidOrder,
  getOwnerPreparingOrder,
  getOwnerDeliveredOrder,
  getOwnerCompletedOrder,
  getOwnerCanceledOrder,
} from "@/services/orderService";

export const useOrderStore = defineStore(
  "order",
  {
    state: () => ({
      paidOrders: [],
      preparingOrders: [],
      deliveredOrders: [],
      completedOrders: [],
      canceledOrders: [],
      isLoading: false,
      orders: [],
    }),
    getters: {
      // 완료 + 취소 주문만 모은 리스트
      historyOrders: (state) => {
        return [
          ...state.completedOrders,
          ...state.canceledOrders,
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },
    },
    
    actions: {
      async fetchOrdersByDate(params) {
        this.isLoading = true;
        try {
          const res = await getOrderByDate(params);
          this.orders = res.data?.resultData ?? []; // ✅ 단일 orders 업데이트
        } catch (err) {
          console.error("fetchOrdersByDate 실패:", err);
          this.orders = [];
        } finally {
          this.isLoading = false;
        }
      },
      async fetchPaidOrders(storeId) {
        this.isLoading = true;
        try {
          const res = await getOwnerPaidOrder(storeId);
          console.log("res: ", res.data.resultData);
          this.paidOrders = res.data?.resultData ?? [];
        } catch (err) {
          console.error("fetchPaidOrders 실패:", err);
          this.paidOrders = [];
        } finally {
          this.isLoading = false;
        }
      },
      async fetchPreparingOrders(storeId) {
        this.isLoading = true;
        try {
          const res = await getOwnerPreparingOrder(storeId);
          this.preparingOrders = res.data?.resultData ?? [];
        } catch (err) {
          console.error("fetchPreparingOrders 실패:", err);
          this.preparingOrders = [];
        } finally {
          this.isLoading = false;
        }
      },
      async fetchDeliveredOrders(storeId) {
        this.isLoading = true;
        try {
          const res = await getOwnerDeliveredOrder(storeId);
          this.deliveredOrders = res.data?.resultData ?? [];
        } catch (err) {
          console.error("fetchDeliveredOrders 실패:", err);
          this.deliveredOrders = [];
        } finally {
          this.isLoading = false;
        }
      },
      async fetchCompletedOrders(storeId) {
        this.isLoading = true;
        try {
          const res = await getOwnerCompletedOrder(storeId);
          this.completedOrders = res.data?.resultData ?? [];
        } catch (err) {
          console.error("fetchCompletedOrders 실패:", err);
          this.completedOrders = [];
        } finally {
          this.isLoading = false;
        }
      },
      async fetchCanceledOrders(storeId) {
        this.isLoading = true;
        try {
          const res = await getOwnerCanceledOrder(storeId);
          this.canceledOrders = res.data?.resultData ?? [];
        } catch (err) {
          console.error("fetchCanceledOrders 실패:", err);
          this.canceledOrders = [];
        } finally {
          this.isLoading = false;
        }
      },
    },
  },
  { persist: false }
); // 주문은 실시간이므로 persist는 false

/* todo
    ORDERED("01", "결제 확인"),
    PAID("02", "결제 완료"),
    PREPARING("03", "음식준비중"),
    DELIVERED("04", "배달중"),
    COMPLETED("05", "배달완료"),
    CANCELED("06", "주문취소"),
    일치시키기
    */
