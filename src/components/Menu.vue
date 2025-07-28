<script setup>
import { addItem } from '@/services/cartService';
import { useAccountStore } from '@/stores/account';
import defaultImage from '@/imgs/owner/haniplogo_sample2.png'

const account = useAccountStore();
const emit = defineEmits(['addCart'])

const props = defineProps({
    item: {
        id: Number,
        name: String,
        comment: String,
        price: Number,
        imagePath: String
    }
});

//메뉴 이미지
const menuImg = `/pic/menu-profile/${props.item.id}/${props.item?.imagePath}`

const addCart = async () => {
    if (!account.state.loggedIn) {
        alert('로그인 후 주문이 가능합니다.');
        return;
    }

    const res = await addItem(props.item.menuId);

    if (res === undefined) {
        alert('등록 실패');
        return;
    } else if (res.status === 500) {
        emit('addCart', props.item);
    } else {
        props.item.id = res.data.resultData;
        emit('addCart', props.item);
    }
};

// 

</script>

<template>
    <div class="menu border rounded p-3 mb-2" @click="addCart()">
        <div class="row">
            <div class="col-8 col-md-10">
                <h5>{{ props.item.name }}</h5>
                <p>{{ props.item.comment }}</p>
                <div class="bottom-box">
                    <span>{{ props.item.price.toLocaleString() }}원</span>
                    <!-- 수량 증가 박스 -->
                    <span class="check">
                        <!-- 0이 되면 스타일 바뀌게 해야함 -->
                        <!-- <div class="check-box"> - </div> -->
                        <!-- 갯수 -->
                        <!-- <div> 0 </div> -->
                        <!-- <div class="check-box"> + </div> -->

                    </span>
                </div>
            </div>
            <div id="menuImgs" class="col-4 col-md-2 border rounded">
                <img class="menuImgBox" :src="menuImg" @error="e => e.target.src = defaultImage" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.menu {
    cursor: pointer;

    &:hover {
        border-color: #fcaeae !important;
    }
}
#menuImgs{
    margin-left: -15px;
    display: flex;
    width: 170px;
    height: 104px;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    .menuImgBox{
        width: 170px;
    }
}
.bottom-box{
    display: flex;
    justify-content: space-between;
}
.check{
    display: flex;
    padding-right: 30px;
    gap: 10px;
}
.check-box{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border: #000 2px solid;
    font-size: 23px;
    border-radius: 5px;
}
.row{
    display: flex;
    justify-content: center;

}
.col-8 {
    width: 80%;
    margin-left: -15px;
}
</style>
