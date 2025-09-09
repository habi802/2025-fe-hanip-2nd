<script setup>
import { defineExpose, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const show = ref(false);
const body = ref('');

// defineExpose: 부모 컴포넌트에서 (ref로 된 변수 이름).value.(defineExpose에서 실행될 함수 이름) 형태로 호출했을 때 실행됨
defineExpose({
    open(message) {
        body.value = message;
        show.value = true;
    }
});

// 모달 창을 닫는 함수
const hide = () => {
    show.value = false;

    // 메세지에 '로그인' 이 포함되어 있으면 로그인 화면으로 이동
    if (body.value.includes('로그인')) {
        router.push("/login");
    }
};
</script>

<template>
    <b-modal v-model="show" title="알림" centered>
        {{ body }}

        <!-- footer 커스텀 -->
        <template #footer>
            <button class="btn btn-custom" @click="hide">확인</button>
        </template>
    </b-modal>
</template>

<style scoped>
.btn-custom {
    background-color: #FF6666;
    color: #fff;
}
</style>