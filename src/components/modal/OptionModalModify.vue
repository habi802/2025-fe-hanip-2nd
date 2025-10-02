<script setup>
import { reactive, computed, ref } from 'vue';
import { addItem } from '@/services/cartService';
import { modifyMenu } from '@/services/cartService';


const menuData = reactive({
    menuId: 0,
    name: '',
    comment: '',
    price: 0,
    options: []
});


const selectData = reactive({
    cartId: 0,
    menuId: 0,
    optionId: [],
    quantity: 0,
});

let quantityNum = ref(1);

const setMenuData = (data) => {
    menuData.menuId = data.menuId;
    menuData.name = data.name;
    menuData.comment = data.comment;
    menuData.price = data.price;
    // data가 옵션 배열이라면 바로 할당
    menuData.options = Array.isArray(data) ? data : (data.options || []);
    console.log("메뉴옵션 데이터", menuData.options)


};

//선택했던 옵션 들고오기...
const setSelectData = (data) => {
    selectData.menuId = data.menuId;
    selectData.quantity = data.quantity;
    selectData.optionId = data.optionId;
    console.log("내가 선택한 옵션", selectData.optionId)
    menuOption.optionId = data.optionId;
    menuOption.quantity = data.quantity;
    selectData.cartId = data.cartId;
    console.log("내가 선택한 갯수", setSelectData.quantity)
}


defineExpose({ setMenuData, setSelectData })





const quantityNumM = () => {
    if (selectData.quantity > 1)
        selectData.quantity -= 1;
}


const quantityNumP = () => {
    if (selectData.quantity < 100)
        selectData.quantity += 1;
}

const onOptionSelect = (event, optionId, childId) => {

    const optionGroup = menuData.options.find(opt => opt.optionId === optionId);
    if (!optionGroup) return;

    const optId = Number(optionId);
    const chId = Number(childId);

    // 선택한 부모의 기존 인덱스 찾기
    const existingParentIndex = menuOption.optionId.findIndex(id => id === optId);

    //원래 있던 부모
    const existingParentIndexs = menuOption.optionId.findIndex((id, idx) =>
        id === optId && menuOption.optionId[idx + 1] === chId
    );

    // 필수 옵션이면 체크 해제 방지 (부모-자식 쌍 기준)
    const existingIndex = menuOption.optionId.findIndex((id, idx) =>
        id === optId && menuOption.optionId[idx + 1] === chId
    );


    if (optionGroup.isRequired === 1 && existingIndex !== -1) {
        event.preventDefault();
        console.log('필수 옵션은 해제할 수 없습니다:', optId, chId);
        return;
    }
    if (existingParentIndexs !== -1) {
        // 이미 선택되어 있으면 제거 (체크 해제)
        menuOption.optionId.splice(existingParentIndex, 2);
        console.log('체크 해제:', optId, chId);

        console.log("전체 옵션", menuOption.optionId);
        return;
    }

    if (existingParentIndex !== -1) {
        // 기존 부모 + 그 다음 인덱스(자식) 제거
        menuOption.optionId.splice(existingParentIndex, 2);
    }


    // 새 부모 + 자식 추가
    menuOption.optionId.push(optId, chId);
    console.log('선택된 옵션 아이디:', optId);
    console.log('선택된 자식 아이디:', chId);

    console.log("전체 옵션", menuOption.optionId);



};


const menuOption = reactive({
    cartId: 0,
    menuId: 0,
    optionId: [],
    quantity: 0,
})

const readyCart = (cartId) => {
    menuOption.cartId = cartId;
    menuOption.menuId = selectData.menuId;
    menuOption.quantity = selectData.quantity;
    console.log("카트에 담길 것 확인", menuOption)

    goCart(cartId);
}

const goCart = async (cartId) => {
    const res = await modifyMenu(cartId, menuOption);
    if (res.data.resultStatus === 200) {
        console.log("카트 메뉴 담기 성공 !")
        emit('cart-updated');
    }
}

const emit = defineEmits(['cart-updated']);

</script>

<template>
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="option-title"> 옵션 변경 </div>
                <div class="top-title"> * 옵션을 변경하지 않을 시 돌아가기 버튼을 눌러주세요</div>
                <hr>
                </hr>
                <div class="header">
                    <!-- 메뉴 이름 -->
                    <!-- <div class="menu-name" id="staticBackdropLabel">{{ menuData.name }}</div> -->
                    <!-- 메뉴 설명 -->
                </div>
                <!-- <div class="menu-comment">{{ menuData.comment }}</div> -->
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
                                    <input class="option-btn" type="checkbox" :name="'option-' + optionItem.optionId"
                                        :checked="selectData.optionId.map(Number).includes(Number(child.optionId))"
                                        @click="onOptionSelect($event, optionItem.optionId, child.optionId)" />
                                    <span class="option-detail">{{ child.comment }}</span>
                                    <div class="menu-price">{{ child.price.toLocaleString() }}원</div>
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
                            {{ selectData.quantity }}
                        </div>
                        <div class="quantity-box">
                            <div class="quantity-text-p" @click="quantityNumP">+</div>
                        </div>
                    </div>
                </div>



                <div class="footer-btn">
                    <button type="button" class="hn-btn-gray" data-bs-dismiss="modal">주문취소</button>
                    <button type="button" class="hn-btn-gray" @click="readyCart(selectData.cartId)"
                        data-bs-dismiss="modal">메뉴담기</button>
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

.top-title {
    text-align: center;
    padding-bottom: 25px;
    font-size: 0.8em;
    color: #ccc;
}
</style>