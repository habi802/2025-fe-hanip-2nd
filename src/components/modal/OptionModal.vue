<script setup>
import { reactive } from 'vue';

const menuData = reactive({
    name: '',
    comment: '',
    price: 0,
    options: []
});
const setMenuData = (data) => {
    menuData.name = data.name;
    menuData.comment = data.comment;
    menuData.price = data.price;
    menuData.options = data.options || [];
};

defineExpose({ setMenuData, menuData })
console.log("메뉴 데이터", menuData)




</script>

<template>
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="option-title"> 옵션 </div>
                <hr>
                </hr>
                <div class="header">
                    <!-- 메뉴 이름 -->
                    <div class="menu-name" id="staticBackdropLabel">{{ menuData.name }}</div>
                    <!-- 메뉴 설명 -->
                    <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
                </div>
                <div class="menu-comment">{{ menuData.comment }}</div>
                <div class="body">
                    <!-- 여기 v-for 돌려야 함 option-body가 하나의 옵션  -->
                    <div class="option-body">
                        <div class="option-name"> 맵기 </div>
                        <hr>
                        </hr>
                        <div class="essential">필수</div>
                        <div class="option-select">
                            <!-- 옵션 세부선택 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 0번방 애만 먼저 가져오고 -->
                                <input class="option-btn" name="spiciness" type="radio" checked>
                                </input>
                                <span class="option-detail">순한맛</span>
                                <!-- 메뉴 가격 -->
                                <div class="menu-price">0원</div>
                            </div>


                            <!-- 옵션 세부선택  1번방 이상부터 v-for 돌려야하나..? 싶음 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 -->
                                <input class="option-btn" name="spiciness" type="radio">
                                </input>
                                <span class="option-detail">보통맛</span>
                                <!-- 메뉴 가격 -->
                                <div class="menu-price">0원</div>
                            </div>


                            <!-- 옵션 세부선택 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 -->
                                <input class="option-btn" name="spiciness" type="radio">
                                </input>
                                <span class="option-detail">매운맛</span>
                                <!-- 메뉴 가격 -->
                                <div class="menu-price">0원</div>
                            </div>
                        </div>
                    </div>

                    <div class="option-body">
                        <div class="option-name"> 소스 </div>
                        <hr>
                        </hr>
                        <div class="essential">선택</div>
                        <div class="option-select">
                            <!-- 옵션 세부선택 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 0번방 애만 먼저 가져오고 -->
                                <!-- name값 v-for 돌릴 때 + i 식으로 숫자 늘려서 묶어줘야함 중복선택 x -->
                                <input class="option-btn" name="spiciness" type="radio" checked>
                                </input>
                                <span class="option-detail">머스타드</span>
                                <!-- 메뉴 가격 -->
                                <div class="menu-price">100원</div>
                            </div>
                            <!-- 옵션 세부선택  1번방 이상부터 v-for 돌려야하나..? 싶음 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 -->
                                <input class="option-btn" name="spiciness" type="radio">
                                </input>
                                <span class="option-detail">케찹</span>
                                <!-- 메뉴 가격 -->
                                <div class="menu-price">100원</div>
                            </div>
                            <!-- 옵션 세부선택 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 -->
                                <input class="option-btn" name="spiciness" type="radio">
                                </input>
                                <span class="option-detail">칠리</span>
                                <!-- 메뉴 가격 -->
                                <div class="menu-price">100원</div>
                            </div>
                        </div>
                    </div>

                    <div class="option-body">
                        <div class="option-name"> 토핑 </div>
                        <hr>
                        </hr>
                        <div class="essential">선택</div>
                        <div class="option-select">
                            <!-- 옵션 세부선택 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 0번방 애만 먼저 가져오고 -->
                                <!-- name값 v-for 돌릴 때 + i 식으로 숫자 늘려서 묶어줘야함 중복선택 x -->
                                <input class="option-btn" name="spiciness" type="radio" checked>
                                </input>
                                <span class="option-detail">치킨너겟</span>
                                <!-- 메뉴 가격 -->
                                <div class="menu-price">2,000원</div>
                            </div>
                            <!-- 옵션 세부선택  1번방 이상부터 v-for 돌려야하나..? 싶음 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 -->
                                <input class="option-btn" name="spiciness" type="radio">
                                </input>
                                <span class="option-detail">만두</span>
                                <!-- 메뉴 가격 -->
                                <div class="menu-price">2,000원</div>
                            </div>
                            <!-- 옵션 세부선택 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 -->
                                <input class="option-btn" name="spiciness" type="radio">
                                </input>
                                <span class="option-detail">팽이버섯</span>
                                <!-- 메뉴 가격 -->
                                <div class="menu-price">30,000원</div>
                            </div>
                        </div>
                    </div>




                </div>
                <hr class="solide-bottom">
                </hr>
                <div class="solide-bottom-body">
                    <div class="num-text">
                        <div>수량</div>
                    </div>
                    <div class="quantity">
                        <div class="quantity-box">
                            <div class="quantity-text-m">–</div>
                        </div>
                        <div class="quantity-num">
                            1
                        </div>
                        <div class="quantity-box">
                            <div class="quantity-text-p">+</div>
                        </div>
                    </div>
                </div>



                <div class="footer-btn">
                    <button type="button" class="hn-btn-gray" data-bs-dismiss="modal">주문취소</button>
                    <button type="button" class="hn-btn-gray">메뉴담기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.option-title {
    margin: 30px 0px 30px 0px;
    text-align: center;
    font-weight: 400;
    font-size: 1.2em;
}

.header {
    font-weight: 600;
    font-size: 1.3em;
    display: flex;
    justify-content: center;
    text-align: center;
}

.menu-name {
    margin-top: 20px;
}

.menu-comment {
    padding: 0px 40px 0px 40px;
    text-align: center;
    font-weight: 400;
    margin-bottom: 30px;
}

.body {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 500px;
}

.option {
    width: 500px;
}

.option-body {
    margin-top: 20px;
}

hr {
    margin-top: 5px;
}

.option-name {
    font-weight: 400;
}

.essential {
    font-weight: 400;
    font-size: 0.7em;
    margin-top: -15px;
    margin-bottom: 15px;
}

.footer-btn {
    display: flex;
    justify-content: center;
    padding: 15px;
}


.options {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 350px;
    font-weight: 400;
    padding: 5px 0px 5px 0px;
    color: #888;
}

.option-detail {
    width: 150px;
    text-align: start;
}

.menu-price {
    width: 100px;
    text-align: end;
}



input {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #cccccc;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
    position: relative;
}

input:checked {
    border-color: #ff6666;
}

input:checked::before {
    content: "";
    width: 70%;
    height: 70%;
    background-color: #ff6666;
    border-radius: 50%;
    position: absolute;
    transform: translate(25%, 25%);

}

.hn-btn-gray {
    margin: 20px;
    padding: 10px 40px 10px 40px !important;
}

.quantity {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 20%;
}

.solide-bottom-body {
    display: flex;
    justify-content: space-around;
}

.solide-bottom {
    margin-top: 30px;
    margin-bottom: 30px;
}

.modal-content {
    max-height: 854px;
}

.body {
    max-width: 495px;
    max-height: 500px;
    overflow-y: auto;
}
</style>