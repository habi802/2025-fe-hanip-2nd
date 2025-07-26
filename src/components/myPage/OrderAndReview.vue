<script setup>
import { ref } from 'vue';

//
const props = defineProps({
    order: Object
})


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
}
console.log('props.order', props.order);

</script>

<template>
    <!-- on.value 값에 따라 보드 크기 조절 -->
    <div :style="{ height: on ? '315px' : '750px' }" class="bigBoard">
        <div class="board">
            <div class="boardLeft">
                <div class="imgBox">
                    <img class="img" src="/src/imgs/recStore_1.png" />
                </div>
                <div class="textBox">
                    <div>{{ props.order?.storeName || 'null' }}</div>
                </div>
            </div>
            <div class="boardRight">
                <div class="title">주문내역</div>
                <div class="menuBox">
                    <div class="menu">
                        <div class="name">{{ props.order?.menuName || 'null' }}</div>
                        <div class="num">{{ props.order?.quantity || 0 }}개</div>
                        <div class="price">{{ props.order?.price * props.order?.quantity }}원</div>
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
                <div v-if="on.value" @click="boardBtn" class="btn btn-primary">
                    {{ on ? '리뷰 남기기' : '리뷰 저장하기' }}
                </div>
            </div>
            <div class="remove">
                <img class="removeImg" src="/src/imgs/remove.png" />
            </div>
        </div>
        <div class="reviewBigBox">
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

        </div>
    </div>



</template>

<style lang="scss" scoped>
.btn {
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
    height: 315px;
    border: #6c6c6c 3px solid;
    border-radius: 25px;
    margin-top: 40px;
    overflow: clip;

    .board {
        display: flex;
        width: 100%;
        height: 300px;
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
            border: #6C6C6C 3px solid;
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
                border: #6C6C6C 3px solid;
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
</style>