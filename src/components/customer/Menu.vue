<script setup>
import { addItem } from '@/services/cartService';
import { useAccountStore } from '@/stores/account';
import defaultImage from '@/imgs/owner/owner-service3.png';
import { computed, ref } from 'vue';
import { getOption } from '@/services/menuService';

import OptionModal from '../modal/OptionModal.vue';

const optionModal = ref(null);

const openModal = async () => {


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
        name: String,
        price: Number,
        comment: String,
        imagePath: String,
        options: []
    }
});





const menuSrc = computed(() => {
    return props.item && props.item?.imagePath && props.item?.imagePath !== 'null'
        ? `/pic/menu-profile/${props.item.menuId}/${props.item?.imagePath}`
        : defaultImage;
})



</script>

<template>
    <div class="menu border rounded-4" @click="openModal">
        <div class="row-box">
            <div class="container">
                <div class="menu-box">
                    <h5>{{ props.item.name }}</h5>
                    <p class="comment">{{ props.item.comment }}</p>
                    <div class="bottom-box">
                        <span>{{ props.item.price.toLocaleString() }}원</span>
                        <span class="check">
                        </span>
                    </div>
                </div>
            </div>
            <div id="menuImgs" class="col-4 col-md-2 border rounded">
                <img class="menuImgBox" :src="menuSrc" @error="e => e.target.src = defaultImage" />
            </div>
        </div>
    </div>
    <!-- 공통 알림 모달 -->
    <div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">알림</h5>
                </div>
                <div class="modal-body" id="alertModalBody">내용</div>
                <div class="modal-footer">
                    <button type="button" class="btn " data-bs-dismiss="modal">
                        확인
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">알림</h5>
                </div>
                <div class="modal-body" id="alertModalBody">내용</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                        확인
                    </button>
                </div>
            </div>
        </div>
    </div>

    <option-modal ref="optionModal"></option-modal>
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
}

.menu {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    padding: 20px 10px 20px 10px;
    margin-top: 20px;

    &:hover {
        border-color: #fcaeae !important;
    }
}

#menuImgs {
    display: flex;
    width: 170px;
    height: 104px;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    margin-left: 25px;

    .menuImgBox {
        width: 170px;
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

}




.comment {
    font-size: 18px;
    margin-top: 10px;
    width: 600px;
    min-height: 30px;
    color: #9E9E9E;
    word-wrap: break-word;
    white-space: pre-wrap;
    line-height: 1.6;
    text-align: left;
}
</style>
