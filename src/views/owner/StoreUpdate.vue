<script setup>
import { getStore, modify } from "@/services/storeService";
import { reactive, onMounted, nextTick, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import defaultStoreImage from "@/imgs/default-store.jpg";

// route
const route = useRoute();
const router = useRouter();

// ref
const tel3Input = ref(null);
const mobile3Input = ref(null);
const previewImage = ref(defaultStoreImage);

// 화면에 원래 가게 정보 뿌리기
onMounted(async () => {
  await getStoreData(1);
});

// 가게 정보 가져오기
const getStoreData = async (id) => {
  const res = await getStore(id);
  const data = res.data.resultData;
  console.log("data: ", res.data.resultData);

  if (res.status !== 200 && data === null) {
    console.log("에러발생");
  } else {
    state.form.password = "";
    state.form.ownerName = data.ownerName;
    state.form.email = data.email;
    state.form.comment = data.comment;
    state.form.category = data.category;

    // 가게주소
    const addressParts = data.address.split(",");
    state.form.zipcode = addressParts[0] || "";
    state.form.baseAddress = addressParts[1] || "";
    state.form.detailAddress = addressParts[2] || "";

    // 가게번호
    const telParts = data.tel.split("-");
    state.form.storeTel1 = telParts[0] || "";
    state.form.storeTel2 = telParts[1] || "";
    state.form.storeTel3 = telParts[2] || "";

    // 전화번호
    const phoneParts = data.phone.split("-");
    state.form.mobile1 = phoneParts[0] || "";
    state.form.mobile2 = phoneParts[1] || "";
    state.form.mobile3 = phoneParts[2] || "";

    // 사진
    previewImage.value = defaultStoreImage;
  }
};

// 양방향
const state = reactive({
  form: {
    password: "",
    ownerName: "",
    comment: "",
    zipcode: "",
    baseAddress: "",
    detailAddress: "",
    storeTel1: "02",
    storeTel2: "",
    storeTel3: "",
    mobile1: "010",
    mobile2: "",
    mobile3: "",
    imagePath: null,
    category: "",
    email: "",
  },
});

// 수정하기 버튼
const submit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const address = `${state.form.zipcode},${state.form.baseAddress},${state.form.detailAddress}`;
  const tel = `${state.form.storeTel1}-${state.form.storeTel2}-${state.form.storeTel3}`;
  const phone = `${state.form.mobile1}-${state.form.mobile2}-${state.form.mobile3}`;

  // 백엔드에 보낼 데이터
  const payload = {
    data: {
      storeId: 1,
      password: state.form.password,
      comment: state.form.comment,
      address: address,
      tel: tel,
      ownerName: state.form.ownerName,
      category: state.form.category,
      email: state.form.email,
      phone: phone,
    },
    img: state.form.imagePath,
  };

  formData.append("img", payload.img);
  formData.append(
    "data",
    new Blob([JSON.stringify(payload.data)], { type: "application/json" })
  );

  const res = await modify(formData);
  if (res.status === 401) {
    alert("비밀번호가 일치하지 않습니다.");
    state.form.password = "";
    return;
  }
  if (res.status !== 200) {
    alert("에러 발생");
    return;
  }

  alert("수정 성공");
};

// 사진 미리보기
const handleFileSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    state.form.imagePath = file;
  }
};

// 핸들러 (숫자만 입력)
const handleNumberInput = (e, target) => {
  const onlyNumber = e.target.value.replace(/\D/g, "");
  e.target.value = onlyNumber; // 입력창에도 강제 적용
  state.form[target] = onlyNumber;
};

const handleMobile2Input = (e) => {
  handleNumberInput(e, "mobile2");
  if (state.form.mobile2.length === 4) {
    nextTick(() => {
      mobile3Input.value?.focus();
    });
  }
};

const handleMobile3Input = (e) => {
  handleNumberInput(e, "mobile3");
};

const handleTel2Input = (e) => {
  handleNumberInput(e, "storeTel2");
  if (state.form.storeTel2.length === 3) {
    nextTick(() => {
      tel3Input.value?.focus();
    });
  }
};

const handleTel3Input = (e) => {
  handleNumberInput(e, "storeTel3");
};

// 주소 검색
const searchAddress = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      console.log("선택된 주소: ", data);

      // 예: 도로명 주소 기준으로 세팅
      state.form.zipcode = data.zonecode;
      state.form.baseAddress = data.roadAddress;

      // 포커스 이동
      nextTick(() => {
        const detailInput = document.querySelector(
          "input[placeholder='상세 주소 (선택 입력 가능)']"
        );
        detailInput?.focus();
      });
    },
  }).open();
};
</script>

<template>
  <div class="bg-light min-vh-100 py-5">
    <div class="container d-flex justify-content-center">
      <div class="card shadow p-5 w-100" style="max-width: 1100px">
        <div class="ps-4">
          <div class="text-danger mb-4">
            <p class="mb-1">● 가게 정보 수정시 내용을 꼭 확인해주세요.</p>
            <p>● 수정 시 비밀번호 인증이 필요합니다.</p>
          </div>

          <!-- 비밀번호 확인 -->
          <form>
            <div class="d-flex align-items-center mb-4">
              <label class="me-4 mb-0" style="width: 170px"
                >비밀번호 확인</label
              >
              <input
                type="password"
                class="form-control"
                placeholder="현재 비밀번호를 입력해주세요"
                v-model="state.form.password"
                style="width: 500px"
              />
            </div>

            <!-- 대표자 이름 -->
            <div class="d-flex align-items-center mb-4">
              <label class="me-4 mb-0" style="width: 170px">대표자 이름</label>
              <input
                type="text"
                class="form-control"
                v-model="state.form.ownerName"
                style="width: 500px"
              />
            </div>

            <!-- 이메일 -->
            <div class="d-flex align-items-center mb-4">
              <label class="me-4 mb-0" style="width: 170px">이메일</label>
              <input
                type="text"
                class="form-control"
                v-model="state.form.email"
                style="width: 500px"
              />
            </div>

            <!-- 코멘트 -->
            <div class="d-flex align-items-center mb-4">
              <label class="me-4 mb-0" style="width: 170px">설명란</label>
              <input
                type="text"
                class="form-control"
                v-model="state.form.comment"
                style="width: 500px"
              />
            </div>

            <!-- 가게 주소 -->
            <div class="d-flex align-items-center mb-4">
              <label class="form-label me-4 mb-0" style="width: 170px"
                >가게 주소</label
              >
              <div class="me-4 mb-0" style="width: 500px">
                <div class="input-group mb-2 gap-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="우편번호"
                    v-model="state.form.zipcode"
                    @input="
                      (e) => (e.target.value = e.target.value.replace(/,/g, ''))
                    "
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="searchAddress"
                  >
                    주소검색
                  </button>
                </div>

                <input
                  type="text"
                  class="form-control mb-2"
                  placeholder="기본주소"
                  v-model="state.form.baseAddress"
                  @input="
                    (e) => (e.target.value = e.target.value.replace(/,/g, ''))
                  "
                />
                <input
                  type="text"
                  class="form-control"
                  placeholder="상세 주소 (선택 입력 가능)"
                  v-model="state.form.detailAddress"
                  @input="
                    (e) => (e.target.value = e.target.value.replace(/,/g, ''))
                  "
                />
              </div>
            </div>

            <!-- 가게 전화 -->
            <div class="d-flex align-items-center mb-4">
              <label class="me-4 mb-0" style="width: 170px">가게 전화</label>
              <div class="row g-2">
                <div class="col-4">
                  <select class="form-select" v-model="state.form.storeTel1">
                    <option value="02">02</option>
                    <option value="031">031</option>
                  </select>
                </div>
                <div class="col-4">
                  <input
                    type="tel"
                    class="form-control"
                    inputmode="numeric"
                    maxlength="3"
                    :value="state.form.storeTel2"
                    @input="handleTel2Input"
                  />
                </div>
                <div class="col-4">
                  <input
                    type="tel"
                    class="form-control"
                    inputmode="numeric"
                    maxlength="4"
                    :value="state.form.storeTel3"
                    @input="handleTel3Input"
                    ref="tel3Input"
                  />
                </div>
              </div>
            </div>

            <!-- 휴대전화 -->
            <div class="d-flex align-items-center mb-4">
              <label class="me-4 mb-0" style="width: 170px">휴대전화</label>
              <div class="row g-2">
                <div class="col-4">
                  <select class="form-select" v-model="state.form.mobile1">
                    <option value="010">010</option>
                    <option value="011">011</option>
                  </select>
                </div>
                <div class="col-4">
                  <input
                    type="tel"
                    class="form-control"
                    inputmode="numeric"
                    maxlength="4"
                    :value="state.form.mobile2"
                    @input="handleMobile2Input"
                  />
                </div>
                <div class="col-4">
                  <input
                    type="tel"
                    class="form-control"
                    inputmode="numeric"
                    maxlength="4"
                    :value="state.form.mobile3"
                    @input="handleMobile3Input"
                    ref="mobile3Input"
                  />
                </div>
              </div>
            </div>

            <!-- 가게 사진 업로드 -->
            <div class="d-flex align-items-center mb-4">
              <label class="me-4 mb-0" style="width: 170px">가게 사진</label>
              <div>
                <img
                  v-if="previewImage"
                  :src="previewImage"
                  alt="가게 사진 미리보기"
                  style="
                    width: 150px;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 0.5rem;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                  "
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleFileSelected"
                  />
                </div>
              </div>
            </div>

            <!-- 수정 버튼 -->
            <div class="d-flex justify-content-end mt-4">
              <button
                type="submit"
                @click="submit"
                class="btn btn-secondary px-4"
              >
                수정 완료
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::placeholder {
  font-size: 0.9rem;
}
</style>
