<script setup></script>

<template>
  <div></div>
  <footer class="footer">
    <div class="container">
      <!-- 왼쪽 메뉴 영역 -->
      <div class="footer-menus">
        <div class="footer-column">
          <h4>회사 소개</h4>
          <br />
          <div>배달전문 웹사이트</div>
          <br />
          <div>팀</div>
          <br />
          <div>채용</div>
        </div>
        <div class="footer-column">
          <h4>문의하기</h4>
          <br />
          <div>고객문의</div>
          <br />
          <div>제휴문의</div>
        </div>
        <div class="footer-column">
          <h4>정책</h4>
          <br />
          <div>이용약관</div>
          <br />
          <div>환불 및 취소 약관</div>
          <br />
          <div>개인정보 처리 방침</div>
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
          <div>대표 박도흠</div>
          <br />
          <div>대구 중구 중앙대로 394</div>
          <!-- <div>(남일동 5층)</div> -->
          <p>(남일동 5층)</p>
          <br />
          <div>사업자 등록번호</div>
          <!-- <div>504-30-13756</div> -->
          <p>504-30-13756</p>
        </div>
        <!-- 왼쪽 회사 정보 -->
        <div class="footer-column customer-service">
          <router-link to="/contact" class="footer-link">
            <h4>고객센터</h4>
          </router-link>
          <div>고객센터 번호</div>
          <br />
          <div>이메일 주소</div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="copyright">All right reserved.&copy;Hanip Company,2025</div>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
* {
  // 기본 폰트 적용
  font-family: "Pretendard-Regular";
  -webkit-user-drag: none;
}

.footer {
  width: 100%;
  background-color: #888;
  color: white;
  padding: 2rem 1rem 1rem;
  font-size: 0.8rem;

  .container {
    // 푸터 컨텐츠 래퍼 (가운데 정렬)
    flex-direction: row-reverse;
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
    margin-right: 70px;

    .footer-column {
      // 각 컬럼 내부 스타일
      margin: 0 20px 0 10px;

      h4 {
        // 컬럼 제목
        margin-bottom: 1rem;
        font-size: 20px;
        font-weight: bold;
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
    margin-right: 80px;

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

  // 고객센터 라우터 스타일 처리
  .footer-link {
    text-decoration: none;
    color: white;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #ff6666;
      /* hover 시 색상 변경 */
    }
  }

  @media (max-width: 1480px) {
    .container {
      gap: 40px;
      padding: 20px 0;
      justify-content: center;
      flex-direction: row-reverse;
    }

    .footer-menus {
      gap: 20px; /* 메뉴들 간의 간격을 줄입니다 */
      margin-right: 0; /* 오른쪽 여백 제거 */
    }

    .footer-info {
      gap: 30px; /* 회사 정보 간격 줄이기 */
      align-items: flex-start;
      justify-content: flex-start;
      margin-right: -30px;
    }

    .footer-divider {
      display: none; // 구분선 숨김
    }

    .footer-logo {
      margin: 0;
      text-align: center;
      padding: 0; /* 로고 영역 패딩 제거 */
    }

    .footer-column {
      margin: 0;
      padding: 0; /* 각 컬럼 내부 여백을 줄입니다 */
      text-align: left; /* 컬럼 제목 및 항목들 왼쪽 정렬 유지 */
    }

    .company-details {
      margin-right: 0; /* 회사 정보의 오른쪽 여백 제거 */
    }

    .customer-service {
      margin-right: 0; /* 고객 서비스의 오른쪽 여백 제거 */
    }

    /* 고객센터 링크의 여백도 줄이기 */
    .footer-link {
      margin-top: 0;
      padding: 0;
    }
  }

  @media (max-width: 950px) {
    .container {
      gap: 40px;
      flex-direction: row-reverse;
      justify-content: center;
      div {
        margin-top: -15px;
      }
    }

    .footer-menus {
      flex-direction: column;
      gap: 30px;
      margin-top: -50;
    }

    .footer-info {
      flex-direction: column;
      gap: 40px;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .footer-divider {
      display: none; /* 구분선 숨김 */
    }

    /* 이미지를 왼쪽으로 배치 */
    .footer-logo {
      margin: 0;
      position: relative;
      left: 0; /* 왼쪽 정렬 */
      text-align: left;
    }

    .footer-column {
      margin: 0;
      text-align: left; /* 왼쪽 정렬 */
    }

    .company-details {
      margin-right: 0;
    }
  }

  @media (max-width: 480px) {
    .footer {
      padding: 1.5rem 0.5rem;
      font-size: 0.7rem;
    }
    div {
      display: none;
    }
    .footer-logo img {
      height: 100px;
      display: block; /* 이미지를 보이도록 설정 */
      margin: 0 auto; /* 이미지 중앙 정렬 */
    }

    .footer-bottom {
      font-size: 0.7rem;
      text-align: center; /* 카피라이트 텍스트 중앙 정렬 */
      margin-left: 0;
    }
  }
}
</style>
