<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const caLink = () => {
  router.push('/categoryList');
};
</script>

<template>
  <div class="all">
    <div class="box d-flex">
      <div class="searchBar">
        <input
          @click="caLink"
          type="text"
          id="title"
          class="form-control p-3 me-3"
          placeholder="가게 검색하기"
        />
      </div>
    </div>
    <div class="textBox">
      <div class="text">Category</div>
    </div>
    <div class="category">
      <div class="categoryBox">
        <div id="categoryItems" class="categoryItem1 d-flex">
          <div class="hamburger">
            <img @click="caLink" id="cImg" src="/src/imgs/allImg.png" />
            <div id="cName">전체</div>
          </div>
          <div class="koreanfood">
            <img @click="caLink" id="cImg" src="/src/imgs/koreanfood.png" />
            <div id="cName">한식</div>
          </div>
          <div class="jjajangmyeon">
            <img @click="caLink" id="cImg" src="/src/imgs/jjajangmyeon.png" />
            <div id="cName">중식</div>
          </div>
          <div class="porkcutlet">
            <img @click="caLink" id="cImg" src="/src/imgs/porkcutlet.png" />
            <div id="cName">일식</div>
          </div>
          <div class="pasta">
            <img @click="caLink" id="cImg" src="/src/imgs/pasta.png" />
            <div id="cName">양식</div>
          </div>
          <div class="dessert">
            <img @click="caLink" id="cImg" src="/src/imgs/dessert.png" />
            <div id="cName">카페/디저트</div>
          </div>
        </div>
        <div id="categoryItems" class="categoryItem2 d-flex">
          <div class="tteokbokki">
            <img @click="caLink" id="cImg" src="/src/imgs/tteokbokki.png" />
            <div id="cName">분식</div>
          </div>
          <div class="hamburger">
            <img @click="caLink" id="cImg" src="/src/imgs/hamburger.png" />
            <div id="cName">햄버거</div>
          </div>
          <div class="ricenoodles">
            <img @click="caLink" id="cImg" src="/src/imgs/ricenoodles.png" />
            <div id="cName">아시안</div>
          </div>
          <div class="chicken">
            <img @click="caLink" id="cImg" src="/src/imgs/chicken.png" />
            <div id="cName">치킨</div>
          </div>
          <div class="pizza">
            <img @click="caLink" id="cImg" src="/src/imgs/pizza.png" />
            <div id="cName">피자</div>
          </div>
          <div class="pigfeet">
            <img @click="caLink" id="cImg" src="/src/imgs/pigfeet.png" />
            <div id="cName">야식</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.all {
  margin-bottom: 100px;

  .box {
    justify-content: center;
    width: auto;
    .searchBar {
      margin-top: 80px;
      width: 600px;
    }
  }
  .textBox {
    margin-top: 30px;
    margin-bottom: 50px;
    justify-content: center;
    .text {
      font-weight: 600;
      font-size: 2.5em;
      text-align: center;
    }
  }
  .category {
    .categoryBox {
      width: 1500px;
      margin: 0 auto;
      #categoryItems {
        margin-top: 50px;
        justify-content: space-around;
        // background-color: antiquewhite;
        #cImg {
          cursor: pointer;
          width: 220px;
          border-radius: 50%;
        }
        #cName {
          font-size: 1em;
          padding-top: 25px;
          text-align: center;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
