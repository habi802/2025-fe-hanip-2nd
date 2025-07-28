<script setup>
import router from '@/router/index';
import { reactive, ref, watch } from 'vue';
import { join, check } from '@/services/userService';

// 유효성 검사 에러 메세지
const errors = reactive({
  loginId: '',
  loginPw: '',
  confirmPw: '',
  email: '',
  name: '',
  address: '',
  phone2: '',
  phone3: '',
  businessNumber: '',
  ownerTel2: '',
  ownerTel3: '',
  ownerPhone2: '',
  ownerPhone3: '',
});

// 유효성 검사 함수들
const validateLoginId = () => {
  const regex = /^[a-z0-9]{4,16}$/;
  errors.loginId = regex.test(state.form.loginId)
    ? ''
    : '아이디는 영문 소문자+숫자 4~16자여야 합니다.';
};

const validatePassword = () => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  errors.loginPw = regex.test(state.form.loginPw)
    ? ''
    : '비밀번호는 영문, 숫자, 특수문자 포함 8~16자여야 합니다.';
};

const validateConfirmPw = () => {
  errors.confirmPw = confirmPw.value === state.form.loginPw
    ? ''
    : '비밀번호가 일치하지 않습니다.';
};

const validateEmail = () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.email = regex.test(state.form.email)
    ? ''
    : '유효한 이메일 주소를 입력하세요.';
};

const validatePhone = () => {
  const middleRegex = /^\d{3,4}$/;
  const lastRegex = /^\d{4}$/;
  errors.phone2 = middleRegex.test(phone2.value) ? '' : '중간 번호는 3~4자리 숫자';
  errors.phone3 = lastRegex.test(phone3.value) ? '' : '끝 번호는 4자리 숫자';
};

const validateOwnerTel = () => {
  const middleRegex = /^\d{3,4}$/;
  const lastRegex = /^\d{4}$/;
  errors.ownerTel2 = middleRegex.test(ownerTel2.value) ? '' : '중간 번호는 3~4자리 숫자';
  errors.ownerTel3 = lastRegex.test(ownerTel3.value) ? '' : '끝 번호는 4자리 숫자';
};

const validateOwnerPhone = () => {
  const middleRegex = /^\d{3,4}$/;
  const lastRegex = /^\d{4}$/;
  errors.ownerPhone2 = middleRegex.test(ownerPhone2.value) ? '' : '중간 번호는 3~4자리 숫자';
  errors.ownerPhone3 = lastRegex.test(ownerPhone3.value) ? '' : '끝 번호는 4자리 숫자';
};

const validateBusinessNumber = () => {
  const regex = /^\d{10}$/;
  errors.businessNumber = regex.test(state.owner.businessNumber)
    ? ''
    : '사업자등록번호는 숫자 10자리여야 합니다.';
};

// 제출 전 모든 필드 유효성 검사
const validateForm = () => {
  validateLoginId();
  validatePassword();
  validateConfirmPw();
  validateEmail();

  if (memberType.value === 'customer') {
    validatePhone();
  } else {
    validateOwnerTel();
    validateOwnerPhone();
    validateBusinessNumber();
  }

  return Object.values(errors).every((msg) => msg === '');
};

// 아이디 중복 검사 유효성 코드
const checkResult = ref('');

// 아이디 중복 확인 함수
const checkDuplicateId = async () => {
  validateLoginId();
  if (errors.loginId !== '') return;

  try {
    const response = await check(state.form.loginId);
    const { available } = response.data;

    if (available) {
      checkResult.value = '사용 가능한 아이디입니다.';
      errors.loginId = '';
    } else {
      checkResult.value = '';
      errors.loginId = '이미 사용 중인 아이디입니다.';
    }
  } catch (err) {
    checkResult.value = '';
    errors.loginId = '서버 오류로 확인에 실패했습니다.';
    console.error(err);
  }
};

// 회원 타입
const memberType = ref('customer');

// 입력 필드
const confirmPw = ref('');
const phone1 = ref('010');
const phone2 = ref('');
const phone3 = ref('');

const ownerTel1 = ref('02');
const ownerTel2 = ref('');
const ownerTel3 = ref('');

const ownerPhone1 = ref('010');
const ownerPhone2 = ref('');
const ownerPhone3 = ref('');

// 상태
const state = reactive({
  form: {
    name: '',
    loginId: '',
    loginPw: '',
    postcode: '',
    address: '',
    addressDetail: '',
    phone: '',
    email: '',
    role: '',
  },
  owner: {
    name: '',
    category: '',
    tel: '',
    businessNumber: '',
    licenesPath: '',
    imagePath: '',
  }
});

const agreement = reactive({
  allAgree: false,
  terms: {
    useTerms: false,
    privacyPolicy: false,
    thirdParty: false,
  },
  marketing: false,
  sms: false,
  email: false,
});

watch(memberType, (val) => {
  state.form.role = val;
});

watch([phone1, phone2, phone3], () => {
  state.form.phone = `${phone1.value}-${phone2.value}-${phone3.value}`;
});

watch([ownerTel1, ownerTel2, ownerTel3], () => {
  state.owner.tel = `${ownerTel1.value}-${ownerTel2.value}-${ownerTel3.value}`;
});

watch([ownerPhone1, ownerPhone2, ownerPhone3], () => {
  state.owner.phone = `${ownerPhone1.value}-${ownerPhone2.value}-${ownerPhone3.value}`;
});

const toggleAllAgree = () => {
  const val = agreement.allAgree;
  agreement.terms.useTerms = val;
  agreement.terms.privacyPolicy = val;
  agreement.terms.thirdParty = val;
  agreement.marketing = val;
  agreement.sms = val;
  agreement.email = val;
};

const submit = async () => {
  state.form.role = memberType.value;

  if (!validateForm()) {
    alert('입력값을 다시 확인해주세요.');
    return;
  }

  if (!state.form.loginId || !state.form.loginPw || !state.form.email) {
    alert('아이디, 비밀번호, 이메일은 필수입니다.');
    return;
  }

  if (memberType.value === 'customer') {
    if (!state.form.name) {
      alert('이름은 필수입니다.');
      return;
    }
  } else {
    if (!state.owner.name || !state.owner.category) {
      alert('가게명 및 카테고리는 필수입니다.');
      return;
    }
  }

  if (!agreement.terms.useTerms || !agreement.terms.privacyPolicy || !agreement.terms.thirdParty) {
    alert('필수 약관에 동의해주세요.');
    return;
  }

  if (confirmPw.value !== state.form.loginPw) {
    alert('비밀번호 확인이 일치하지 않습니다.');
    return;
  }

  const payload = {
    ...state.form,
    owner: memberType.value === 'owner' ? state.owner : null
  };

  try {
    const res = await join(payload);
    if (res.status === 200) {
      alert('회원가입 완료!');
      localStorage.setItem('user', JSON.stringify(res.data.resultData));
      router.push('/');
    } else {
      alert('입력 정보를 다시 확인해 주세요.');
    }
  } catch (err) {
    console.error(err);
    alert('회원가입 중 오류 발생');
  }
};

// 약관 설명 텍스트
const termsText = {
  useTerms: `제1조(목적) 이 약관은...`,
  privacyPolicy: `개인정보 수집 항목은 다음과 같으며...`,
  thirdParty: `당사는 다음과 같은 제3자에게 정보를 제공할 수 있습니다...`,
};
</script>

<template>
  <div class="join">
    <div class="container">
      <h2 class="join-title">회원가입</h2>

      <form class="join-form" @submit.prevent="submit">
        <div class="titleLine"></div>

        <!-- 회원구분 -->
        <div class="form-group">
          <div class="label">
            <span>*</span>
            <p>회원 구분</p>
            <div class="radio-group">
              <label id="radio"><input type="radio" class="circle" name="memberType" value="customer"
                  v-model="memberType" /> 일반</label>
              <label><input type="radio" class="circle" name="memberType" value="owner" v-model="memberType" />
                업주</label>
            </div>
          </div>
        </div>
        <div class="sevLine"></div>

        <!-- 회원인증 -->
        <div class="form-certified">
          <div class="certified">
            <label>회원인증</label>
          </div>
        </div>
        <div class="sevLine"></div>

        <!-- 기본 정보 -->
        <label class="serveTitle">기본정보</label>
        <div class="titleLine"></div>
        <div class="form-group">
          <!-- 아이디 -->
          <div class="id-from address-row">
            <div class="label">
              <span>*</span>
              <p>아이디</p>
              <div class="id">
                <input v-model="state.form.loginId" :class="{ invalid: errors.loginId }" @blur="validateLoginId"
                  placeholder="영문 소문자/숫자, 4~16자" />
                <button type="button" @click="checkDuplicateId">아이디 중복</button>
                <p v-if="errors.loginId" class="error-msg">{{ errors.loginId }}</p>
                <p v-if="checkResult" class="success-msg">{{ checkResult }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="sevLine"></div>
        <!-- 비밀번호 -->
        <div class="form-group">
          <div class="label">
            <span>*</span>
            <p>비밀번호</p>
            <div class="password">
              <input v-model="state.form.loginPw" :class="{ invalid: errors.loginPw }" @blur="validatePassword" />
              <p v-if="errors.loginPw" class="error-msg">{{ errors.loginPw }}</p>
            </div>
          </div>
        </div>
        <div class="sevLine"></div>
        <!-- 비밀번호 확인 -->
        <div class="form-group">
          <div class="label">
            <span>*</span>
            <p>비밀번호 확인</p>
            <div class="password2">
              <input v-model="confirmPw" @blur="validateConfirmPw" :class="{ invalid: errors.confirmPw }" />
              <p v-if="errors.confirmPw" class="error-msg">{{ errors.confirmPw }}</p>
            </div>
          </div>
        </div>
        <div class="sevLine"></div>
        <!-- 일반 회원 전용 form -->
        <template v-if="memberType === 'customer'">
          <div class="form-group">
            <div class="label">
              <span>*</span>
              <p>이름</p>
              <input type="text" v-model="state.form.name" />
            </div>
          </div>
          <div class="sevLine"></div>
          <!-- 주소 -->
          <div class="form-group address-group">
            <div class="label">
              <span>*</span>
              <p>주소</p>
              <div class="address-row">
                <input type="text" v-model="state.form.postcode" placeholder="우편번호" />
                <button type="button">주소검색</button>
              </div>
            </div>
            <div class="sev-addres-row">
              <input type="text" v-model="state.form.address" placeholder="기본주소" />
              <input type="text" v-model="state.form.addressDetail" placeholder="상세주소 (선택입력가능)" />
            </div>
          </div>
          <div class="sevLine"></div>
          <!-- 휴대전화 -->
          <div class="form-group phone-input-wrap">
            <div class="label">
              <span>*</span>
              <p>전화번호</p>
              <div class="phone-input">
                <select v-model="phone1">
                  <option>010</option>
                  <option>016</option>
                  <option>017</option>
                  <option>018</option>
                  <option>019</option>
                </select>
                <input type="text" v-model="phone2" @blur="validatePhone" :class="{ invalid: errors.phone2 }" />
                <input type="text" v-model="phone3" @blur="validatePhone" :class="{ invalid: errors.phone3 }" />
              </div>
            </div>
            <div class="telNum">
              <p v-if="errors.phone2 || errors.phone3" class="error-msg">
                {{ errors.phone2 || errors.phone3 }}
              </p>
            </div>
          </div>
          <div class="sevLine"></div>
          <!-- 이메일 -->
          <div class="form-group">
            <div class="label">
              <span>*</span>
              <p>이메일</p>
              <div class="mail">
                <input v-model="state.form.email" @blur="validateEmail" :class="{ invalid: errors.email }" />
                <p v-if="errors.email" class="error-msg">{{ errors.email }}</p>
              </div>
            </div>
          </div>
          <div class="sevLine"></div>
        </template>
        <!-- 업주 회원 -->
        <template v-if="memberType === 'owner'">
          <!-- 대표자 이름 -->
          <div class="form-group owner-form">
            <div class="label">
              <span>*</span>
              <p>대표자 이름</p>
              <div class="owner-name">
                <input type="text" v-model="state.form.name" />
              </div>
            </div>
          </div>
          <div class="sevLine"></div>
          <!-- 가게주소 -->
          <div class="owner-form form-group address-group">
            <div class="label">
              <span>*</span>
              <p>가게주소</p>
              <div class="address-row">
                <input type="text" v-model="state.form.postcode" placeholder="우편번호" />
                <button type="button">주소검색</button>
              </div>
            </div>
            <div class="sev-addres-row">
              <input type="text" v-model="state.form.address" placeholder="기본주소" />
              <input type="text" v-model="state.form.addressDetail" placeholder="상세주소 (선택입력가능)" />
            </div>
          </div>
          <div class="sevLine"></div>
          <!-- 가게전화 -->
          <div class="form-group phone-input-wrap">
            <div class="label">
              <span>*</span>
              <p>가게전화</p>
              <div class="phone-input">
                <select v-model="ownerTel1">
                  <option>02</option>
                  <option>031</option>
                  <option>032</option>
                  <option>033</option>
                  <option>041</option>
                  <option>042</option>
                  <option>043</option>
                  <option>051</option>
                  <option>052</option>
                  <option>053</option>
                  <option>054</option>
                  <option>055</option>
                  <option>061</option>
                  <option>063</option>
                  <option>064</option>
                  <option>0502</option>
                  <option>0503</option>
                  <option>0504</option>
                  <option>0505</option>
                  <option>0506</option>
                  <option>0507</option>
                  <option>0508</option>
                  <option>070</option>
                  <option>010</option>
                  <option>016</option>
                  <option>017</option>
                  <option>018</option>
                  <option>019</option>
                </select>
                <input type="text" v-model="ownerTel2" @blur="validateOwnerTel"
                  :class="{ invalid: errors.ownerTel2 }" />
                <input type="text" v-model="ownerTel3" @blur="validateOwnerTel"
                  :class="{ invalid: errors.ownerTel3 }" />
              </div>
              <p v-if="errors.ownerTel2 || errors.ownerTel3" class="error-msg">
                {{ errors.ownerTel2 || errors.ownerTel3 }}
              </p>
            </div>
          </div>
          <div class="sevLine"></div>
          <!-- 가게 상호명 및 카테고리 -->
          <div class="owner-form form-group phone-input-wrap">
            <div class="label">
              <span>*</span>
              <p>가게 상호명 및 카테고리</p>
              <div class="category-name">
                <div class="phone-input">
                  <input type="text" v-model="state.owner.name" />
                  <select v-model="state.owner.category">
                    <option>카테고리</option>
                    <option>한식</option>
                    <option>일식</option>
                    <option>중식</option>
                    <option>양식</option>
                    <option>아시안</option>
                    <option>분식</option>
                    <option>카페</option>
                    <option>패스트푸드</option>
                    <option>치킨</option>
                    <option>피자</option>
                    <option>야식</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="sevLine"></div>
          <!-- 사업자 등록번호 -->
          <div class="owner-upload owner-form">
            <div class="label">
              <span>*</span>
              <p>사업자 등록번호</p>
              <div class="upload-row owner-sigin">
                <input type="text" v-model="state.owner.businessNumber" @blur="validateBusinessNumber"
                  :class="{ invalid: errors.businessNumber }" />
                <p v-if="errors.businessNumber" class="error-msg">{{ errors.businessNumber }}</p>
                <button type="button">조회</button>
              </div>
            </div>
          </div>
          <div class="sevLine"></div>
          <!-- 이메일 -->
          <div class="owner-form form-group">
            <div class="label">
              <span>*</span>
              <p>이메일</p>
              <div class="email">
                <input type="email" v-model="state.form.email" @blur="validateEmail" :class="{ invalid: errors.email }"
                  placeholder="example@example.com" />
                <p v-if="errors.email" class="error-msg">{{ errors.email }}</p>
              </div>
            </div>
          </div>
          <div class="sevLine"></div>
          <!-- 휴대전화 -->
          <div class="form-group phone-input-wrap">
            <div class="label">
              <span>*</span>
              <p>전화번호</p>
              <div class="owner-num">
                <div class="phone-input">
                  <select v-model="ownerPhone1">
                    <option>010</option>
                    <option>016</option>
                    <option>017</option>
                    <option>018</option>
                    <option>019</option>
                  </select>
                  <input type="text" v-model="ownerPhone2" @blur="validateOwnerPhone"
                    :class="{ invalid: errors.ownerPhone2 }" />
                  <input type="text" v-model="ownerPhone3" @blur="validateOwnerPhone"
                    :class="{ invalid: errors.ownerPhone3 }" />
                </div>
                <p v-if="errors.ownerPhone2 || errors.ownerPhone3" class="error-msg"><span class="telNum">
                    {{ errors.ownerPhone2 || errors.ownerPhone3 }}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="sevLine"></div>
          <!-- 사업자 등록증 업로드 -->
          <div class="owner-form owner-upload">
            <div class="label">
              <span>*</span>
              <p>사업자 등록증 업로드</p>
              <div class="upload-row upload-box">
                <button type="button">업로드</button>
                <li>등록증 전체가 선명하게 촬영된 이미지 또는 PDF 파일을 업로드해야 합니다.</li>
                <li>사업자등록상의 대표자명과 가입자 정보가 다를 경우, 추가 인증이 필요합니다.</li>
              </div>
            </div>
          </div>
          <div class="sevLine"></div>
        </template>

        <!-- 약관동의 -->
        <label class="serveTitle">약관동의</label>
        <div class="titleLine"></div>
        <div class="agreement">
          <!-- 전체 동의 -->
          <p class="all-agree">
            <label class="custom-checkbox">
              <input type="checkbox" class="circle" v-model="agreement.allAgree" @change="toggleAllAgree" />
              <strong><span class="highlight">전체동의</span></strong>
            </label>
          </p>
          <ul class="terms-list">
            <!-- 필수 이용약관 동의 -->
            <li><label class="custom-checkbox"><input type="checkbox" class="circle"
                  v-model="agreement.terms.useTerms" /><span class="highlight"> [필수]</span> 이용약관 동의</label></li>
            <div class="terms-box">{{ termsText.useTerms }}</div>
            <!-- 필수 개인정보 수집 이용 동의 -->
            <li><label class="custom-checkbox"><input type="checkbox" class="circle"
                  v-model="agreement.terms.privacyPolicy" />
                <span class="highlight"> [필수]</span> 개인정보 수집 이용 동의</label></li>
            <div class="terms-box">{{ termsText.useTerms }}</div>
            <!-- 필수 개인정보 제3자 제공 동의 -->
            <li><label class="custom-checkbox"><input type="checkbox" class="circle"
                  v-model="agreement.terms.thirdParty" />
                <span class="highlight"> [필수]</span> 개인정보 제3자 제공 동의</label></li>
            <div class="terms-box">{{ termsText.useTerms }}</div>
          </ul>
          <!-- 선택 쇼핑정보 수신 동의 -->
          <div class="marketing">
            <p><label class="custom-checkbox"><input type="checkbox" class="circle"
                  v-model="agreement.marketing" /><span class="highlight"> [선택]</span> 쇼핑정보 수신 동의</label></p>
          </div>
          <div class="sev-marketing">
            <span><label class="custom-checkbox"><input type="checkbox" class="circle" v-model="agreement.sms" /> SMS
                수신을
                동의하십니까?</label></span>
            <span><label class="custom-checkbox"><input type="checkbox" class="circle" v-model="agreement.email" /> 이메일
                수신을
                동의하십니까?</label></span>
          </div>
        </div>

        <!-- 제출 버튼 -->
        <div class="form-submit">
          <button type="submit">회원가입</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  // 배민 주아체
  font-family: 'BMJUA';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  // 프리텐다드 
  font-family: 'Pretendard-Regular';
  src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}

* {
  font-family: 'Pretendard-Regular';
  letter-spacing: 1px;
  box-sizing: border-box;
}

// body 기본 설정
body {
  margin: 0;
  padding: 0;
}

// 메인 선
.titleLine {
  width: 1130px;
  border-bottom: 3px solid #7d7d7d;
  margin-top: 0.5em;
}

// 구분 선
.sevLine {
  width: 1130px;
  border-bottom: 0.5px solid #c8c8c8;
}

// 섹션 제목 라벨 스타일
label.serveTitle {
  font-size: 20px !important;
  font-weight: 600 !important;
  margin-left: 10px;
}

.certified {
  // 회원인증
  margin-left: 67px;
}

// 유효성 검사
input[type='text'],
input[type='password'],
input[type='email'],
select {
  width: 100%;
  max-width: 400px;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  transition: border 0.2s ease;
}

input:focus,
select:focus {
  border-color: #ff6666;
  outline: none;
}

input.invalid,
select.invalid {
  box-shadow: 0 0 3px #ff6666(233, 0, 0, 0.3) !important;
  //border-color: #ff6666;
  background-color: #ffe5e5;
}

// 전화번호 에러메세지 정렬
.telNum {
  display: flex;
  margin: 10px 0 -13px 300px;
  color: #ff6666;
  font-size: 15px;
  font-weight: 600;
}

.container {
  .label {
    // 필수 입력 정보 설명
    display: flex;
    align-items: flex-start;
    gap: 23px; // *와 텍스트 사이 간격
    margin-left: 40px;
    align-items: center; // 수직 정렬

    // 에러 메세지
    p.error-msg {
      margin-top: 10px;
      margin-left: 170px;
      color: #ff6666;
      font-size: 15px;
      font-weight: 600;
    }

    .label {
      display: flex;
      align-items: flex-start;

      span.telNum {
        display: flex;
      }
    }

    span {
      color: #ff6666; // 별표 강조용
      font-size: 1rem;
    }

    p {
      margin: 0;
      font-size: 1rem;
      color: #000;
    }
  }

  .id-input {
    width: 494px !important; // 기존보다 줄임
  }

  .label-input {
    display: flex;
    align-items: center; // input/select 기준 정렬
    flex: 1; // 나머지 영역을 채움

    input,
    select {
      width: 620px;
      height: 50px;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #c8c8c8;
      border-radius: 8px;
    }
  }
}

.join-wrap {
  // 칸 넓이
  width: 100%;
  max-width: 1130px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background-color: #fff;
}

.join {
  max-width: 1130px;
  margin: 0 auto;
  padding: 3rem 1rem;
  background: #fff;

  .join-title {
    // 메인 타이틀(회원가입) 스타일
    font-family: 'BMJUA';
    font-size: 50px;
    text-align: center; // 텍스트 가운데 정렬
    margin-top: 3rem;
    margin-bottom: 60px;
  }

  .serveTitle {
    // 기본 정보, 약관 동의
    font-size: 1.3rem;
    margin-top: 2rem;
    margin-bottom: -1rem;
    font-weight: 500;
  }

  .join-form {
    // 칸 label,input 위아래 정렬
    width: 1130px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: -10px;
  }

  label {
    font-size: 17px;
  }

  .form-group,
  .form-certified {
    display: inline-block;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 300;
      margin-right: 1rem;
    }

    // radio, checkbox 제외한 input
    input:not([type="radio"]):not([type="checkbox"]),
    select {
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #c8c8c8;
      border-radius: 8px;
      height: 50px;
      box-sizing: border-box;
    }

    button {
      width: 115px;
      border-radius: 8px;

    }

    .address-row input {
      width: 494px;
      height: 50px;
      margin-right: 10px;
    }

    .sev-addres-row input {
      display: flex;
      width: 620px;
      margin-left: 292px;
      margin-top: 16px;
    }
  }

  .radio-group {
    display: inline;

    label {
      font-weight: 400;
    }

    input[type="radio"].circle {
      appearance: none;
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid #7d7d7d;
      position: relative;
      cursor: pointer;
      vertical-align: middle;
      margin-right: 8px;
      background-color: white;
    }

    input[type="radio"].circle:checked {
      background-color: #fff;
      border-color: #ff6666;
    }

    input[type="radio"].circle:checked::after {
      content: "";
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      background-color: #ff6666;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  }

  // 주소창 정렬
  .address-row {
    display: inline-block;
    gap: 1rem;
    align-items: center;

    input {
      flex: 1;
      width: 210px;
      margin-left: 168px;
    }

    button {
      flex-shrink: 0;
      font-size: 15px;
      height: 50px;
      padding: 0.5rem 1rem;
      background-color: #eee;
      border: 1px solid #ccc;
      cursor: pointer;

      &:hover {
        background-color: #ddd;
      }
    }
  }

  .phone-input {
    display: inline-flex;
    max-width: 620px;
    gap: 0.5rem;
    align-items: center;
    margin-left: 140px;

    select {
      width: 213px;
    }

    input {
      flex: 1;
    }
  }

  // 디테일 여백 조절
  .form-group {
    .id {
      margin-left: -15px;
    }

    .password {
      margin-left: -30px;
    }

    .password2 {
      margin-left: -65px;
    }

    .mail {
      margin-left: -10px;
    }
  }

  .form-group:not(.address-group):not(.phone-input-wrap):not(.agreement):not(:has(.radio-group)) {
    display: block;

    input,
    select {
      display: inline-block;
      width: 621px;
      height: 50px;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #c8c8c8;
      border-radius: 8px;
      margin-left: 165px;
      vertical-align: middle;
    }
  }

  // 업주 회원칸
  .owner-form {
    display: block;

    label {
      display: inline-block;
      width: 240px;
      text-align: left;
      margin-left: 0px;
      vertical-align: middle;
    }

    input {
      display: inline-block;
      width: 610px;
      height: 50px;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #c8c8c8;
      border-radius: 8px;
      margin-left: 138px;
      vertical-align: middle;
    }
  }

  .owner-upload {
    // 업로드
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-top: 1rem;

    button {
      height: 50px;
    }

    label.upload {
      width: 235px; // 일반 label과 동일
      text-align: left;
      margin-left: 0;
      margin-top: 15px;
    }

    input.upload-box {
      display: inline-block;
      width: 260px;
    }

    .upload-row {
      display: inline;
      flex-direction: column;
      gap: 0.3rem;

      button {
        background-color: #eee;
        border: 1px solid #ccc;
        cursor: pointer;
        width: 115px;
        height: 50px;
        border-radius: 8px;
        margin-left: 25px;
        margin-bottom: 15px;
      }

      li {
        font-weight: 100;
        font-size: 14px;
        list-style: disc;
        margin-left: 30px;
      }
    }
  }

  // owner-form 여백 디테일
  .owner-name {
    margin-left: -50px;
  }

  .category-name {
    margin-left: -240px;
  }

  .owner-sigin {
    margin-left: -45px;
  }

  .email {
    margin-left: -5px;
  }

  .owner-num {
    margin-left: 5px;
  }

  .upload-box {
    margin-left: 35px;
  }


  // 약관 동의
  .agreement {
    display: flex;
    flex-direction: column;
    margin-left: 100px;

    .highlight {
      color: #ff6666;
      font-weight: 500;
    }

    .all-agree {
      font-size: 25px;
      font-weight: 500;
    }

    .terms-list {
      list-style: none;
      padding: 0;
      margin-left: 40px;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      li {
        font-size: 0.95rem;
        margin-bottom: 10px;
      }

      // 약관 내용 박스 스타일
      .terms-box {
        width: 850px; // 너가 원하는 너비로 조절
        height: 85px; // 고정 높이로 스크롤 가능하게
        border: 1px solid #ccc;
        padding: 10px;
        margin-top: 8px;
        border-radius: 8px;
        background-color: #fff;
        overflow-y: scroll; // 세로 스크롤
        font-size: 14px;
        white-space: pre-line; // \n 줄바꿈 처리
      }
    }

    .marketing {
      // 쇼핑정보 수신 동의
      font-weight: 400;
      display: flex;
      flex-direction: column;
      margin-left: 40px;
    }

    .sev-marketing {
      margin-left: 40px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      span {
        display: flex;
        align-items: center;
        font-size: 0.95rem;
      }

      input[type="checkbox"] {
        margin-right: 8px;
      }

      label {
        font-weight: 400;
        margin-left: 50px;
      }
    }
  }

  // 회원가입 완료 버튼
  .form-submit {
    margin-top: 1rem;
    text-align: center;

    button {
      width: 620px;
      background-color: #fff;
      color: #ff6666;
      font-weight: 600;
      border: 1px solid #ff6666;
      padding: 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-bottom: 10rem;

      &:hover {
        background-color: #ffe5e5;
      }
    }
  }

  // 약관동의 체크박스 
  input[type="checkbox"].circle {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #7d7d7d;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
    margin-right: 8px;

    &:checked {
      background-color: #ff6666;
      border-color: #ff6666;
    }

    &:checked::after {
      content: "V";
      color: white;
      font-size: 12px;
      position: absolute;
      left: 3px;
      top: 0.5px;
    }
  }
}
</style>