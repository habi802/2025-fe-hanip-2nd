<script setup></script>

<template>
  <div></div>
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
        <div class="footer-logo footer-column">
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
  // 프리텐다드 폰트 설정
  font-family: 'Pretendard-Regular';
  src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}

* {
  // 기본 폰트 적용
  font-family: 'Pretendard-Regular';
}

.footer {
  background-color: #525252;
  color: white;
  padding: 2rem 1rem 1rem;
  font-size: 0.8rem;

  .container {
    // 푸터 컨텐츠 래퍼 (가운데 정렬)
    position: relative;
    display: flex;
    align-items: flex-start;
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 0px;
    gap: 80px; // 공간 조절
  }

  .footer-menus {
    // 왼쪽 메뉴 그룹 (회사소개/문의하기/정책)
    display: flex;
    gap: 100px;
    margin-right: 70PX;

    .footer-column {
      // 각 컬럼 내부 스타일
      margin: 0 20px 0 10px;

      h4 {
        // 컬럼 제목
        margin-bottom: 1rem;
        font-size: 20px;
        font-weight: bold;
      }

      p {
        // 컬럼 항목 
        margin-top: 2rem;
        margin-bottom: -1.5rem;
        margin-right: 4rem;
      }
    }
  }

  .footer-divider {
    // 메뉴 영역과 회사 정보 사이 구분선
    position: absolute;
    left: 50%; // 컨테이너 기준 정가운데
    transform: translateX(-50%); // 정확히 가운데 맞춤
    width: 1px;
    background-color: #bbb;
    height: 120px;

  }

  .footer-info {
    // 오른쪽 회사 정보 전체 영역
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 70px;

    .footer-logo {
      // 로고 이미지 영역
      display: flex;
      align-items: first baseline;
      margin-right: 20px;

      img {
        height: 70px; // 로고 높이
        width: auto; // 비율 유지
      }
    }

    .footer-column {
      // 공통 컬럼 스타일 (회사정보, 고객센터)

      h4 {
        // 컬럼 제목
        margin-bottom: 2rem;
        font-size: 20px;
        font-weight: bold;
      }

      p {
        // 컬럼 본문 텍스트
        margin-bottom: 1rem;
      }
    }

    .company-details {
      // 회사 정보 컬럼 여백 조정
      margin-right: 40px;
    }

    .customer-service {
      margin-right: 40px;
    }

  }

  .footer-bottom {
    // 하단 카피라이트 영역
    margin-top: 2rem;
    text-align: left;
    font-size: 0.8rem;
    color: #c8c8c8;
    margin-left: 2rem;
  }
}
</style>
