<script setup>
import { reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOwnerStore } from "@/stores/account";
import { patchIsOpen } from "@/services/storeService";

const router = useRouter();

const owner = useOwnerStore();

let alertId = 0;
const alerts = reactive([]);

// 토스트(Toast) 띄우는 함수
const showAlert = (message, type = "alert-danger") => {
    const id = ++alertId;
    const newAlert = { id, message, type };
    alerts.push(newAlert);

    // 3초 뒤 자동 삭제
    setTimeout(() => {
        removeAlert(id);
    }, 3000);
};

const removeAlert = (id) => {
    const index = alerts.findIndex((a) => a.id === id);
    if (index !== -1) alerts.splice(index, 1);
};

// 오늘 날짜 계산
const getToday = computed(() => {
    const today = new Date();
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
});

// 영업 시작
const setIsOpen = async () => {
    if (owner.state.storeData.isOpen) {
        showAlert("가게가 이미 영업 중인 상태입니다.");
        return;
    }

    const res = await patchIsOpen(owner.state.storeData.id);

    if (res !== undefined && res.status === 200) {
        owner.setIsOpen();

        router.push({ path: '/owner/dashboard' });
    }
}

onMounted(() => {
    // 가게가 영업 시작 상태일 시 대시보드로 바로 이동
    if (owner.state.storeData.isOpen) {
        router.push({ path: '/owner/dashboard' });
    }
});
</script>

<template>
    <!-- 토스트(Toast) -->
    <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 2000;">
        <div v-for="alert in alerts" :key="alert.id" 
            :class="['alert', alert.type, 'alert-dismissible', 'fade', 'show']" role="alert"
            style="margin-bottom: 10px; min-width: 300px; max-width: 600px">
            {{ alert.message }}
            <button type="button" class="btn-close" @click="removeAlert(alert.id)" style="border: none; background-color: #fff;"></button>
        </div>
    </div>

    <!-- 메인 -->
    <div class="container-fluid d-flex" style="height: 100vh; padding:40px;">
        <div class="card shadow p-5 w-100 text-center d-flex justify-content-center align-items-center flex-column" style="max-width: 1501px; max-height: 900px;">
            <!-- 영업 승인 전 화면 -->
            <template v-if="!owner.state.storeData.isActive">
                <div class="notice-wrap">
                    <div>영업 승인 전입니다</div>
                    <div>
                        가게 정보 및 메뉴 등록 후<br/>
                        관리자에게 영업 승인 요청바랍니다
                    </div>
                </div>
            </template>

            <!-- 영업 승인 후 화면 -->
            <template v-else>
                <div class="ps-4 pt-5">
                    <div class="text-date">{{ getToday }}</div>
                    <div class="pb-5 text">오늘의 영업을 시작하세요!</div>
                    <button class="storeAccept-btn" @click="setIsOpen">영업 시작</button>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.box {
    font-family: "Pretendard", sans-serif;
    padding-top: 82px;
    justify-content: center;
}

.text-date {
    font-weight: bold;
    font-size: 55px;
    color: #959595
}

.text {
    font-weight: bold;
    font-size: 60px;
}

.storeAccept-btn {
    background: #f66463;
    border: none;
    color: white;
    padding: 6px 16px;
    border-radius: 10px;
    font-size: 40px;
    width: 250px;
    height: 120px;
    transition: background-color 0.3s, color 0.3s;
}

.storeAccept-btn:hover {
    background: #d44b4a;
}
.storeAccept-btn:active {
    background: #b23837;
}

/* alert 에니메이션 */
.fade.show {
    animation: slideDown 0.5s ease;
}

@keyframes slideDown {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.notice-wrap{
    padding: 150px;
    height: 100%;
    margin: 0 auto;
    color: #797979;

    :first-child{
        font-weight: 800;
        line-height: 3;
        font-size: 4rem;
    }
    :last-child{
        font-size: 3rem;
    }
}
</style>
