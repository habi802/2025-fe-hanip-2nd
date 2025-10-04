<script setup>
import { addItem } from '@/services/cartService';
import { useAccountStore } from '@/stores/account';
import defaultImage from '@/imgs/owner/owner-service3.png';
import { computed, reactive, ref } from 'vue';
import { getOption } from '@/services/menuService';
import { useCartStore } from '@/stores/cartStore';

import OptionModal from '../modal/OptionModal.vue';

const optionModal = ref(null);
const cartStore = useCartStore();



const openModal = async () => {
    await cartStore.getCart();


    firstItem.itemInfo = cartStore.items[0] ? cartStore.items[0] : 0;

    if (firstItem.itemInfo != 0) {
        props.item.cartStoreId = firstItem.itemInfo.storeId;
    } else {
        props.item.cartStoreId = 0;
    }
    console.log("첫 번째 카트 아이템의 스토어 아이디:", firstItem.itemInfo.storeId);


    const res = await getOption(props.item.menuId);
    props.item.options = res.data.resultData.options;


    optionModal.value.setMenuData(props.item)
    const modalElement = optionModal.value.$el;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
};
const account = useAccountStore();
const emit = defineEmits(['addCart'])

const props = defineProps({
    item: {
        menuId: Number,
        cartStoreId: Number,
        storeId: Number,
        name: String,
        price: Number,
        comment: String,
        imagePath: String,
        storeId: Number,
        options: []
    }
});

const baseUrl = ref(import.meta.env.VITE_BASE_URL);



const menuSrc = computed(() => {
    return props.item.storeId && props.item.imagePath && props.item.imagePath !== 'null'
        ? `${baseUrl.value}/images/store/${props.item.storeId}/menu/${props.item.menuId}/${props.item?.imagePath}`
        : defaultImage;
})

const firstItem = reactive({
    itemInfo: Object
})


// onMounted(async () => {
// await cartStore.getCart();
// firstItem.itemInfo = cartStore.items[0]; // items 배열 이름에 따라 달라질 수 있음
// console.log("첫 번째 카트 아이템:", firstItem.itemInfo[0]);
// console.log("스토어 아이디:", firstItem.itemInfo.storeId);

// })




</script>

<template>
    <div class="big-box">
        <div class="menu border rounded-4" @click="openModal">
            <div class="row-box">
                <div id="menuImgs" class="col-4 col-md-2 border rounded">
                    <img class="menuImgBox" :src="menuSrc" @error="e => e.target.src = defaultImage" />
                </div>
                <div class="container">
                    <div class="menu-box">
                        <h5>{{ props.item.name }}</h5>
                        <!-- <p class="comment">{{ props.item.comment }}</p> -->
                        <div class="bottom-box">
                            <span>{{ props.item.price.toLocaleString() }}원</span>
                            <span class="check">
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <teleport to="body">
        <option-modal ref="optionModal" @cartAdded="$emit('cartAdded')"></option-modal>
    </teleport>
</template>

<style lang="scss" scoped>
@font-face {
    // 프리텐다드
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}

* {
    font-family: 'Pretendard-Regular';
    font-size: 20px;
    font-size: 800;
    user-select: none;
    -webkit-user-drag: none;
}


.menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    padding: 10px;


    &:hover {
        border-color: #fcaeae !important;
    }
}

#menuImgs {
    display: flex;
    width: 150px;
    height: 100px;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;

    .menuImgBox {
        width: 100%;
        height: 100%;
    }
}

.bottom-box {
    display: flex;
    justify-content: space-between;
}




.row-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

}

.soldOut {
    display: none;
}
</style>
