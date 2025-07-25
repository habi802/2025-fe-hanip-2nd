<script setup></script>

<template>
  <div class="all-box">


    <div class="box">
      <div>
        <div>내가 찜한 가게</div>
        <div class="solid"></div>
      </div>
  
      <div class="store-list">
        <!-- 카드 1 -->
        <div class="store-card">
          <img src="@/imgs/chicken.png" alt="치킨" class="store-image" />
          <div class="store-info">
            <h3 class="store-title">BBC 치킨</h3>
            <p class="store-sub">배달팁 3,000원 · 최소주문 15,000원</p>
            <div class="store-meta">
              <span class="rating">⭐ 4.9 (999+)</span>
              <span class="likes">❤️ 1120</span>
            </div>
            <button class="detail-btn">자세히 보기</button>
          </div>
        </div>
  
        <!-- 카드 2 -->
        <div class="store-card">
          <img src="@/imgs/hamburger.png" alt="햄버거" class="store-image" />
          <div class="store-info">
            <h3 class="store-title">맥도리아</h3>
            <p class="store-sub">배달팁 2,000원 · 최소주문 12,000원</p>
            <div class="store-meta">
              <span class="rating">⭐ 4.7 (998)</span>
              <span class="likes">❤️ 950</span>
            </div>
            <button class="detail-btn">자세히 보기</button>
          </div>
        </div>
  
        <!-- 카드 3 -->
        <div class="store-card">
          <img src="@/imgs/pizza.png" alt="피자" class="store-image" />
          <div class="store-info">
            <h3 class="store-title">도레미 피자</h3>
            <p class="store-sub">배달팁 3,500원 · 최소주문 18,000원</p>
            <div class="store-meta">
              <span class="rating">⭐ 4.8 (987)</span>
              <span class="likes">❤️ 888</span>
            </div>
            <button class="detail-btn">자세히 보기</button>
          </div>
        </div>
  
        <!-- 카드 4 -->
        <div class="store-card">
          <img src="@/imgs/dessert.png" alt="디저트" class="store-image" />
          <div class="store-info">
            <h3 class="store-title">뉴욕바게트</h3>
            <p class="store-sub">배달팁 1,500원 · 최소주문 10,000원</p>
            <div class="store-meta">
              <span class="rating">⭐ 4.6 (827)</span>
              <span class="likes">❤️ 648</span>
            </div>
            <button class="detail-btn">자세히 보기</button>
          </div>
        </div>
  
        <!-- 카드 5 -->
        <div class="store-card">
          <img src="@/imgs/porkcutlet.png" alt="돈까스" class="store-image" />
          <div class="store-info">
            <h3 class="store-title">내돈까스</h3>
            <p class="store-sub">배달팁 2,500원 · 최소주문 13,000원</p>
            <div class="store-meta">
              <span class="rating">⭐ 4.9 (999+)</span>
              <span class="likes">❤️ 770</span>
            </div>
            <button class="detail-btn">자세히 보기</button>
          </div>
        </div>
  
        <!-- 카드 6 -->
        <div class="store-card">
          <img src="@/imgs/koreanfood.png" alt="한식" class="store-image" />
          <div class="store-info">
            <h3 class="store-title">한식당 우리집</h3>
            <p class="store-sub">배달팁 3,000원 · 최소주문 14,000원</p>
            <div class="store-meta">
              <span class="rating">⭐ 4.8 (958)</span>
              <span class="likes">❤️ 820</span>
            </div>
            <button class="detail-btn">자세히 보기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
    format("woff");
  font-weight: normal;
  font-style: normal;
}

.all-box{
  display: flex;
  justify-content: center;

}
.box {

  font-family: "BMJUA";
  font-size: 1.4em;
  letter-spacing: -1.5px;
  margin-top: 70px;
  margin-bottom: 120px;
  .solid {
    width: 1100px;
    border: 1px #000 solid;
    margin-top: 15px;
    margin-bottom: 30px;
  }
}

.store-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 1100px;
}

.store-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid #666;
  overflow: hidden;
  padding: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.store-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.store-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 12px;
}

.store-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.store-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.store-sub {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}

.store-meta {
  display: flex;
  gap: 12px;
  font-size: 14px;
  margin-bottom: 10px;
}

.rating {
  color: #ffb400;
  font-weight: 500;
}

.likes {
  color: #ff6f61;
  font-weight: 500;
}

.detail-btn {
  background-color: #ff6f61;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}
.detail-btn:hover {
  background-color: #e65c53;
}
</style>
