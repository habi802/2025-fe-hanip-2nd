<script setup>
import { useFavoriteStore } from "@/stores/favoriteStore";
import { ref, onMounted, computed, onActivated } from "vue";
import { getStoreList } from "@/services/storeService";
import { getFavorite } from "@/services/favoriteService";
import { useRouter, useRoute } from "vue-router";
import { watch } from "vue";
import { getFavoriteList } from "@/services/favoriteService";

const router = useRouter();
const route = useRoute();

const favoriteStore = useFavoriteStore();

const isFavorite = (storeId) => {
  return favoriteStore.state.storeIds.includes(storeId);
};

const allStores = ref([]);

const fetchFavorites = async () => {
  const storeListRes = await getStoreList();
  const favoriteListRes = await getFavoriteList();

  if (storeListRes?.data?.resultData && favoriteListRes?.data?.resultData) {
    allStores.value = storeListRes.data.resultData;

    const favoriteIds = favoriteListRes.data.resultData.map( store => store.id || store.storeId ) 
    favoriteStore.setFavorites(favoriteIds);
  }
};

onMounted(fetchFavorites);
onActivated(fetchFavorites);

watch(
  () => route.path,
  (path) => {
    if(path === "/favorites"){
    fetchFavorites();
    }
  }
);

const favoriteStores = computed(() => {
  console.log("찜한 storeIds:", favoriteStore.state.storeIds);
  console.log("전체 매장 목록:", allStores.value);

  return allStores.value.filter((store) =>
    favoriteStore.state.storeIds.includes(store.id || store.storeId)
  );
});

const goToDetail = (storeId) => {
  if (!storeId) {
    console.warn("storeId가 없습니다.");
    return;
  }
  router.push(`/stores/${storeId}`);
};

const storeId = route.params.id;
console.log("라우터로 받은 storeId:", storeId);
</script>

<template>
  <div class="all-box">
    <div class="box">
      <div>
        <div class="text-top">내가 찜한 가게</div>
        <div class="solid"></div>
      </div>

      <div v-if="favoriteStores.length > 0">
        <div class="store-list">
          <div
            class="store-card"
            v-for="store in favoriteStores"
            :key="store.id"
          >
            <img
              :src="`/imgs/${store.image}`"
              alt="가게 이미지"
              class="store-image"
            />
            <div class="store-info">
              <h3 class="store-title">{{ store.name }}</h3>
              <p class="store-sub">
                배달팁 {{ store.deliveryFee }}원 · 최소주문
                {{ store.minOrderAmount }}원
              </p>
              <div class="store-meta">
                <span class="rating">⭐ {{ store.rating }}</span>
                <span class="likes" @click="toggleFavorite(store.id)">
                  {{ isFavorite(store.id) ? "❤️" : "🤍" }}
                  {{ store.likeCount || 0 }}
                </span>
              </div>
              <button
                class="detail-btn"
                @click="() => goToDetail(store.id ?? store.storeId)"
              >
                자세히 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="container">
          <div class="text-no">찜한 가게가 없습니다</div>
          <div class="img-box">
            <img src="/src/imgs/owner/owner-service2.png" />
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

.all-box {
  display: flex;
  justify-content: center;
}

.box {
  font-family: "BMJUA";
  font-size: 1.4em;
  letter-spacing: -1.5px;
  margin-top: 90px;
  margin-bottom: 120px;

  .solid {
    width: 1120px;
    border: 1px #000 solid;
    margin-top: 15px;
    margin-bottom: 50px;
  }
}

.store-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 1100px;
  
}

.store-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 15px;
  border: 1px solid #797979;
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
