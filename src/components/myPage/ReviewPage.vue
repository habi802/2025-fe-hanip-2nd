<script setup>
import { reactive, ref, onMounted } from "vue";
import { saveReview } from "@/services/reviewServices";
import { useRoute } from "vue-router";
import { getStore } from "@/services/storeService";
import { getOwnerOrder2 } from "@/services/orderService";

const route = useRoute();

const state = reactive({
  review: {
    orderId: "",
    rating: 0,
    comment: "",
  },
  img: null,
  store: {
    name: "",
  },
  menu: {
    menuName: "",
  },
});

//

onMounted(async () => {
  const id = route.params.id;
  //   console.log("id: ", id);
  state.review.orderId = id;
  const res = await getOwnerOrder2(id);

    console.log("orderId: ", state.review.orderId);
    console.log("res", res.data.resultData);
  const storeId = res.data.resultData.storeId;
  const ress = await getStore(storeId);
  //   console.log("ress :", ress.data);
  state.store = ress.data.resultData;
  state.menu = res.data.resultData;
  //   console.log(state.store.name);
});

//
const previewUrl = ref(""); //이미지 경로 저장용

const onImageChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  state.review.img = file;
};
// 리뷰 별점
const selected = ref(0);
const stars = [1, 2, 3, 4, 5];

const selectStar = (index) => {
  selected.value = index + 1;
};

// 리뷰 등록
const addReview = async () => {
  console.log("star", selected.value);
  state.review.rating = selected.value;
  console.log(state.review);

  const formData = new FormData();
  formData.append("img", state.review.img);
  formData.append(
    "req",
    new Blob([JSON.stringify(state.review)], { type: "application/json" })
  );
  const res = await saveReview(formData);
};
</script>

<template>
  <div class="allBox">
    <!-- 페이지 상단 -->
    <div class="box">
      <!-- 보더 왼쪽 -->
      <!-- <div class="userboard">
                <div class="userLeft">
                    <img class="userImg" src="/src/imgs/userImg.png" />
                    <div class="user">
                        <div>{{ user.name }}님 &nbsp; 반가워요!</div>
                        <div class="smalluser">
                            <span class="ip">한입</span>
                            <span class="rank">등급</span>
                        </div>
                    </div>
                </div> -->
      <!-- 보더 오른쪽 -->
      <!-- <div class="userright">
                    <div class="right">
                        <div>총 주문 수</div>
                        <div class="num">{{ user.orders }}</div>
                    </div>
                    <div class="right">
                        <div>쿠폰</div>
                        <div class="num">{{ user.cupon }}</div>
                    </div>
                    <div class="right">
                        <div>포인트</div>
                        <div class="num">{{ user.point }}</div>
                    </div>
                </div>
            </div> -->
      <!-- 선 -->
      <div class="top-txet">리뷰 남기기</div>
      <div class="mid">
        <div class="solied"></div>
      </div>

      <!-- 리뷰 박스 -->
      <div class="reviewBigBox">
        <div class="reviewBox">
          <div v-if="previewUrl">
            <div class="reviewimgBox">
              <img class="reviewImg" :src="previewUrl" />
            </div>
            <div class="img-under-text">
              <div class="img-under-text">
                <div>{{ state.store.name }}</div>
                <div class="small-text">{{ state.menu.menuName }}</div>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="reviewimgBox">
              <img class="reviewImg" src="/src/imgs/owner/owner-service2.png" />
            </div>
            <div class="img-under-text">
              <div class="img-under-text">
                <div>{{ state.store.name }}</div>
                <div class="small-text">{{ state.menu.menuName }}</div>
              </div>
            </div>
          </div>
          <div class="reviewBoxLeft">
            <div class="nameBox">
              <!-- 이름 필요 -->
              <div class="leftName">별점</div>
              <div
                id="starFill"
                v-for="(star, index) in stars"
                :key="index"
                :class="{ filled: index < selected }"
                @click="selectStar(index)"
              >
                ★
              </div>
              <div>
                <input
                  type="file"
                  id="imgOne"
                  accept="image/*"
                  @change="onImageChange"
                />
                <div></div>
              </div>
            </div>
            <div class="leftBox">
              <textarea
                class="inputBox"
                placeholder="리뷰를 입력해주세요"
                v-model="state.review.comment"
              />
            </div>
            <div class="btns">
              <div class="cancell btn">등록 취소</div>
              <div @click="addReview" class="signUp btn">리뷰 등록</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 폰트
@font-face {
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
    format("woff");
  font-weight: normal;
  font-style: normal;
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff");
}

* {
  font-family: "BMJUA";
  font-weight: 800;
}

//
.allBox {
  display: flex;
  justify-content: center;
  margin-top: 150px;
  width: 100%;
  height: 1050px;
}

// 상단 고객 정보 부분
.box {
  display: flex;
  flex-wrap: wrap;
  width: 1500px;

  justify-content: center;
  height: 500px;

  .userboard {
    align-items: center;
    //
    display: flex;
    justify-content: space-around;
    width: 1120px;
    height: 228px;
    border-radius: 25px;
    border: #000 solid 1px;

    .userLeft {
      display: flex;
      align-items: center;

      .userImg {
        width: 20%;
        height: 20%;
        margin-left: 45px;
      }

      .user {
        font-family: "BMJUA";
        font-size: 1.5em;
        letter-spacing: 1px;
        margin-left: 32px;
        margin-top: 14px;

        .smalluser {
          font-size: 0.7em;
          letter-spacing: 1px;

          .ip {
            margin-left: 5px;
            color: #ff6666;
          }

          .rank {
            margin-left: 5px;
          }
        }
      }
    }

    .userright {
      display: flex;
      gap: 150px;
      margin-left: 150px;
    }

    .right {
      align-items: center;
      text-align: center;
      font-family: "BMJUA";
      font-size: 1.2em;
      margin-top: 20px;
      margin-left: -170px;
      width: 250px;

      .num {
        margin-top: 10px;
        font-size: 1.3em;
      }
    }
  }
}

.top-txet {
  width: 100%;
  text-align: center;
  font-size: 24px;
  margin-top: 84px;
  margin-bottom: 50px;
}

.mid {
  display: flex;
  justify-content: center;
  margin-bottom: 80px;

  .solied {
    width: 1480px;
    z-index: 99;
    border: #6c6c6c 2px solid;
  }
}

// 하단 리뷰 부분
.reviewBigBox {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 400px;

  .reviewBox {
    display: flex;
    justify-content: center;
    width: 1123px;
    height: 367px;
    margin-top: 20px;
    background-color: #fff;
    border: #797979 3px solid;
    border-radius: 30px;
  }

  .reviewimgBox {
    width: 297px;
    height: 197px;
    overflow: hidden;
    border-radius: 20px;
    margin-top: 50px;
    margin-left: -15px;

    .reviewImg {
      width: 300px;
      height: 300px;
      object-fit: cover;
      display: block;
    }
  }

  .reviewBoxLeft {
    font-family: "BMJUA";
    font-size: 1.3em;
    margin-left: 80px;
    margin-top: 45px;

    .nameBox {
      display: flex;

      .leftName {
        margin-left: 10px;
        margin-right: 10px;
        letter-spacing: 1px;
      }
    }

    .leftBox {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 500px;
      height: 159px;
      border-radius: 15px;
      border: #e8e8e8 1px solid;
      overflow: hidden;
    }

    .inputBox {
      font-family: "Pretendard-Regular";
      width: 400px;
      height: 100px;
      border: none;
      resize: none;

      &:focus {
        border: none;
        outline: none;
      }
    }
  }
}

#starFill {
  color: darkgray;
  margin-left: 2px;
  cursor: pointer;
}

.stars {
  font-size: 30px;
}

.filled {
  color: yellow !important;
}

#imgOne {
  font-family: "Pretendard-Regular";
  font-size: 0.6em;
  margin-left: 10px;
  margin-bottom: 10px;
}

.img-under-text {
  text-align: center;
  margin-top: 20px;
  margin-left: -10px;
  font-weight: 800;
  font-size: 20px;

  .small-text {
    color: #d4d4d4;
  }
}

// 등록 취소, 리뷰 등록 버튼
.btns {
  position: absolute;
  left: 45.2%;
  margin-top: 20px;

  .cancell {
    width: 234px;
    color: #ff6666;
    border: #ff6666 1px solid;
    font-size: 24px;
  }

  .signUp {
    width: 234px;
    color: #ff6666;
    border: #ff6666 1px solid;
    font-size: 24px;
    margin-left: 30px;
  }
}
</style>
