<script setup>
import { ref } from "vue";

// FAQ 더미데이터
const faqs = ref([
  {
    question: "회원가입은 어떻게 하나요?",
    answer:
      "홈페이지 우측 상단 '회원가입' 버튼을 클릭하고, 이메일 또는 SNS 계정으로 가입할 수 있습니다.",
  },
  {
    question: "비밀번호를 잊어버렸을 때는 어떻게 하나요?",
    answer:
      "로그인 화면에서 '비밀번호 찾기'를 클릭하고, 이메일 인증을 통해 새 비밀번호를 설정할 수 있습니다.",
  },
  {
    question: "결제 수단에는 어떤 것이 있나요?",
    answer:
      "신용카드, 체크카드, 휴대폰 결제, 카카오페이 등 다양한 결제 수단을 지원합니다.",
  },
  {
    question: "주문 상태는 어디서 확인할 수 있나요?",
    answer:
      "마이페이지 > 주문내역에서 현재 주문 상태와 배송 정보를 확인할 수 있습니다.",
  },
  {
    question: "환불은 어떻게 진행되나요?",
    answer:
      "결제 수단에 따라 환불 절차가 달라지며, 고객센터 (1600-1234)를 통해 안내받으실 수 있습니다.",
  },
  {
    question: "가게에 문의하고 싶으면 어떻게 하나요?",
    answer:
      "가게 상세 페이지의 가게 정보에서 전화번호를 확인 후 직접 문의하실 수 있습니다.",
  },
  {
    question: "배달이 지연될 경우 어떻게 하나요?",
    answer:
      "주문 내역에서 배송 상태를 확인하고, 지연 시 고객센터 (1600-1234)로 문의해주세요.",
  },
  {
    question: "리뷰 작성 시 사진 첨부는 가능한가요?",
    answer:
      "주문 완료 후 리뷰 작성 시 사진 첨부가 가능하며, 최대 5장까지 업로드할 수 있습니다.",
  },
]);
</script>

<template>
  <div class="customer-service">
    <div class="container">
      <!-- 문의 리스트 테이블 -->
      <div class="inquiry-list">

        <div class="faq-list">
          <div v-for="(item, index) in faqs" :key="index" class="faq-item">
            <p class="faq-question">Q. {{ item.question }}</p>
            <p class="faq-answer">A. {{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  // 프리텐다드
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
}

* {
  font-family: "Pretendard-Regular";
  letter-spacing: 1px;
  box-sizing: border-box;
  font-size: 25px;
}

.customer-service {
  justify-content: center;

  .container {
    margin-bottom: 300px;

  }
}

.faq-list {
  width: 1480px;

  .faq-item {
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;

    .faq-question {
      color: #ff6666;
      font-weight: 200;
      margin-bottom: 30px;
      margin-left: 180px;
    }

    .faq-answer {
      color: #000;
      line-height: 1.5;
      margin-left: 180px;
    }
  }
}
</style>
