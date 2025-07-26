<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const search = ref("");

const caLink = () => {
  router.push({ path: "/categoryList", query: { search_text: search.value } });
};
//
const koreanLink = () => {
  router.push({ path: "/categoryList", query: { section: "korean" } });
};

const chinaLink = () => {
  router.push({ path: "/categoryList", query: { section: "china" } });
};
const japanLink = () => {
  router.push({ path: "/categoryList", query: { section: "japan" } });
};

const pastaLink = () => {
  router.push({ path: "/categoryList", query: { section: "pasta" } });
};

const cafeLink = () => {
  router.push({ path: "/categoryList", query: { section: "cafe" } });
};
const snackLink = () => {
  router.push({ path: "/categoryList", query: { section: "snack" } });
};
const fastFoodLink = () => {
  router.push({ path: "/categoryList", query: { section: "fast" } });
};
const asianLink = () => {
  router.push({ path: "/categoryList", query: { section: "asian" } });
};
const chickenLink = () => {
  router.push({ path: "/categoryList", query: { section: "chicken" } });
};
const pizzaLink = () => {
  router.push({ path: "/categoryList", query: { section: "pizza" } });
};
const nightLink = () => {
  router.push({ path: "/categoryList", query: { section: "night" } });
};
</script>
<!--           class="form-control p-3 me-3" -->
<template>
  <div class="all">
    <div class="box d-flex">
      <div class="searchBar">
        <input
          v-model="search"
          @keyup.enter="caLink"
          type="text"
          id="title"
          class="searchBox"
          placeholder="찾는 맛집 이름,메뉴가 무엇인가요?"
        />
        <img
          @click="caLink"
          class="searchImg"
          src="/src//imgs/fluent_search.png"
        />
      </div>
    </div>
    <div class="textBox"></div>
    <div class="category">
      <div class="categoryBox">
        <div id="categoryItems" class="categoryItem1 d-flex">
          <div class="hamburger">
            <div class="imgBox">
              <img @click="caLink" id="cImg" src="/src/imgs/allImg.png" />
            </div>
            <div id="cName">전체</div>
          </div>
          <div class="koreanfood">
            <div class="imgBox">
              <img
                @click="koreanLink"
                id="cImg"
                src="/src/imgs/koreanfood.png"
              />
            </div>
            <div id="cName">한식</div>
          </div>
          <div class="jjajangmyeon">
            <div class="imgBox">
              <img
                @click="chinaLink"
                id="cImg"
                src="/src/imgs/jjajangmyeon.png"
              />
            </div>
            <div id="cName">중식</div>
          </div>
          <div class="porkcutlet">
            <div class="imgBox">
              <img
                @click="japanLink"
                id="cImg"
                src="/src/imgs/porkcutlet.png"
              />
            </div>
            <div id="cName">일식</div>
          </div>
          <div class="pasta">
            <div class="imgBox">
              <img @click="pastaLink" id="cImg" src="/src/imgs/pasta.png" />
            </div>
            <div id="cName">양식</div>
          </div>
          <div class="dessert">
            <div class="imgBox">
              <img @click="cafeLink" id="cImg" src="/src/imgs/dessert.png" />
            </div>
            <div id="cName">카페/디저트</div>
          </div>
        </div>
        <div id="categoryItems" class="categoryItem2 d-flex">
          <div class="tteokbokki">
            <div class="imgBox">
              <img
                @click="snackLink"
                id="cImg"
                src="/src/imgs/tteokbokki.png"
              />
            </div>
            <div id="cName">분식</div>
          </div>
          <div class="hamburger">
            <div class="imgBox">
              <img
                @click="fastFoodLink"
                id="cImg"
                src="/src/imgs/hamburger.png"
              />
            </div>
            <div id="cName">패스트푸드</div>
          </div>
          <div class="ricenoodles">
            <div class="imgBox">
              <img
                @click="asianLink"
                id="cImg"
                class="asia"
                src="/src/imgs/nd.png"
              />
            </div>
            <div id="cName">아시안</div>
          </div>
          
          <div class="chicken">
            <div class="imgBox">
              <img @click="chickenLink" id="cImg" src="/src/imgs/chicken.png" />
            </div>
            <div id="cName">치킨</div>
          </div>
          <div class="pizza">
            <div class="imgBox">
              <img @click="pizzaLink" id="cImg" src="/src/imgs/pizza.png" />
            </div>
            <div id="cName">피자</div>
          </div>
          <div class="pigfeet">
            <div class="imgBox">
              <img @click="nightLink" id="cImg" src="/src/imgs/pigfeet.png" />
            </div>
            <div id="cName">야식</div>
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

.all {
  margin-bottom: 100px;

  .box {
    justify-content: center;
    width: auto;
    display: flex;
    align-items: center;

    .searchBar {
      justify-content: center;
      margin-top: 120px;
      font-size: 0.8em;
      border: 3px solid #ff6666;
      border-radius: 50px;

      input {
        padding-left: 43px;
      }

      input:focus {
        outline: none;
        box-shadow: none;
      }

      .searchImg {
        width: 30px;
        position: relative;
        right: 35px;
        bottom: 2px;
        cursor: pointer;
      }

      .searchBox {
        border: none;
        width: 530px;
        height: 70px;
        border-radius: 50px;
      }

      .searchBox::placeholder {
        color: #fcaeae;
      }
    }

    .searchBar::placeholder {
      color: #ff6666;
    }
  }

  .textBox {
    margin-top: 30px;
    margin-bottom: 50px;
    justify-content: center;
  }

  .category {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .categoryBox {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      width: 1500px;
      margin-top: -40px;
      margin-bottom: 8px;

      #categoryItems {
        margin-top: 70px;
        gap: 40px;
        // background-color: antiquewhite;

        .imgBox{
          width: 210px ;
          border-radius: 50%;
          overflow: hidden;
        }

        #cImg {
          cursor: pointer;
          // width: 220px;
          width: 210px;
          border-radius: 50%;
          transition: transform 0.3s ease-in-out;
          &:hover {
            transform: scale(1.2);
          }
        }

        #cName {
          font-size: 24px;
          padding-top: 11px;
          text-align: center;
          margin-left: -5px;
          font-weight: 400;
        }
      }
    }
  }
}



@media (max-width: 650px) {
  .searchBar {
    display: none;
  }
}
</style>
