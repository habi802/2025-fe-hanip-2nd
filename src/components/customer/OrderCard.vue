div
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import defaultImage from "@/imgs/owner/haniplogo_sample.png";

const router = useRouter();

const props = defineProps({
  order: Object,
});

// 주문 상태 표시
const statusText = computed(() => {
  switch (props.order.status) {
    case "01":
      return "미결제";
    case "02":
      return "결제 완료";
    case "03":
      return "음식 준비중";
    case "04":
      return "배달 중";
    case "05":
      return "배달 완료";
    case "06":
      return "주문 취소";
    default:
      return "대기중";
  }
});

const emit = defineEmits(["review", "delete-order", "re-order"]);

const baseUrl = ref(import.meta.env.VITE_BASE_URL);

// 가게 이미지
const imgSrc = computed(() => {
  return props.order && props.order.storePic !== null
    ? `${baseUrl.value}/images/store/${props.order.storeId}/${props.order.storePic}`
    : defaultImage;
});

//날짜!
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24시간제
  };
  return date
    .toLocaleString("ko-KR", options)
    .replace(/\. /g, ".")
    .replace(/\.$/, "");
};

// 리뷰 반응
const reviewButton = computed(() => {
  return props.order.getReview > 0 ? "리뷰 수정" : "리뷰 등록";
});

//시간 계산
const isOverThreeDays = computed(() => {
  const created = new Date(props.order.createdAt);
  const now = new Date();


  const diff = now - created;
  const diffDays = diff / (1000 * 60 * 60 * 24);

  return diffDays > 3;
});

</script>

<template>
  <div class="bigBoard">
    <div class="created">구매 {{ formatDate(props.order.createdAt) }}</div>
    <div class="board">
      <!-- 카드 왼쪽 [ 주문 시간 , 이미지 , 가게 이름 ] -->
      <div class="boardLeft">
        <div class="left-box">
          <div class="imgBox">
            <img class="img" :src="imgSrc" @error="(e) => (e.target.src = defaultImage)" />
          </div>
          <div class="textBox">
            <div>{{ props.order.storeName }}</div>
            <!-- <div class="menumeta">
                            <span class="star">★</span>
                            <span class="total-num">{{ props.order.rating }} ({{ props.order?.reviewLength || "983"
                                }})</span>
                            <span class="heart">♥</span>
                            <span class="total-num">{{ props.order.favorites }}</span>
                        </div> -->
            <!-- <div class="menuminimum">최소 주문 금액 {{ props.order.minAmount?.toLocaleString() }}원</div> -->
          </div>
        </div>
        <div class="right-box">
          <button type="button" class="btn-detail" @click="router.push(`/orders/${props.order.orderId}`)">
            주문 내역 상세
          </button>
          <div class="orderStatus">
            <div class="status">{{ statusText }}</div>
          </div>
        </div>
      </div>

      <!-- 카드 중앙 [ 메뉴 이름, 갯수, 가격 ] -->
      <div class="boardMiddle">
        <div class="menuBox">
          <div class="menu" v-for="menu in props.order.menuItems.slice(0, 3)" :key="menu.id">
            <div class="name">- {{ menu.menuName }}</div>
            <div class="num">{{ menu.quantity }}개</div>
            <div class="price">{{ menu.amount?.toLocaleString() }}원</div>
          </div>
          <!-- 메뉴가 3건 초과일 경우 외 n 건으로 표시 -->
          <div v-if="props.order.menuItems.length > 3" class="more">
            <div class="moreText">
              ... 외 {{ props.order.menuItems.length - 3 }}건
            </div>
          </div>
        </div>
      </div>
      <div class="solide"></div>
      <!-- 카드 오른쪽 [ 총 결제금액, 배달상태 ] -->
      <div class="boardRigth">
        <div class="amount">
          <div class="amountText">총 결제 금액</div>
          <div class="amountNum">
            {{ props.order.totalPrice?.toLocaleString() }}원
          </div>
        </div>
      </div>
    </div>
    <!-- 버튼 -->
    <div class="btns">
      <button type="button" class="btn" @click="$emit('re-order', props.order.menuItems)">
        재주문하기
      </button>
      <button type="button"
        :class="['btn', { 'btn-disabled': props.order.status !== '05' }, { 'none-click': isOverThreeDays }]" @click="
          $emit(
            'review',
            props.order.orderId,
            props.order.storeName,
            props.order.menuItems,
            props.order.getReview
          )
          " :disabled="props.order.status !== '05' || isOverThreeDays">
        {{ reviewButton }}
      </button>
      <button type="button" :class="[
        'btn',
        {
          'btn-disabled':
            props.order.status !== '05' && props.order.status !== '06',
        },
      ]" @click="$emit('delete-order', props.order)"
        :disabled="props.order.status !== '05' && props.order.status !== '06'">
        내역 삭제
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "YFavorite";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/YOnepickTTF-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}

.bigBoard {
  width: 1140px !important;
  // border: #797979 1px solid !important;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;

  .board {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    width: 100%;
    justify-content: space-between;
    align-items: start;

    .boardLeft {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .left-box {
        display: flex;
        padding: 20px;
        gap: 10px;
      }

      .right-box {
        padding: 20px;
      }

      .imgBox {
        width: 100px;
        height: 100px;
        margin-top: 10px;
        border: #797979 1px solid;
        border-radius: 15px;
        overflow: hidden;

        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .textBox {
        font-size: 1.5em;
        font-weight: 500;
        margin-left: 10px;
        margin-top: 10px;
        text-align: left;

        .menumeta {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          margin-bottom: 6px;
        }

        .menuminimum {
          font-size: 13px;
          color: #6c6c6c;
          text-align: left;
          margin-bottom: 12px;
        }
      }
    }

    .boardMiddle {
      width: 100%;
      font-family: "BMJUA";
      font-size: 1.3em;

      .more {
        margin-top: 10px;
        display: flex;
        justify-content: end;
        // margin-right: 50px;
      }

      .menuBox {
        width: 100%;
        display: flex;
        flex-direction: column;

        padding: 0 20px;

        .menu {
          display: flex;
          justify-content: space-between;
          font-family: "BMJUA";
          margin-top: 10px;

          .name {
            width: 200px;
            text-align: left;
          }

          .num {
            width: 50px;
            margin-left: 10px;
            text-align: right;
          }

          .price {
            width: 120px;
            text-align: right;
          }
        }
      }
    }

    .boardRigth {
      width: 100%;
      display: flex;
      justify-content: center;
      gap: 40px;
      text-align: center;

      .amountText {
        font-size: 20px;
        color: #797979;
      }

      .amountNum {
        margin-top: 10px;
        font-size: 24px;
        color: #ff6666;
        font-weight: 700;
      }
    }

    position: relative;
  }

  .removeImg {
    position: absolute;
    top: 45%;
    right: 30px;
    width: 20px;
    //margin-right: 35px;
    //margin-top: 20px;
    margin: 30px;
    cursor: pointer;
  }

  .reviewBigBox {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 400px;
    margin-top: 20px;

    .reviewBox {
      display: flex;
      width: 90%;
      height: 330px;
      margin-top: 20px;
      background-color: #fff;
      border: #797979 3px solid;
      border-radius: 30px;
    }

    .reviewimgBox {
      width: 270px;
      height: 270px;
      overflow: hidden;
      border-radius: 20px;
      margin-top: 25px;
      margin-left: 30px;

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
      margin-left: 20px;
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
        height: 200px;
        border-radius: 30px;
        border: #797979 3px solid;
        overflow: hidden;
      }

      .inputBox {
        font-family: "Pretendard-Regular";
        width: 400px;
        height: 150px;
        border: none;
        resize: none;

        &:focus {
          border: none;
          outline: none;
        }
      }
    }
  }

  .btns {
    display: flex;
    margin-top: 20px;
    gap: 20px;
    justify-content: flex-start;
    background-color: #fff;

    .btn {
      font-size: 1em;
      text-align: center;
      background-color: #fff;
      color: #ff6666;
      width: 172px;
      height: 40px;
      outline: none;
      box-shadow: none;
      border: #ff6666 1px solid;
      border-radius: 8px;

      &:hover {
        background-color: #ff6666;
        border: #ff6666 2px solid;
        color: #fff;
      }
    }

    .btn-disabled {
      color: #6b6b6b;
      border: 1px solid #6b6b6b;
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

.last {
  margin-bottom: 100px;
}

#imgOne {
  font-family: "Pretendard-Regular";
  font-size: 0.6em;
  margin-left: 10px;
  margin-bottom: 10px;
}

.moreText {
  color: #888;
}

.star {
  font-family: "BMJUA";
  font-size: 1.5em;
  color: #fac729;
}

.heart {
  font-family: "YFavorite";
  font-size: 1.25em;
  color: red;
  width: 20px;
}

.total-num {
  font-weight: 600;
}

.solide {
  width: 100%;
  border: 1px #f4f4f4 solid;
  margin: 20px 0px;
}

.btn-detail {
  border-radius: 10px;
}

.created {
  background-color: #fbfbfb;
  font-size: 20px;
  font-weight: 300;
  color: #888;
}

.status {
  color: #ff6666;
  text-align: end;
  font-size: 1.2em;
  margin-top: 10px;
}

.amount {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
}

.none-click {
  border: #888 1px solid !important;
  color: #888 !important;

}
</style>
