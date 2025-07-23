import { defineStore } from 'pinia';
import { getReviewsByStoreId } from '@/services/reviewServices';

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviews: [],
  }),
  actions: {
    // 리뷰 데이터 불러오기
    async fetchReviews(storeId) {
      try {
        const res = await getReviewsByStoreId(storeId);
        console.log(res);
        if (res && res.status === 200) {
            this.reviews = res.data.resultData;  // 서버 응답의 리뷰 데이터를 상태에 저장
            console.log("리뷰쪽 뭐담기지? : " , this.reviews);
        } else {
          console.error('리뷰 데이터 불러오기 실패', res);
        }
      } catch (error) {
        console.error('리뷰 데이터 불러오기 에러', error);
      }
    },
  },
});