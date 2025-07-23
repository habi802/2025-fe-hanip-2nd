<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const caLink = () => {
  router.push('/categoryList');
};
</script>
<!--           class="form-control p-3 me-3" -->
<template>
  <div class="all">
    <div class="box d-flex">
      <div class="searchBar">
        <input
          @click="caLink"
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
@font-face {
  font-family: 'BMJUA';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff')
    format('woff');
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
      margin-top: 53px;
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
    .categoryBox {
      width: 84.3%;
      margin: 0 auto;
      #categoryItems {
        margin-top: 75px;
        justify-content: space-around;
        // background-color: antiquewhite;
        #cImg {
          cursor: pointer;
          // width: 220px;
          width: 91%;
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

@media (max-width: 650px) {
  .searchBar {
    display: none;
  }
}
</style>
