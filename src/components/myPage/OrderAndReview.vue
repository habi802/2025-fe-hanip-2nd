<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import defaultImage from "@/imgs/owner/haniplogo_sample.png";

const router = useRouter();

const props = defineProps({
    order: Object,
});

// 주문일 표시
const formatDateTime = (created) => {
    const date = new Date(created);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

// 주문 상태 표시
const statusText = computed(() => {
    switch (props.order.status) {
        case '01':
            return '미결제';
        case '02':
            return '결제 완료';
        case '03':
            return '음식 준비중';
        case '04':
            return '배달 중';
        case '05':
            return '배달 완료';
        case '06':
            return '주문 취소'
        default:
            return '대기중';
    }
});

onMounted(() => {

});

// 가게 이미지
const img = `/pic/store-profile/${props.order?.storeId}/${props.order?.imagePath}`;

// 가게 이미지가 없을 시 대체 이미지 나타내기
const imgSrc = computed(() => {
    return props.order &&
        props.order?.imagePath &&
        props.order?.imagePath !== "null"
        ? `/pic/store-profile/${props.order?.storeId}/${props.order?.imagePath}`
        : defaultImage;
});

// 주문내역 삭제
const emit = defineEmits(["delete-order", "re-order"]);

// 주문 상태에 따른 버튼
const statusBtn = computed(() => {
    switch (props.order.status) {
        case "ORDERED":
            return {
                color: "#6B6B6B",
                border: "2px solid #6B6B6B ",
                pointerEvents: "none",
            };
        case "PREPARING":
            return {
                color: "#6B6B6B",
                border: "2px solid #6B6B6B ",
                pointerEvents: "none",
            };
        case "DELIVERING":
            return {
                color: "#6B6B6B",
                border: "2px solid #6B6B6B ",
                pointerEvents: "none",
            };
        case "CANCELED":
            return {
                color: "#6B6B6B",
                border: "2px solid #6B6B6B ",
                pointerEvents: "none",
            };
        case "COMPLETED":
            return 0;
        default:
            return {
                color: "#6B6B6B",
                border: "2px solid #6B6B6B ",
                pointerEvents: "none",
            };
    }
});
</script>

<template>
    <div class="bigBoard">
        <div class="board">
            <!-- 카드 왼쪽 [ 주문 시간 , 이미지 , 가게 이름 ] -->
            <div class="boardLeft">
                <div class="created">{{ formatDateTime(props.order.createdAt) }}</div>
                <div class="imgBox">
                    <img class="img" :src="imgSrc" @error="(e) => (e.target.src = defaultImage)" />
                </div>
                <div class="textBox">
                    <div>{{ props.order.storeName }}</div>
                    <div class="menumeta">
                        <span class="star">⭐{{ props.order.rating }} ({{ props.order?.reviews || "983" }})</span>
                        <span class="heart">❤️ {{ props.order.favorites }}</span>
                    </div>
                    <div class="menuminimum">최소 주문 금액 {{ props.order.minAmount?.toLocaleString() }}원</div>
                </div>
            </div>

            <!-- 카드 중앙 [ 메뉴 이름, 갯수, 가격 ] -->
            <div class="boardMiddle">
                <div class="menuBox">
                    <div class="menu" v-for="menu in props.order.menuItems.slice(0, 3)" :key="menu.id">
                        <div class="name">{{ menu.menuName }}</div>
                        <div class="num">{{ menu.quantity }}개</div>
                        <div class="price">{{ menu.amount?.toLocaleString() }}원</div>
                    </div>
                    <!-- 메뉴가 3건 초과일 경우 외 n 건으로 표시 -->
                    <div v-if="props.order.menuItems.length > 3" class="more">
                        <div class="moreText">... 외 {{ props.order.menuItems.length - 3 }}건</div>
                    </div>
                </div>
            </div>

            <!-- 카드 오른쪽 [ 총 결제금액, 배달상태 ] -->
            <div class="boardRigth">
                <div class="amount">
                    <div class="amountText">총 결제 금액</div>
                    <div class="amountNum">{{ props.order.totalPrice?.toLocaleString() }}원</div>
                </div>
                <div class="orderStatus">
                    <div class="amountText">배달상태</div>
                    <div class="amountNum">{{ statusText }}</div>
                </div>
            </div>

            <!-- 버튼 -->
            <div class="btns">
                <button type="button" class="btn" @click="$emit('re-order', props.order.menuItems)">재주문하기</button>
                <button type="button" :class="['btn', { 'btn-disabled': props.order.status !== '05' }]"
                    @click="$emit('review', props.order.orderId)" :disabled="props.order.status !== '05'">리뷰
                    등록</button>
                <button type="button" class="btn" @click="router.push(`/orders/${props.order.orderId}`);">주문 상세</button>
                <button type="button"
                    :class="['btn', { 'btn-disabled': props.order.status !== '05' && props.order.status !== '06' }]"
                    @click="$emit('delete-order', props.order)"
                    :disabled="props.order.status !== '05' && props.order.status !== '06'">내역 삭제</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bigBoard {
    width: 1280px !important;
    border: #797979 2px solid !important;
    border-radius: 25px;
    margin-bottom: 36px;
    display: flex;
    flex-direction: column;
    padding: 20px;

    .board {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;

        .boardLeft {
            .imgBox {
                width: 260px;
                height: 170px;
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

            .created {
                font-size: 20px;
                margin-top: -10px;
                margin-left: 10px;
            }

            .textBox {
                font-family: "BMJUA";
                font-size: 1.5em;
                font-weight: 700;
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
            width: 500px;
            margin-top: 20px;
            font-family: "BMJUA";
            font-size: 1.3em;

            .more {
                margin-top: 10px;
                display: flex;
                justify-content: end;
                margin-right: 50px;
            }

            .menuBox {
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
            display: flex;
            gap: 80px;
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
        flex-direction: column;
        gap: 20px;
        justify-content: flex-end;
        align-items: flex-end;

        .btn {
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
            border-radius: 8px;

            &:hover {
                background-color: #ff6666;
                border: #ff6666 2px solid;
                color: #fff;
            }
        }

        .btn-disabled {
            color: #6B6B6B;
            border: 2px solid #6B6B6B;
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
</style>
