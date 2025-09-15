<script setup>
</script>

<template>
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <img src="/src/imgs/foods.png"></img>
                <div class="header">
                    <!-- 메뉴 이름 -->
                    <div class="menu-name" id="staticBackdropLabel">닭도리도리탕</div>
                    <!-- 메뉴 설명 -->
                    <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
                </div>
                <div class="menu-comment">매운데 좀 덜매운데 맛있게 매운 맛</div>
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
                                <div class="manu-price">0원</div>
                            </div>


                            <!-- 옵션 세부선택  1번방 이상부터 v-for 돌려야하나..? 싶음 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 -->
                                <input class="option-btn" name="spiciness" type="radio">
                                </input>
                                <span class="option-detail">보통맛</span>
                                <!-- 메뉴 가격 -->
                                <div class="manu-price">0원</div>
                            </div>


                            <!-- 옵션 세부선택 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 -->
                                <input class="option-btn" name="spiciness" type="radio">
                                </input>
                                <span class="option-detail">매운맛</span>
                                <!-- 메뉴 가격 -->
                                <div class="manu-price">0원</div>
                            </div>
                        </div>
                    </div>

                    <div class="option-body">
                        <div class="option-name"> 맵기 </div>
                        <hr>
                        </hr>
                        <div class="essential">필수</div>
                        <div class="option-select">
                            <!-- 옵션 세부선택 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 0번방 애만 먼저 가져오고 -->
                                <!-- name값 v-for 돌릴 때 + i 식으로 숫자 늘려서 묶어줘야함 중복선택 x -->
                                <input class="option-btn" name="spiciness" type="radio" checked>
                                </input>
                                <span class="option-detail">순한맛</span>
                                <!-- 메뉴 가격 -->
                                <div class="manu-price">0원</div>
                            </div>
                            <!-- 옵션 세부선택  1번방 이상부터 v-for 돌려야하나..? 싶음 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 -->
                                <input class="option-btn" name="spiciness" type="radio">
                                </input>
                                <span class="option-detail">보통맛</span>
                                <!-- 메뉴 가격 -->
                                <div class="manu-price">0원</div>
                            </div>
                            <!-- 옵션 세부선택 -->
                            <div class="options">
                                <!-- 버튼, 메뉴 이름 -->
                                <input class="option-btn" name="spiciness" type="radio">
                                </input>
                                <span class="option-detail">매운맛</span>
                                <!-- 메뉴 가격 -->
                                <div class="manu-price">0원</div>
                            </div>
                        </div>
                    </div>





                </div>
                <div class="footer">
                    <button type="button" class="hn-btn-white" data-bs-dismiss="modal">주문취소</button>
                    <button type="button" class="hn-btn-white">메뉴담기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
* {
    user-select: none;
    -webkit-user-drag: none;
    font-family: 'Pretendard-Regular';
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
    text-align: center;
    font-weight: 400;
    margin-bottom: 40px;
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

hr {
    margin-top: 5px;
}

.option-name {
    font-weight: 400;
}

.essential {
    font-weight: 400;
    font-size: 0.9em;
    margin-top: -15px;
}

.footer {
    display: flex;
    justify-content: center;
}

.hn-btn-white {
    margin: 20px;
    padding: 10px 40px 10px 40px !important;
}


.options {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 350px;
    font-weight: 400;
    padding: 5px 0px 5px 0px;
}


.option-detail {
    position: relative;
    left: -70px;
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
    width: 80%;
    height: 80%;
    background-color: #ff6666;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

}
</style>