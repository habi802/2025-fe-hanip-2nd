<!-- 주문 내역 화면에 뿌릴 카드 컴포넌트 -->

<script setup>
import { getStore } from "@/services/storeService";
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import defaultImage from "@/imgs/owner/haniplogo_sample.png"

// 라우터
const router = useRouter();


//리뷰 페이지 이동
const reviewButton = () => {
    router.push(`/reviews-page/${props.order?.id}`);
}


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
};

//
const props = defineProps({
    order: Object,
});

// 버튼 
let on = ref(true);
const boardBtn = () => {
    on.value = !on.value;
    console.log(on.value);
};

// 리뷰 별점
const selected = ref(0);
const stars = [1, 2, 3, 4, 5];

const selectStar = (index) => {
    selected.value = index + 1;
};
console.log("props.order", props.order);

  // 날짜 파싱
const formatDateTime = (isoStr) => {
  return new Date(isoStr).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 배달상태 파싱
const statusText = computed(() => {
  if (!props.order || !props.order.status) return "상태 없음";
  switch (props.order.status) {
    case "ORDERED":
        return "주문 대기중"
    case "PREPARING":
        return "음식준비중";
    case "DELIVERING":
        return "배달중";
    case "CANCELED":
        return "취소됨";
    case "COMPLETED":
        return "완료됨";
    default:
        return "기타 상태";
  }
});


// 가게 이미지
const img = `/pic/store-profile/${props.order?.storeId}/${props.order?.imagePath}`

// 가게 이미지가 없을 시 대체 이미지 나타내기
const imgSrc = computed(() => {
  return props.order && props.order?.imagePath && props.order?.imagePath !== 'null'
  ? `/pic/store-profile/${props.order?.storeId}/${props.order?.imagePath}`
  : defaultImage;
})

// 주문내역 삭제
const emit = defineEmits(['delete-order', 'reorder']);
</script>

<template>
    <!-- 버튼들 -->
    <div class="btns">
        <div class="btn" @click="$emit('reorder', props.order.orderGetList)">재주문 하기</div>
        <div @click="reviewButton" class="btn btn-primary">
            리뷰등록
        </div>
        <div class="btn">주문상세</div>
    </div>
    <!-- 신경 x 2차때 사용 예정 -->
    <div :style="{ height: on ? '315px' : '750px' }" class="bigBoard">

        <!-- 내부 -->
        <div class="board">
            <!-- 카드 왼쪽 [ 주문 시간 , 이미지 , 가게 이름 ] -->
            <div class="boardLeft">
                <div class="created">{{ formatDateTime(props.order.created) }}</div>
                <div class="imgBox">
                    <img class="img" :src="imgSrc" @error="e => e.target.src = defaultImage" />
                </div>
                <div class="textBox">
                    <div>{{ props.order?.storeName || 'null' }}</div>
                </div>
            </div>
            <!-- 카드 중앙 [ 메뉴 이름, 갯수, 가격 ] -->
            <div class="boardRight">
                <div class="menuBox pt-4">
                    <div class="menu" v-for="(menu, index) in props.order.orderGetList.slice(0, 3)" :key="menu.id || index">
                        <div class="name">{{ menu.name || "ㅎㅇ" }}</div>
                        <div class="num">{{ menu.quantity || 0 }}개</div>
                        <div class="price">{{ menu.price * menu.quantity }}원</div>
                    </div>
                    <!-- 메뉴가 많으면 필요함,  -->
                    <div v-if="props.order.orderGetList.length > 3" class="more">
                        <div class="moreText"> ... 외 {{ props.order.orderGetList.length - 3 }}건</div>
                    </div>
                </div>
            </div>
            <!-- 카드 오른쪽 [ 총 결제금액, 배달상태 ] -->
            <div class="boardLastRigth">
                <div class="amount">
                    <div class="amountText">총 결제 금액</div>
                    <div class="amountNum">{{props.order.amount.toLocaleString()}}원</div>
                </div>
                <div>
                    <div class="amountText">배달상태</div>
                    <div class="amountNum">{{ statusText }}</div>
                </div>
            </div>
            <!-- 메뉴 삭제하기 버튼 -->
            <div class="remove" @click="$emit('delete-order', props.order.id)">
                <img class="removeImg" src="/src/imgs/remove.png" />
            </div>
        </div>

        <!-- 리뷰 박스 -->
        <!-- <div class="reviewBigBox">
            <div class="reviewBox">
                <div class="reviewimgBox">
                    <img class="reviewImg" src="/src/imgs/chicken.png" />
                </div>
                <div class="reviewBoxLeft">
                    <div class="nameBox">
                        <div class="leftName">서하빈</div>
                        <div id="starFill" v-for="(star, index) in stars" :key="index"
                            :class="{ 'filled': index < selected }" @click="selectStar(index)">
                            ★
                        </div>
                        <div>
                            <input type="file" id="imgOne" class="" accept="image/*" @change="" />
                            <div>
                            </div>
                        </div>
                    </div>
                    <div class="leftBox">
                        <textarea class="inputBox" placeholder="리뷰를 입력해주세요" />
                    </div>
                </div>
            </div>

        </div> -->
    </div>

</template>

<style lang="scss" scoped>
.btns {
    display: flex;
    position: relative;
    width: 500px;
    gap: 16px;
    right: -800px;
    bottom: -300px;
}

.btn {
    // position: absolute;
    font-family: "BMJUA";
    font-size: 1em;
    text-align: center;
    background-color: #fff;
    color: #ff6666;
    width: 172px;
    height: 40px;
    outline: none;
    box-shadow: none;
    border: #ff6666 2px solid;
    margin-top: 10px;
    border-radius: 8px;

    &:active {
        background-color: #ff6666;
        border: #ff6666 2px solid;
    }
}

.bigBoard {
    width: 1439px !important;
    height: 320px;
    border: #6c6c6c 3px solid;
    border-radius: 25px;
    margin-bottom: 20px;
    overflow: clip;

    .board {
        display: flex;
        width: 100%;
        height: 320px;
        justify-content: space-between;
        align-items: center;
        overflow: clip;

        .boardLeft {
            .imgBox {
                width: 260px;
                height: 170px;
                margin-left: 40px;
                margin-top: 10px;
                border: #6c6c6c 1px solid;
                border-radius: 20px;
                overflow: hidden;

                .img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

            }

            .created {
                font-size: 20px;
                margin-left: 40px;
                margin-top: -10px;
            }

            .textBox {
                font-family: "BMJUA";
                font-size: 1.5em;
                margin-left: 40px;
                margin-top: 10px;
            }
        }

        .boardRight {
            width: 600px;
            height: 300px;
            margin-top: 20px;
            margin-left: -85px;
            font-family: "BMJUA";
            font-size: 1.3em;

            .more {
                margin-top: 10px;
                display: flex;
                justify-content: end;
                margin-right: 50px;
            }

            .menu {
                display: flex;
                justify-content: space-between;
                font-family: "BMJUA";
                margin-top: 10px;

                .name {
                    width: 300px;
                    text-align: left;
                }

                .num {
                    width: 50px;
                    margin-left: 10px;
                    text-align: right;

                }

                .price {
                    width: 120px;
                    margin-right: 50px;
                    text-align: right;
                }
            }


        }
    }

    .removeImg {
        width: 20px;
        margin-right: 35px;
        margin-top: 20px;
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
            border: #6c6c6c 3px solid;
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
                border: #6c6c6c 3px solid;
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
}

.boardLastRigth {
    display: flex;
    gap: 80px;
    text-align: center;
    margin-left: -100px;
    margin-bottom: 100px;

    .amountNum {
        margin-top: 10px;
        font-size: 20px;
        color: #ff6666;

    }

    .amountText {
        font-size: 20px;
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
</style>
