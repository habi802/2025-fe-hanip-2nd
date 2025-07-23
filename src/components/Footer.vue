<script setup></script>

<template>
  <footer class="footer">
    <div class="container">
      <!-- 왼쪽 메뉴 영역 -->
      <div class="footer-menus">
        <div class="footer-column">
          <h4>회사 소개</h4>
          <p>회사소개</p>
          <p>팀</p>
          <p>채용</p>
        </div>
        <div class="footer-column">
          <h4>문의하기</h4>
          <p>고객문의</p>
          <p>제휴문의</p>
        </div>
        <div class="footer-column">
          <h4>정책</h4>
          <p>이용약관</p>
          <p>환불 및 취소약관</p>
          <p>개인정보 처리방침</p>
        </div>
      </div>
      <!-- 중간 구분선 -->
      <div class="footer-divider"></div>
      <!-- 오른쪽 회사 정보 -->
      <div class="footer-info">
  <div class="footer-logo">
    <img src="@/imgs/symbollogo.png" alt="Hanlp 로고" />
  </div>
  <div class="footer-column company-details">
    <h4>한입 Hanip</h4>
    <p>대표 박도흠</p>
    <p>대구 중구 중앙대로 394<br />(남일동 5층)</p>
    <p>사업자 등록번호</p>
  </div>
  <div class="footer-column customer-service">
    <h4>고객센터</h4>
    <p>고객센터 번호</p>
    <p>이메일주소</p>
  </div>
</div>
    </div>
    <div class="footer-bottom">
      <div class="copyright">All right reserved.&copy;Hanip Company,2025</div>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
@font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}
*{
  font-family: 'Pretendard-Regular';
}
.footer {
  background-color: #525252;
  color: white;
  padding: 2rem 1rem 1rem;
  font-size: 0.8rem;

  .container {
    display: flex;
    justify-content: center; // 중앙 정렬
    align-items: flex-start;
    gap: 20px; // 구분선 포함 3등분 처리
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
  }
 
  .footer-menus {
    display: flex;
    gap: 1.5rem;
    
    .footer-column {
      margin-right: 10px;
      
      h4 {
        margin-bottom: 1rem;
        font-size: 20px;
        font-weight: bold;
      }
      p {
        margin-top: 2rem;
        margin-bottom: -1.5rem;
        margin-right: 4rem;
      }
    }
  }
  
  .footer-divider {
    width: 1px;
    background-color: #bbb;
    height: 120px;
    margin: 0 1.5rem;
  }
  
  .footer-info {
    display: flex;                 // 수평 정렬
    align-items: flex-start;       // 상단 기준 정렬
    justify-content: flex-start;   // 왼쪽 정렬
    gap: 3rem;  
    
    .footer-logo {
      display: flex;
      align-items: first baseline;
      padding: 0;
      margin: 0;

      img {
        height: 70px;
        width: auto;
        padding: 0;
        margin-right: 20px;
      }
    }

    .footer-texts {
      display: flex;
      flex-direction: row;
      gap: 2rem;
      
      .footer-column.company-details {
       padding: 2rem; 
      }

    }
    h4 {
      margin-bottom: 2rem;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .footer-bottom {
    margin-top: 2rem;
    text-align: left;
    font-size: 0.8rem;
    color: #c8c8c8;
    margin-left: 2rem;
  }
}
</style>
