<script setup>
import { useFavoriteStore } from "@/stores/favoriteStore";
import { onMounted, reactive } from "vue";
import { getFavoriteList } from "@/services/favoriteService";
import { useRoute, useRouter } from "vue-router";
import { watch } from "vue";
import defaultImage from '@/imgs/owner/owner-service3.png';

const router = useRouter();
const route = useRoute();

const favoriteStore = useFavoriteStore();

const state = reactive({
  // 찜 가게 정보
  favorites: []
});

const fetchFavorites = async () => {
  const res = await getFavoriteList();

  if (res === undefined || res.data.resultStatus !== 200) {
    const modal = new bootstrap.Modal(document.getElementById("favorite-error"));
    modal.show();
    return;
  }

  state.favorites = res.data.resultData;

  const favoriteIds = state.favorites.map(favorite => favorite.storeId);
  favoriteStore.setFavorites(favoriteIds);
};

onMounted(() => {
  fetchFavorites();
});

watch(
  () => route.path,
  (path) => {
    if (path === "/favorites") {
      fetchFavorites();
    }
  }
);

const toStore = id => {
  router.push({ path: `/stores/${id}` });
};
</script>

<template>
  <div class="all-box">
    <div class="box">
      <div>
        <div class="text-top">내가 찜한 가게</div>
        <div class="solid"></div>
      </div>

      <div v-if="state.favorites.length > 0">
        <div class="store-list">
          <div class="store-card" v-for="store in state.favorites" :key="store.id">
            <img :src="store.imagePath !== null ? `/pic/store-profile/${store.storeId}/${store.imagePath}` : defaultImage" alt="가게 이미지" class="store-image" />
            <div class="store-info">
              <h3 class="store-title">{{ store.name }}</h3>
              <p class="store-sub">
                최소 주문 금액 15,000원<br>
                배달료 0원 ~ 3,000원
              </p>
              <div class="store-meta">
                <span class="rating">⭐ {{ store.rating }}</span>
                <span class="likes">❤️ {{ store.favorites }}</span>
              </div>
              <button class="detail-btn" @click="toStore(store.storeId)">
                자세히 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="container">
          <div class="text-no">찜한 가게가 없습니다.</div>
          <div class="img-box">
            <img src="/src/imgs/owner/owner-service2.png" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 조회 실패 -->
  <div class="modal fade" id="favorite-error" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">경고</h5>
        </div>
        <div class="modal-body">조회에 실패하였습니다</div>
        <div class="modal-footer">
          <a class="btn" id="modalY" href="#" data-bs-dismiss="modal">닫기</a>
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

.all-box {
  display: flex;
  justify-content: center;
  padding: 0 20px; // 양쪽 여백
  width: 100%;
}

.box {
  font-family: "BMJUA";
  font-size: 1.4em;
  letter-spacing: -1.5px;
  margin-top: 90px;
  margin-bottom: 120px;
  width: 100%;

  .solid {
    width: 100%;
    max-width: 1470px;
    border: 1px #000 solid;
    margin: 50px auto 80px auto;
  }
}

.store-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0 auto;   // 가운데 정렬
  gap: 20px;
  width: 1440px;
  
}

.store-card {
  width: 345px;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 15px;
  border: 2px solid #797979;
  overflow: hidden;
  padding: 20px 16px; // 세로 패딩 ↑
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}


.store-image {
  width: 110px;
  height: 110px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 14px;
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
  margin-bottom: 12px;
}

.store-meta {
  display: flex;
  gap: 12px;
  font-size: 14px;
  margin-bottom: 12px;
}

.rating {
  color: #ffb400;
  font-weight: 500;
}

.likes {
  color: #ff6666;
  font-weight: 500;
}

.detail-btn {
  background-color: #ff6666;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}
.detail-btn:hover {
  background-color: #ff6666;
}
.container {
  margin-bottom: 120px;
}
.img-box {
  width: 100%;
  display: flex;
  justify-content: center;
  
}
.text-no {
  text-align: center;
  font-size: 30px;
  margin-top: 90px;
  color: #5f5f5f;
  margin-bottom: 20px;
}
.text-top {
  font-size: 25px;
  text-align: center;
  margin-bottom: 50px;
}

</style>
