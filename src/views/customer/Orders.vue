<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getOrder, deleteOrder } from '@/services/orderService';
import { addItem, getItem, removeCart } from '@/services/cartService';
import OrderAndReview from '@/components/myPage/OrderAndReview.vue';
import AlertModal from '@/components/modal/AlertModal.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';

const router = useRouter();

const state = reactive({
    orders: [],
});

onMounted(async () => {
    const res = await getOrder({ page: 1, rowPerPage: 10 });
    if (res !== undefined && res.status === 200) {
        state.orders = res.data.resultData;
        console.log(state.orders);
    }
});

// 리뷰 별점
const selected = ref(0);
const stars = [1, 2, 3, 4, 5];

const selectStar = (index) => {
    selected.value = index + 1;
};

const alertModalRef = ref(null);
const confirmModalRef = ref(null);

// 주문 삭제
const deleteOrderOne = async (order) => {
    if (order.status === 'ORDERED' || order.status === 'DELIVERING' || order.status === 'PREPARING') {
        alertModalRef.value.open('진행 중인 주문은 취소할 수 없습니다.');
        return;
    }

    const res = await deleteOrder(order.id);
    if (res !== undefined && res.status === 200) {
        const deleteIdx = state.orders.findIndex((item) => item.id === order.id);
        if (deleteIdx > -1) {
            state.orders.splice(deleteIdx, 1);
        }
    }
};

// 재주문하기
const reorder = async (menus) => {
    const res = await getItem();
    if (res !== undefined && res.status === 200) {
        const carts = res.data.resultData;
        if (carts !== null && carts.length > 0) {
            const isConfirmed = await confirmModalRef.value.showModal('이미 장바구니에 메뉴가 담겨져 있습니다. 장바구니를 비우고 선택한 메뉴를 장바구니에 담으시겠습니까?');
            if (isConfirmed) {
                await removeCart();
            }
        }
    }

    menus.forEach(async menu => {
        const params = {
            menuId: menu.menuId,
            quantity: menu.quantity,
        };

        await addItem(params);
    });

    router.push('/cart');
};

// 더보기 처리
// const allBoxHeight = ref(1570);
// const length = ref(state.orders.length);
// const heightY = () => {
//   allBoxHeight.value += 890;
// };

const visibleCount = ref(3);
const showMore = () => {
    visibleCount.value += 2;
};

const visibleCards = computed(() => {
    return state.orders.slice(0, visibleCount.value);
});

// 화면 상단 이동
const arrow = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};
</script>

<template>
    <div class="all-box" :style="{ height: allBoxHeight + 'px' }">
        <div class="box">
            <!-- 상단 페이지 -->
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
        </div>

        <!-- <div class="filterandsearch">
        <div class="filterbox">
            <select v-model="sleectedFilter" class="dropdown">
            <option :value="default">최근순</option>
            <option value="1week">일주일</option>
            <option value="1month">1개월</option>
            <option value="3months">3개월</option>
            <option value="6months">6개월</option>
            </select>
        </div>
        </div> -->
        
        <!-- 하단 주문 내역 -->
        <div class="board-box">
            <div class="orderList">
                <div>
                    <div class="ordertext">주문 내역</div>
                    <div class="noticetext">주문 변경 시 고객 센터로 문의 바랍니다</div>
                    <div class="solid"></div>
                </div>
            </div>

            <!-- 검색바 -->
            <div class="ex1">
                <div class="search">
                    <span class="searchtext">검색: "주문한 메뉴나 가게를 찾아볼 수 있어요"</span>
                    <img class="search_icon" src="/src/imgs/fluent_search.png" alt="검색" width="35px" height="35px" />
                </div>
            </div>
            <div class="sort-options">
                <span>최근순</span>
                <span class="divider">|</span>
                <span>일주일</span>
                <span class="divider">|</span>
                <span>1개월</span>
                <span class="divider">|</span>
                <span>3개월</span>
                <span class="divider">|</span>
                <span>기간 선택</span>
            </div>
            <div v-for="order in state.orders" :key="order.orderId" style="margin-bottom: 10px">
                <order-and-review :order="order" @delete-order="deleteOrderOne" @reorder="reorder" />
            </div>
        </div>
        
        <!-- 미리보기 용 -->
        <!-- <order-and-review></order-and-review>
        <div :style="{ height: on ? '315px' : '750px' }" class="bigBoard">
        <div class="board">
            <div class="boardLeft">
            <div class="imgBox">
                <img class="img" src="/src/imgs/recStore_1.png" />
            </div>
            <div class="textBox">
                <div>오십계</div>
            </div>
            </div>
            <div class="boardRight">
            <div class="title">주문내역</div>
            <div class="menuBox">
                <div class="menu">
                <div class="name">간장치킨</div>
                <div class="num">1개</div>
                <div class="price">15,000원</div>
                </div>
                <div class="menu">
                <div class="name">메뉴가 아무리 길어도 문제 없다</div>
                <div class="num">1개</div>
                <div class="price">1,150,000원</div>
                </div>
                <div class="menu">
                <div class="name">뿌링클</div>
                <div class="num">1개</div>
                <div class="price">25,000원</div>
                </div>
                <div class="amount">
                <div class="amountText">총 결제 금액</div>
                <div class="amountNum">1,190,000원</div>
                </div>
            </div>
            <div @click="reviewButton" class="btn btn-primary">
                {{ on ? '리뷰 남기기' : '리뷰 저장하기' }}
            </div>
            </div>
            <div class="remove">
            <img class="removeImg" src="/src/imgs/remove.png" />
            </div>
        </div> -->

        <!-- 리뷰 박스 -->
        <!-- <div class="reviewBigBox">
        <div class="reviewBox">
            <div class="reviewimgBox">
            <img class="reviewImg" src="/src/imgs/chicken.png" />
            </div>
            <div class="reviewBoxLeft">
            <div class="nameBox">
                <div class="leftName">서하빈</div>
                <div id="starFill" v-for="(star, index) in stars" :key="index" :class="{ 'filled': index < selected }"
                @click="selectStar(index)">
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
        </div> 
        </div> -->
    </div>

    <AlertModal ref="alertModalRef" />
    <ConfirmModal ref="confirmModalRef" />

    <!-- <div v-if="state.orders.length > 0" class="btnBox">
        <div id="btnB" v-if="visibleCount < state.orders.length" class="btn" @click="showMore">더보기</div>
    </div> -->

    <img @click="arrow" class="arrow" src="/src/imgs/arrow.png" />`
</template>

<style lang="scss" scoped>
.modal {
    font-family: 'Pretendard-Regular';
    font-weight: 800;
}

@font-face {
    // 프리텐다드
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff')
        format('woff');
    font-weight: 400;
    font-style: normal;
}

@font-face {
    font-family: 'BMJUA';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff')
        format('woff');
    font-weight: normal;
    font-style: normal;
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff');
}

* {
    font-family: 'BMJUA';
}

.all-box {
    display: flex;
    flex-wrap: wrap;
    max-width: 1920px;
    width: 100%;
    justify-content: center;
    font-family: 'BMJUA';
    width: 100%;
    overflow: clip;

    .orderList {
        font-weight: 500;
        text-align: center;
        margin-bottom: -50px;

        .ordertext {
            font-weight: 600;
            font-size: 30px;
            margin-top: 20px;
        }

        .solid {
            width: 1470px;
            border: 1px #000 solid;
            margin: 10px 0 80px 0;
        }
    }
}

.noticetext {
    max-width: 1430px;
    margin: 15px auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 18px;
    color: #7d7d7d;
}

.filterandsearch {
    display: flex;
    align-items: center;
    margin-bottom: -37px;
    max-width: 1400px;
}

.filterbox {
    flex: 0 0 120px !important;
    position: relative !important;
}

.dropdown {
    position: absolute;
    top: 260px;
    right: 1230px;
    width: 250px;
    height: 55px;
    font-size: 22px;
    padding: 5px 10px;
    border: 2px solid #6c6c6c;
    border-radius: 8px;
    color: #6c6c6c;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}

.ex1 {
    flex: 1;
    display: flex;
    justify-content: center;
    width: 100%;
}

.search {
    border: 2px solid #ff6666;
    height: 70px;
    width: 1000px;
    border-radius: 15px;
    margin-bottom: 121px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 8px 12px;
    color: #ff6666;
}

.searchtext {
    flex: 1;
    text-align: center;
    font-size: 25px;
    color: #ff6666;
}

.search_icon {
    cursor: pointer;
    right: 20px;
}

.box {
    display: flex;
    justify-content: center;
    font-family: 'Pretendard-Regular';
    width: 1400px;
    max-width: 100%;

    font-size: 1.4em;
    letter-spacing: -1.5px;
    margin-top: 70px;
}

.btn-t {
    font-family: 'BMJUA';
    font-size: 1em;
    text-align: center;
    background-color: #fff;
    color: #ff6666;
    width: 520px;
    height: 40px;
    outline: none;
    box-shadow: none;
    border: #ff6666 2px solid;
    margin-left: 125px;
    margin-top: 10px;
    border-radius: 8px;

    &:active {
        background-color: #ff6666;
        border: #ff6666 2px solid;
    }
}

.bigBoard {
    width: 1080px;
    border: #6c6c6c 3px solid;
    border-radius: 25px;
    margin-bottom: 40px;
    overflow: clip;

    .board {
        display: flex;
        width: 100%;
        justify-content: space-between;
        overflow: clip;

        .boardLeft {
            .imgBox {
                width: 260px;
                height: 170px;
                margin-left: 40px;
                margin-top: 35px;
                border: #6c6c6c 1px solid;
                border-radius: 20px;
                overflow: hidden;

                .img {
                    width: 300px;
                }
            }

            .textBox {
                font-family: 'BMJUA';
                font-size: 1.5em;
                margin-left: 40px;
                margin-top: 10px;
            }
        }

        .boardRight {
            width: 720px;
            height: 300px;
            margin-top: 30px;
            font-family: 'BMJUA';
            font-size: 1.3em;
            margin-left: 30px;

            .menu {
                display: flex;
                justify-content: space-between;
                font-family: 'BMJUA';
                margin-top: 10px;

                .name {
                    width: 250px;
                    text-align: left;
                }

                .num {
                    width: 100px;
                    margin-left: 125px;
                    text-align: right;
                }

                .price {
                    width: 120px;
                    margin-right: 50px;
                    text-align: right;
                }
            }

            .amount {
                display: flex;
                justify-content: right;
                text-align: right;
                letter-spacing: 2px;
                margin-right: 48px;
                margin-top: 10px;

                .amountText {
                    margin-right: 10px;
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
        }

        .reviewBoxLeft {
            font-family: 'BMJUA';
            font-size: 1.3em;
            margin-left: 30px;
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
                font-family: 'Pretendard-Regular';
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
        font-family: 'Pretendard-Regular';
        font-size: 0.6em;
        margin-left: 10px;
        margin-bottom: 10px;
    }

    .board-box {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        width: 1500px;
    }

    .userboard {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 1120px;
        height: 228px;
        border-radius: 25px;
        border: #000 solid 1px;

        .userLeft {
            display: flex;
            align-items: center;
            font-size: 15px;
            margin-left: 30px;

            .userImg {
                width: 20%;
                height: 20%;
                margin-left: 60px;
            }

            .user {
                font-family: 'BMJUA';
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
            text-align: center;
            font-family: 'BMJUA';
            font-size: 20px;
            margin-top: 20px;
            margin-left: -170px;
            width: 250px;

            .num {
                margin-top: 10px;
                font-size: 1.3em;
            }
        }
    }

    .board-box {
        overflow: clip;
    }

    .btnBox {
        display: flex;
        justify-content: center;
    }

    #btnB {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        font-size: 40px;
        width: 60% !important;
        height: 50px;
        margin-left: -5px;
        margin-bottom: 120px;
        margin-top: -20px;
        border: none;
    }

    .arrow {
        position: sticky;
        width: 3.8%;
        bottom: 100px;
        left: 93%;
        z-index: 999;
        margin-bottom: 100px;

        &:hover {
            opacity: 80%;
        }
    }

    .sort-options {
        position: absolute;
        max-width: 1200px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 18px;
        color: #ff7b7b;
        margin-top: 270px;
        margin-left: 1100px
    }

    .sort-options span {
        cursor: pointer;
    }

    .sort-options .divider {
        color: #ffa5a5;
    }

    .sort-options .active {
        color: #ff4c4c;
    }
</style>
