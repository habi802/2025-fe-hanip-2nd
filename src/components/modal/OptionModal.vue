<script setup>
import { reactive, computed, ref, onMounted } from 'vue';
import { addItem } from '@/services/cartService';
import { useCartStore } from '@/stores/cartStore';
import ConfirmModal from '@/components/modal/ConfirmModal.vue'; // 컴포넌트 추가
import { removeCart } from '@/services/cartService';
import AlertModal from '@/components/modal/AlertModal.vue'; // 컴포넌트 가져오기
import { useAccountStore } from '@/stores/account';

const alertModal = ref(null);
const confirmModal = ref(null);

const account = useAccountStore();

const firstItem = reactive({
    itemInfo: Object
})

const cartStore = useCartStore()

const menuData = reactive({
    menuId: 0,
    cartStoreId: 0,
    storeId: 0,
    name: '',
    comment: '',
    price: 0,
    options: []
});
const setMenuData = (data) => {
    menuData.menuId = data.menuId;
    menuData.storeId = data.storeId;
    menuData.name = data.name;
    menuData.comment = data.comment;
    menuData.price = data.price;
    menuData.options = data.options;
    menuData.cartStoreId = data.cartStoreId;

    console.log("필수 선택 배열", sortedOptions)
    console.log("메뉴옵션 데이터", menuData.options)
    quantityNum.value = 1;



    // 필수 옵션 자동 추가용

    menuOption.optionId = [];
    menuData.options.forEach(optionItem => {
        if (optionItem.isRequired === 1 && optionItem.children.length > 0) {
            menuOption.optionId.push(optionItem.optionId);           // 부모 옵션 ID
            menuOption.optionId.push(optionItem.children[0].optionId); // 첫 번째 자식 ID
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

const onOptionSelect = (event, optionId, childId) => {

    const optionGroup = menuData.options.find(opt => opt.optionId === optionId);
    if (!optionGroup) return;

    // 이미 체크된 상태이고, 그룹이 필수이면 체크 해제 방지
    if (optionGroup.isRequired === 1 && menuOption.optionId.includes(childId)) {
        event.preventDefault();
        return;
    }


    const groupChildren = menuData.options.find(opt => opt.optionId === optionId)?.children.map(c => c.optionId) || [];

    let idx = menuOption.optionId.indexOf(optionId);
    // 문자열로 변환하여 비교
    const currentOptionIds = [...menuOption.optionId];

    // 겹치는지
    const hasOption = currentOptionIds.some(id => id === String(optionId));
    const hasChild = currentOptionIds.some(id => id === String(childId));
    // 필수 체크
    const isRequired = optionGroup.isRequired === 1;

    console.log('현재 옵션 목록:', currentOptionIds);
    console.log('확인 중인 옵션:', optionId, childId);
    console.log('포함 여부:', hasOption, hasChild);

    if (hasOption && hasChild && isRequired != 1) {
        if (idx !== -1) menuOption.optionId.splice(idx, 1);
        menuOption.optionId = menuOption.optionId.filter(id => !groupChildren.includes(id));
        console.log('이미 선택된 옵션이므로 삭제합니다.');
        console.log('선택된 옵션 아이디:', optionId);
        console.log('선택된 자식 아이디:', childId);

        console.log("전체 옵션", menuOption.optionId)

        return;
    }




    if (idx !== -1) menuOption.optionId.splice(idx, 1);

    menuOption.optionId = menuOption.optionId.filter(id => !groupChildren.includes(id));

    menuOption.optionId.push(optionId);
    menuOption.optionId.push(childId);




    console.log('선택된 옵션 아이디:', optionId);
    console.log('선택된 자식 아이디:', childId);

    console.log("전체 옵션", menuOption.optionId)

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

const emit = defineEmits(['cartAdded'])


const goCart = async () => {
    if(!account.state.loggedIn){
        alertModal.value.open('로그인 후 이용해주세요');
    }


    console.log("내가 담을려고 하는 메뉴의 스토어 아이디", menuData.storeId);
    console.log("메뉴에 지금 담긴 스토어 아이디", menuData.cartStoreId);



    if (menuData.cartStoreId != 0 && menuData.storeId != menuData.cartStoreId) {
        const isConfirmed = await confirmModal.value.showModal('이미 장바구니가 담겨있습니다. 장바구니를 비우시겠습니까?');

        if (isConfirmed) {
            const remove = await removeCart();

            if (remove.data.resultStatus === 200) {
                alertModal.value.open('장바구니를 비웠습니다. 메뉴를 다시 담아주세요');
            }
        } else {

            return;
        }
        return;
    }



    const res = await addItem(menuOption);
    if (res.data.resultStatus === 200) {
        console.log("카트 메뉴 담기 성공 !")

        console.log("담긴 카트 ", res.data.resultData)
        emit('cartAdded', res.data.resultData);
        menuOption.optionId = [];
        menuData.options.children = [];
    }
}
// onMounted(async () => {
//     await cartStore.getCart();
//     firstItem.itemInfo = cartStore.items[0]; // items 배열 이름에 따라 달라질 수 있음
//     console.log("첫 번째 카트 아이템:", firstItem.itemInfo);
//     console.log("스토어 아이디:", firstItem.itemInfo.storeId);

// })

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
                                    <input class="option-btn" type="checkbox" :name="'option-' + optionItem.optionId"
                                        :checked="menuOption.optionId.includes(child.optionId)"
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
        <alert-modal ref="alertModal"></alert-modal>
        <ConfirmModal ref="confirmModal"></ConfirmModal>
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