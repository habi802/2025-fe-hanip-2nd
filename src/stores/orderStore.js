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
      updatedOrders: [],
      paidOrders: [],
      preparingOrders: [],
      deliveredOrders: [],
      completedOrders: [],
      canceledOrders: [],
      isLoading: false,
      orders: [],
    }),
    actions: {
      /** ✅ SSE 이벤트 수신 시 호출 */
      updateOrderByStatus(order) {
        // 모든 리스트에서 해당 주문 제거
        this.paidOrders = this.paidOrders.filter((o) => o.orderId !== order.orderId);
        this.preparingOrders = this.preparingOrders.filter((o) => o.orderId !== order.orderId);
        this.deliveredOrders = this.deliveredOrders.filter((o) => o.orderId !== order.orderId);
        this.completedOrders = this.completedOrders.filter((o) => o.orderId !== order.orderId);
        this.canceledOrders = this.canceledOrders.filter((o) => o.orderId !== order.orderId);

        // 상태별로 새로 추가
        switch (order.status) {
          case "02": // "02"
            this.paidOrders.unshift(order);
            break;
          case "03": // "03"
            this.preparingOrders.unshift(order);
            break;
          case "04": // "04"
            this.deliveredOrders.unshift(order);
            break;
          case "05": // "05"
            this.completedOrders.unshift(order);
            break;
          case "06": // "06"
            this.canceledOrders.unshift(order);
            break;
          default:
            console.warn("알 수 없는 상태:", order.status);
        }
      },

      markUpdated(orderId) {
        console.log("orderid: ", orderId);
        this.updatedOrders.push(orderId);
        setTimeout(() => {
          this.updatedOrders = this.updatedOrders.filter((id) => id !== orderId);
        }, 1000);
      },

      async fetchPaidOrders(storeId) {
        this.isLoading = true;
        try {
          const res = await getOwnerPaidOrder(storeId);
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
);
