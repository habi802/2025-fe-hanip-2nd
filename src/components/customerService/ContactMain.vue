<script setup>
import { ref } from "vue";
import ContactHeader from "@/components/customerService/ContactHeader.vue";

// const activeTab = ref("faq");

// function setTab(tabName) {
//   activeTab.value = tabName;
// }

// 확인용 임시 더미 데이터
const inquiries = [
  { no: 10, title: "쿠폰등록 입금 가능한가요?", writer: "맛집찾기", date: "2025-08-23" },
  { no: 9, title: "현금 결제 가능한가요?", writer: "밥이최고", date: "2025-08-23" },
  { no: 8, title: "무통장 입금 가능한가요?", writer: "맛집천국", date: "2025-08-23" },
  { no: 7, title: "세일 기간 언제까지 인가요", writer: "맛집레이더", date: "2025-08-23" },
  { no: 6, title: "환불해주세요. ", writer: "대구일짱", date: "2025-08-23" },
  { no: 5, title: "현금 결제 가능한가요?", writer: "집순이", date: "2025-08-23" },
  { no: 4, title: "쿠폰등록 입금 가능한가요?", writer: "리뷰의달인", date: "2025-08-23" },
  { no: 3, title: "쿠폰등록 입금 가능한가요?", writer: "늘배고파", date: "2025-08-23" },
  { no: 2, title: "현금 결제 가능한가요?", writer: "오늘은 뭐먹지", date: "2025-08-23" },
  { no: 1, title: "쿠폰등록 입금 가능한가요?", writer: "맛집장인", date: "2025-08-23" },
];

// 페이지네이션
const currentPage = ref(1);
const totalPages = 5;

function goPrev() {
  if (currentPage.value > 1) currentPage.value--;
}

function goNext() {
  if (currentPage.value < totalPages) currentPage.value++;
}
</script>

<template>
  <div>
  <ContactHeader/>
  </div>
  <div class="customer-service">
    <div class="container">
      <!-- 문의 리스트 테이블 -->
      <div class="inquiry-list">
      <div class="titleLine"></div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>제목</th>
              <th>글쓴이</th>
              <th>작성시간</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in inquiries" :key="item.no">
              <td>{{ item.no }}</td>
              <td class="title">
                <span class="lock">🔒</span>
                {{ item.title }}
              </td>
              <td>{{ item.writer }}</td>
              <td>{{ item.date }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 페이지네이션 -->
        <div class="pagination">
          <span @click="goPrev" class="arrow">&lt;</span>
          <span
            v-for="n in totalPages"
            :key="n"
            class="page"
            :class="{ active: currentPage === n }"
            @click="currentPage = n"
          >
            {{ n }}
          </span>
          <span @click="goNext" class="arrow">&gt;</span>
        </div>

        <!-- 글쓰기 버튼 -->
        <div class="btn-wrapper">
          <button class="write-btn">글쓰기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  // 프리텐다드
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
    format("woff");
  font-weight: 400;
  font-style: normal;
}
* {
  font-family: "Pretendard-Regular";
  letter-spacing: 1px;
  box-sizing: border-box;
}

.customer-service {
  .container {
    width: 80%;
    margin: 0 auto;

// 메인 선
.titleLine {
  border-bottom: 2px solid #000;
  
  margin-top: 5rem;
}
    // 문의 리스트
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
      
      // 구분선
      th,
      td {
        border-bottom: 2px solid #6C6C6C;
        padding: 15px;
        text-align: center;
      }
      // 리스트 헤더
      th {
        //background-color: #fafafa;
        font-weight: bold;
      }
      // 제목
      .title {
        text-align: center;
        // 자물쇠
        .lock {
          margin-right: 0.3rem;
          color: #888;
        }
      }
    }
    // 페이지네이션
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1em;
      // 각 페이지 숫자
      .page {
        position: relative;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        padding: 5px 5px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: #ff6666;
        }

        &.active {
          color: #ff6666;

          &::after {
            content: "";
            position: absolute;
            bottom: 0; // 숫자 바로 밑
            left: 50%;
            transform: translateX(-50%);
            width: 65%; // 밑줄 길이
            height: 0.1em;
            background-color: #ff6666;
          }
        }
      }

      // 이전/다음 화살표 버튼
      .arrow {
        font-weight: bold;
        font-size: 16px;
        padding: 5px 10px;
        line-height: 1; // 숫자와 같은 기준선
        display: flex;
        align-items: center;

        &:hover {
          color: #ff6666;
        }
      }
    }
    // 글쓰기 버튼
    .btn-wrapper {
      text-align: right;

      .write-btn {
        padding: 0.6rem 1.2rem;
        background-color: #ff6666;
        border: none;
        border-radius: 6px;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        margin-bottom: 100px;

        &:hover {
          background-color: darken(#ff6666, 5%);
        }
      }
    }
  }
}
</style>
