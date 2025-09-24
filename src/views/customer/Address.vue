<script setup>
import { ref, onMounted, reactive } from "vue";
import { getAddresses, addAddress, putAddress, patchMainAddress, deleteAddress } from "@/services/addressService";
import AddressBar from "@/components/customer/address/AddressBar.vue";
import AddressCard from "@/components/customer/address/AddressCard.vue";
import EditAddress from "@/components/customer/address/EditAddress.vue";
import AlertModal from "@/components/modal/AlertModal.vue";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";

const defaultForm = {
    id: 0,
    title: '',
    postcode: '',
    address: '',
    addressDetail: '',
}

const state = reactive({
    form: { ...defaultForm },
    mode: 'add',
    addresses: []
});

// 주소 추가 및 수정
const saveAddress = async data => {
    let res;

    if (data.mode === 'add') {
        // 새로운 주소 추가
        state.form.title = data.title;
        state.form.postcode = data.postcode;
        state.form.address = data.address;
        state.form.addressDetail = data.addressDetail;

        res = await addAddress(state.form);
        if (res !== undefined && res.status === 200) {
            state.addresses.push({
                id: res.data.resultData.id,
                title: state.form.title,
                postcode: state.form.postcode,
                address: state.form.address,
                addressDetail: state.form.addressDetail
            });

            addressModal.value = false;
        }
    } else {
        // 기존 주소 수정
        state.form.id = data.id;
        state.form.title = data.title;
        state.form.postcode = data.postcode;
        state.form.address = data.address;
        state.form.addressDetail = data.addressDetail;

        res = await putAddress(state.form);
        if (res !== undefined && res.status === 200) {
            const putData = state.addresses.find(address => address.id === state.form.id);
            if (putData) {
                putData.title = state.form.title;
                putData.postcode = state.form.postcode;
                putData.address = state.form.address;
                putData.addressDetail = state.form.addressDetail;
            }

            addressModal.value = false;
        }
    }
};

// 기본 주소 변경
const setMainAddress = async id => {
    const res = await patchMainAddress(id);

    if (res !== undefined && res.status === 200) {
        // 기본 주소 변경에 성공하였으면 프론트에서도 기본 주소 값을 변경한 뒤 주소 리스트 재정렬
        state.addresses.forEach(address => {
            if (address.id === id) {
                address.isMain = 1;
            } else {
                address.isMain = 0;
            }
        });

        state.addresses.sort((a, b) => {
            if (a.isMain !== b.isMain) {
                return b.isMain - a.isMain;
            }

            return a.id - b.id;
        });
    }
};

const addressModal = ref(false);

// 주소 추가 및 수정 창 열기
const openEditModal = data => {
    console.log(data);
    Object.assign(state.form, defaultForm);
    
    if (data.id) {
        state.form = { ...data };
        state.mode = 'edit';
    } else {
        state.form.address = data;
        state.mode = 'add';
    }
    addressModal.value = true;
};

// 주소 추가 및 수정 창 닫기
const closeModal = () => {
    addressModal.value = false;
}

const alertModalRef = ref(null);
const confirmModalRef = ref(null);

// 주소 삭제
const removeAddress = async id => {
    if (state.addresses.find(address => address.id === id).isMain === 1) {
        alertModalRef.value.open('기본 주소는 삭제할 수 없습니다.');
        return;
    }

    const isConfirmed = await confirmModalRef.value.showModal('주소를 삭제하시겠습니까?');
    if (isConfirmed) {
        const res = await deleteAddress(id);

        if (res !== undefined && res.status === 200) {
            const deleteIdx = state.addresses.findIndex(address => address.id === id);
            if (deleteIdx >= 0) {
                state.addresses.splice(deleteIdx, 1);
            }
        }
    }
};

// 한 페이지 당 보여줄 개수
const SHOW_COUNT = ref(4);

// 더보기 버튼
const loadMore = () => (SHOW_COUNT.value += 4);

onMounted(async () => {
    const res = await getAddresses();

    if (res !== undefined && res.status === 200) {
        state.addresses = res.data.resultData;
    }
});
</script>

<template>
    <div class="address">
        <div class="container">
            <h2 class="add-title">주소 설정</h2>
            <div class="titleLine"></div>

            <!-- 주소 검색 바 -->
            <AddressBar @create-address="openEditModal" />

            <!-- 주소 카드 리스트 -->
            <div class="address-list">
                <AddressCard v-for="address in state.addresses" :key="address.id" :address="address"
                    @set-main-address="setMainAddress" @edit-address="openEditModal" @remove-address="removeAddress"
                />
            </div>

            <!-- 더보기 버튼 -->
            <div class="plus" v-if="SHOW_COUNT < state.addresses.length">
                <button class="plus-btn" @click="loadMore">더보기</button>
            </div>
        </div>
    </div>

    <!-- 수정 모달 -->
    <EditAddress :isShow="addressModal" :form="state.form" :mode="state.mode" @save-address="saveAddress" @close-modal="closeModal" />

    <AlertModal ref="alertModalRef" />
    <ConfirmModal ref="confirmModalRef" />
</template>

<style lang="scss" scoped>
@font-face {
    font-family: "BMJUA";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
        format("woff");
    font-weight: normal;
    font-style: normal;
}

.add-title {
    font-family: "BMJUA";
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    margin-top: 5rem;
    margin-bottom: 40px;
}

// 메인 구분 선
.titleLine {
    width: 100%;
    border-bottom: 3px solid #000;
    margin: 0 auto 3rem;
}

// 카드 리스트 배치
.address-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    justify-items: center;
    margin-bottom: 5rem;
}
// 더보기 버튼
.plus {
    display: flex;
    justify-content: center;

    .plus-btn {
        font-family: "BMJUA";
        width: 150px;
        height: 60px;
        background-color: #ff6666;
        color: white;
        border: none;
        border-radius: 18px;
        margin-bottom: 5rem;
        cursor: pointer;
        font-size: 20px;

        &:hover {
            background-color: darken(#ff6666, 5%);
        }
    }
}
</style>
