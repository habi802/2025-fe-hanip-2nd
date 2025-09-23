<script setup>
import { reactive, computed, ref } from 'vue';
import { addItem } from '@/services/cartService';


// 모달 끄는 용도
const closeModal = () => {
    const modalEl = document.getElementById('staticBackdrop');
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
    }
};

const menuData = reactive({
    menuId: 0,
    name: '',
    comment: '',
    price: 0,
    options: []
});
const setMenuData = (data) => {
    menuData.menuId = data.menuId;
    menuData.name = data.name;
    menuData.comment = data.comment;
    menuData.price = data.price;
    menuData.options = data.options;
    console.log("필수 선택 배열", sortedOptions)
    console.log("메뉴옵션 데이터", menuData.options)
    quantityNum.value = 1;


    // 필수 옵션 자동 추가용
    menuOption.optionId = [];
    data.options.forEach(optionItem => {
        if (optionItem.isRequired === 1 && optionItem.children.length > 0) {
            // 필수 옵션이면 첫 번째 자식을 기본 선택
            menuOption.optionId.push(optionItem.optionId);
            menuOption.optionId.push(optionItem.children[0].optionId);
        }
    });

};

defineExpose({ setMenuData, menuData })


const sortedOptions = computed(() => {
    return [...menuData.options].sort((a, b) => b.isRequired - a.isRequired);
});


let quantityNum = ref(1);

const quantityNumM = () => {
    if (quantityNum.value > 1)
        quantityNum.value -= 1;
}


const quantityNumP = () => {
    if (quantityNum.value < 100)
        quantityNum.value += 1;
}

const onOptionSelect = (optionId, childId) => {

    menuOption.optionId.push(optionId);
    menuOption.optionId.push(childId);
    console.log('선택된 옵션 아이디:', optionId);
    console.log('선택된 자식 아이디:', childId);
};


const menuOption = reactive({
    menuId: 0,
    optionId: [],
    quantity: 0,
})

const readyCart = () => {
    menuOption.menuId = menuData.menuId;
    menuOption.quantity = quantityNum.value;
    console.log("카트에 담길 것 확인", menuOption)

    goCart();
}

const goCart = async () => {
    const res = await addItem(menuOption);

    if (res.data.resultStatus === 200) {
        console.log("카트 메뉴 담기 성공 !")
    }
}

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
                </div>
                <div class="menu-comment">{{ menuData.comment }}</div>
                <div class="body">
                    <div class="option-body">
                        <div v-for="optionItem in menuData.options" :key="optionItem.optionId" class="option-body">
                            <!-- 옵션 이름 -->
                            <div class="option-name">{{ optionItem.comment }}</div>
                            <hr />

                            <!-- 필수/선택 표시 -->
                            <div class="essential">{{ optionItem.isRequired === 1 ? '필수' : '선택' }}</div>

                            <!-- 옵션 선택지 -->
                            <div class="option-select">
                                <div class="options" v-for="child in optionItem.children" :key="child.optionId">
                                    <input class="option-btn" type="radio" :name="'option-' + optionItem.optionId"
                                        :checked="optionItem.isRequired === 1 && child === optionItem.children[0]"
                                        @change="onOptionSelect(optionItem.optionId, child.optionId)" />
                                    <span class="option-detail">{{ child.comment }}</span>
                                    <div class="menu-price">{{ child.price }}원</div>
                                </div>
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
                            <div class="quantity-text-m" @click="quantityNumM">–</div>
                        </div>
                        <div class="quantity-num">
                            {{ quantityNum }}
                        </div>
                        <div class="quantity-box">
                            <div class="quantity-text-p" @click="quantityNumP">+</div>
                        </div>
                    </div>
                </div>



                <div class="footer-btn">
                    <button type="button" class="hn-btn-gray" data-bs-dismiss="modal">주문취소</button>
                    <button type="button" class="hn-btn-gray" @click="readyCart" data-bs-dismiss="modal">메뉴담기</button>
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
    padding: 10px 30px 0px 30px;
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