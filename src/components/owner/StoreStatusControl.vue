<script setup>
import { ref } from 'vue';

const props = defineProps({
    form: Object
});

const emit = defineEmits(['update-form']);

const isOpen = ref(props.form.isOpen);
const isPickUp = ref(props.form.isPickUp);

// 토글로 된 데이터 상태 변경
const updateToggle = key => {
    updateForm(key, key === 'isOpen' ? isOpen.value : isPickUp.value);
};

// 부모 컴포넌트(StatusStore.vue)에 입력한 값 전달
const updateForm = (key, value) => {
    emit('update-form', { ...props.form, [key]: value })
}
</script>
<template>
    <div>
        <div class="control-wrap">
            <span>영업 중</span>
            <div class="toggle-container" style="height: 40px">
                <label class="switch">
                    <input type="checkbox" v-model="isOpen" :true-value="1" :false-value="0" @change="updateToggle('isOpen')" />
                    <span class="slider"></span>
                </label>
            </div>
            
            <span>영업 시간</span>
            <div class="d-flex gap-3">
                <input type="time" v-model="props.form.openTime" @change="updateForm('openTime', $event.target.value)" class="gray-content">
                <span>~</span>
                <input type="time" v-model="props.form.closeTime" @change="updateForm('closeTime', $event.target.value)" class="gray-content">
            </div>
            
            <span>휴무일</span>
            <div class="d-flex gap-3">
                <label><input type="radio" v-model="props.form.closedDay" @change="updateForm('closedDay', $event.target.value)" value="월요일">월</input></label>
                <label><input type="radio" v-model="props.form.closedDay" @change="updateForm('closedDay', $event.target.value)" value="화요일">화</input></label>
                <label><input type="radio" v-model="props.form.closedDay" @change="updateForm('closedDay', $event.target.value)" value="수요일">수</input></label>
                <label><input type="radio" v-model="props.form.closedDay" @change="updateForm('closedDay', $event.target.value)" value="목요일">목</input></label>
                <label><input type="radio" v-model="props.form.closedDay" @change="updateForm('closedDay', $event.target.value)" value="금요일">금</input></label>
                <label><input type="radio" v-model="props.form.closedDay" @change="updateForm('closedDay', $event.target.value)" value="토요일">토</input></label>
                <label><input type="radio" v-model="props.form.closedDay" @change="updateForm('closedDay', $event.target.value)" value="일요일">일</input></label> 
            </div>

            <span>최소 주문 금액</span>
            <label for="minOrderPrice">
                <input type="text" v-model="props.form.minAmount" @input="updateForm('minAmount', $event.target.value)" class="gray-content" id="minOrderPrice" placeholder="원 이상 주문가능">
            </label>

            <span>배달료</span>
            <div class="d-flex gap-3">
                <input type="text" v-model="props.form.minDeliveryFee" @change="updateForm('minDeliveryFee', $event.target.value)" class="gray-content">
                <span>~</span>
                <input type="text" v-model="props.form.maxDeliveryFee" @change="updateForm('maxDeliveryFee', $event.target.value)" class="gray-content">
            </div>

            <span>포장 주문 가능</span>
            <div class="toggle-container" style="height: 40px">
                <label class="switch">
                    <input type="checkbox" v-model="isPickUp" :true-value="1" :false-value="0" @change="updateToggle('isPickUp')" />
                    <span class="slider"></span>
                </label>
            </div>

            <span>가게 이벤트 공지</span>
            <textarea v-model="props.form.eventComment" @input="updateForm('eventComment', $event.target.value)" class="gray-content" placeholder="최대 500자 이하 재료소진, 배달지연, 이벤트 안내 등 설정해보세요!"></textarea>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.control-wrap {
    display: grid;
    grid-template-columns: 150px 2fr;
    gap: 20px 50px;

    span {
        display: flex;
        align-items: center;
    }
}
</style>