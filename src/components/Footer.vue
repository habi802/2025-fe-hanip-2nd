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
          <img src="@/imgs/haniplogo2.png" alt="Hanlp 로고" />
        </div>
        <!-- 한입회사 대표 설명 -->
        <div class="company-details">
          <h5>한입 Hanip</h5>
          <p>대표 박도흠</p>
          <p>대구 중구 중앙대로 394<br />(남일동 5층)</p>
          <p>사업자 등록번호</p>
        </div>
        <!-- 고객센터 전화번호 연결 -->
        <div class="customer-service">
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
.footer {
  background-color: #3a3a3a;
  color: white;
  padding: 2rem 1rem 1rem;
  font-size: 0.8rem;
  .container {
    display: flex;
    justify-content: center; // 중앙 정렬
    align-items: flex-start;
    gap: 0; // 구분선 포함 3등분 처리
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
  }
  .footer-menus {
    display: flex;
    gap: 1.5rem;
    .footer-column {
      h4 {
        margin-bottom: 0.8rem;
        font-size: 1rem;
        font-weight: bold;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        li {
          margin-bottom: 0.4rem;
          font-size: 0.9rem;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
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
    display: contents;
    align-items: flex-start;
    gap: 1rem;
    max-width: 100px;
    padding-left: -20px;
    flex-wrap: wrap;
    .footer-logo {
      display: flex;
      align-items: first baseline;
      padding: 0;
      margin: 0;
      img {
        height: 50px;
        width: auto;
        padding: 0;
        margin-right: 20px;
      }
    }
    .footer-texts {
      display: flex;
      flex-direction: row;
      gap: 2rem;
      .company-details,
      .customer-service {
        font-size: 0.9rem;
        p {
          margin: 0.2rem 0;
        }
        h4 {
          margin: 0.5rem 0 0.3rem;
          font-weight: bold;
        }
      }
    }
  }
  .footer-bottom {
    margin-top: 2rem;
    text-align: left;
    font-size: 0.8rem;
    color: #ccc;
    margin-left: 2rem;
  }
}
</style>
