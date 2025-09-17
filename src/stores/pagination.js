import { defineStore } from "pinia";
import { reactive } from "vue";

export const usePaginationStore = defineStore('pagination', () => {
    const state = reactive({
        totalRow: 0,
        pageSize: 10,
        pageNumber: 1,
    });

    // 총 페이지 수 변경
    const setTotalRow = val => (state.totalRow = val);

    // 페이지 사이즈 변경
    const setPageSize = val => (state.pageSize = val);

    // 페이지 번호 변경
    const setPageNumber = val => (state.pageNumber = val);

    return { state, setTotalRow, setPageSize, setPageNumber };
});