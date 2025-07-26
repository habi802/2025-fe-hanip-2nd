import { defineStore } from 'pinia';
import { getReviewsByStoreId, patchOwnerComment } from '@/services/reviewServices';

// export const useReviewStore = defineStore('review', {
//   state: () => ({
//     reviews: [],
//     ownerComment : null,
//   }),
//   actions: {
//     // 사장관점 리뷰 데이터 불러오기
//     async fetchReviews(storeId) {
//       try {
//         const res = await getReviewsByStoreId(storeId);
//         console.log(res);
//         if (res && res.status === 200) {
//             this.reviews = res.data.resultData;  // 서버 응답의 리뷰 데이터를 상태에 저장
//             console.log("리뷰쪽 뭐담기지? : " , this.reviews);
//             this.ownerComment = res.data.resultData.ownerComment;
//           } else {
//           console.error('리뷰 데이터 불러오기 실패', res);
//         }
//       } catch (error) {
//         console.error('리뷰 데이터 불러오기 에러', error);
//       }
//     },
//   },
// });


export const useReviewStore = defineStore('review', {
  state: () => ({
    reviews: [], // 리뷰 목록
  }),

  actions: {
    // 리뷰 목록 가져오기
    async fetchReviews(storeId) {
      try {
        const res = await getReviewsByStoreId(storeId);
        if (res && res.status === 200) {
          this.reviews = res.data.resultData;
          console.log("리뷰 목록:", this.reviews);
        } else {
          console.error('리뷰 가져오기 실패', res);
        }
      } catch (error) {
        console.error('리뷰 가져오기 에러', error);
      }
    },

    // 사장 댓글 저장 (PATCH 요청)
    async saveOwnerComment({ reviewId, ownerComment }) {
      try {
        const res = await patchOwnerComment(reviewId, ownerComment);
        if (res && res.status === 200 && res.data?.success) {
          // 저장 성공 시 로컬 상태 갱신
          const target = this.reviews.find(r => r.id === reviewId);
          if (target) {
            target.ownerComment = ownerComment;
          }
          return true;
        } else {
          console.error('답글 저장 실패', res);
          return false;
        }
      } catch (error) {
        console.error('답글 저장 에러', error);
        return false;
      }
    }
  }
});


