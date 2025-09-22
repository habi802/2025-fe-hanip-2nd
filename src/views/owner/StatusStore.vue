<script setup>
import { reactive, ref } from 'vue';
import { useOwnerStore } from '@/stores/account';
import StoreStatusStaticInfo from '@/components/owner/StoreStatusStaticInfo.vue';
import StoreStatusControl from '@/components/owner/StoreStatusControl.vue';

const owner = useOwnerStore();

const state = reactive({
    form: {
        dynamic: {
            isOpen: owner.state.storeData.isOpen,
            openTime: owner.state.storeData.openTime,
            closeTime: owner.state.storeData.closeTime,
            closedDay: owner.state.storeData.closedDay,
            minAmount: owner.state.storeData.minAmount,
            isPickUp: owner.state.storeData.isPickUp,
            eventComment: owner.state.storeData.eventComment
        },
        static: {
            tel1: owner.state.storeData.tel.split('-')[0],
            tel2: owner.state.storeData.tel.split('-')[1],
            tel3: owner.state.storeData.tel.split('-')[2],
            imagePath: owner.state.storeData.imagePath,
            comment: owner.state.storeData.comment
        }
    }
});

const selected = ref('control');

// 가게 정보 저장
const updateStore = async () => {
    console.log(state.form);

    
};
</script>

<template>
    <div class="section-wrap">
        <div class="btn-group gap-3" role="group">
            <button type="button" class="submenu-btn" :class="selected === 'control' ? 'submenu-active' : 'submenu-none'" @click="selected = 'control'">
                운영관리
            </button>
            <button type="button" class="submenu-btn" :class="selected === 'basic' ? 'submenu-active' : 'submenu-none'" @click="selected = 'basic'">
                기본정보
            </button>
        </div>

        <div class="white-card">
            <StoreStatusControl v-if="selected === 'control'" :form="state.form.dynamic" @update-form="val => state.form.dynamic = val" />
            <StoreStatusStaticInfo v-if="selected === 'basic'" :form="state.form.static" @update-form="val => state.form.static = val" />
            <div class="btn-wrap">
                <span>** 가게 정보 수정 시 내용을 꼭 확인해주세요.** </span>
                <div class="button-row">
                <button class="btn-cancle">취소</button>
                <button type="button" class="owner-btn-white" @click="updateStore">저장하기</button>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.section-wrap {
    width: 95%;
    height: 95%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.white-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.btn-group {
    align-self: flex-start;
    margin-left: 5%; /* white-card가 width 95%니까 같은 위치에 맞추려면 */
}

.btn-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 30px 0;
    
    span {
        display: block;
        text-align: center;
        color: var(--primary);
    }

    .button-row {
        display: flex;
        gap: 20px;
        justify-content: center;
        width: 100%;
    }

    button {
        width: 120px;
        //flex: 0 0 auto; // 여기는 필요하면 살려놔도 돼.
    }
}
</style>