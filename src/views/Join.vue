<script setup>
import router from '@/router/index';
import { reactive, ref, watch } from 'vue';
import { join } from '@/services/userService';

// 회원 타입 구분: 일반고객(customer) 또는 업주(owner)
const memberType = ref('customer');

// 비밀번호 확인용
const confirmPw = ref('');

// 일반 회원 일반전화 필드
const phoneAreaCode = ref('02');

// 일반 회원용 전화번호 필드
const phone1 = ref('010');
const phone2 = ref('');
const phone3 = ref('');

// 업주 회원용 가게 전화번호
const ownerTel1 = ref('02');
const ownerTel2 = ref('');
const ownerTel3 = ref('');

// 업주 회원용 대표자 휴대전화
const ownerPhone1 = ref('010');
const ownerPhone2 = ref('');
const ownerPhone3 = ref('');

// 전체 폼 상태
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

// 약관 동의 상태
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

// 회원 타입 변경 시 role 값 자동 반영
watch(memberType, (val) => {
  state.form.role = val;  // 'customer' or 'owner'
});

// 일반 전화번호 조합
watch([phone1, phone2, phone3], () => {
  state.form.phone = `${phone1.value}-${phone2.value}-${phone3.value}`;
});

// 업주용 가게 전화번호 조합
watch([ownerTel1, ownerTel2, ownerTel3], () => {
  state.owner.tel = `${ownerTel1.value}-${ownerTel2.value}-${ownerTel3.value}`;
});

// 업주용 대표자 휴대폰 조합
// watch([ownerPhone1, ownerPhone2, ownerPhone3], () => {
//   state.owner.businessNumber = `${ownerPhone1.value}-${ownerPhone2.value}-${ownerPhone3.value}`;
// });

// 전체 약관 동의 시 세부 항목도 일괄 변경
const toggleAllAgree = () => {
  const val = agreement.allAgree;
  agreement.terms.useTerms = val;
  agreement.terms.privacyPolicy = val;
  agreement.terms.thirdParty = val;
  agreement.marketing = val;
  agreement.sms = val;
  agreement.email = val;
};

// 회원가입 처리 함수
const submit = async () => {
  state.form.role = memberType.value;
  console.log('submit 시작, memberType:', memberType.value);
  console.log('가입 요청 데이터 확인:', JSON.stringify(state.form, null, 2));
  // 공통 필수값 확인
  if (!state.form.loginId || !state.form.loginPw || !state.form.email) {
    alert('아이디, 비밀번호, 이메일은 필수입니다.');
    return;
  }

  // 회원 유형별 필수값 확인
  if (memberType.value === 'customer') {
    if (!state.form.name) {
      alert('이름은 필수입니다.');
      return;
    }
  } else if (memberType.value === 'owner') {
    if (!state.owner.name) {
      alert('가게 상호명은 필수입니다.');
      return;
    }
    if (!state.owner.category) {
      alert('가게 카테고리는 필수입니다.');
      return;
    }
  }

  // 필수 약관 동의 여부 확인
  if (!agreement.terms.useTerms || !agreement.terms.privacyPolicy || !agreement.terms.thirdParty) {
    alert('필수 약관에 모두 동의해 주세요.');
    return;
  }

  // 비밀번호 확인값과 입력값 비교
  if (confirmPw.value !== state.form.loginPw) {
    alert('비밀번호 확인이 일치하지 않습니다.');
    return;
  }

  // 서버에 전송할 데이터 구성
  const payload = {
    ...state.form,
    owner: memberType.value === 'owner' ? state.owner : null
  };

  console.log('가입 요청 데이터 확인:', JSON.stringify(state.form, null, 2));
  console.log('전송 데이터:', payload); // 디버깅 확인용

  try {
    console.log('전송할 데이터:', payload);
    const res = await join(payload);
    console.log('회원가입 결과:', res);

    if (res.status === 200) {
      alert('회원가입 되었습니다!');

      // 서버가 user 데이터 res.data.resultData로 준다고 가정
      if (res.data.resultData) {
        localStorage.setItem('user', JSON.stringify(res.data.resultData));
      }
      if (memberType.value === 'owner') {
        router.push('/owner'); // 업주면 /owner 페이지로
      } else {
        router.push('/');
      }
    } else {
      alert('입력 정보를 다시 확인해 주세요.');
    }
  } catch (err) {
    console.error('회원가입 실패:', err);

    if (err.response?.status === 401) {
      alert('권한이 없습니다. 관리자에게 문의하세요.');
    } else {
      alert('회원가입 중 오류가 발생했습니다.');
    }
  }
};

// 이용약관 설명글
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
                <input type="text" class="id-input" v-model="state.form.loginId" placeholder="영문 소문자/숫자, 4~16자" />
                <button type="button">아이디 중복</button>
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
              <input type="password" v-model="state.form.loginPw" placeholder="영문 대/소문자+숫자+특수문자 조합 8~16자" />
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
              <input type="password" v-model="confirmPw" placeholder="비밀번호를 한 번 더 입력해주세요" />
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
          <!-- 일반번호 -->
          <div class="form-group phone-input-wrap">
            <div class="label">
              <span>*</span>
              <p>일반번호</p>
              <div class="phone-input">
                <select v-model="phoneAreaCode">
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
                <input type="text" />
                <input type="text" />
              </div>
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
                <input type="text" v-model="phone2" />
                <input type="text" v-model="phone3" />
              </div>
            </div>
          </div>
          <div class="sevLine"></div>
          <!-- 이메일 -->
          <div class="form-group">
            <div class="label">
              <span>*</span>
              <p>이메일</p>
              <div class="mail">
                <input type="email" v-model="state.form.email" placeholder="반드시 사용 중인 메일을 @ 형식으로 입력하세요." />
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
                <input type="text" v-model="ownerTel2" />
                <input type="text" v-model="ownerTel3" />
              </div>
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
                <input type="text" v-model="state.owner.businessNumber" class="upload-box" />
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
                <input type="email" v-model="state.form.email" placeholder="반드시 사용 중인 메일을 @ 형식으로 입력하세요." />
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
                  <input type="text" v-model="ownerPhone2" />
                  <input type="text" v-model="ownerPhone3" />
                </div>
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
@font-face { // 배민 주아체
  font-family: 'BMJUA';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

@font-face { // 프리텐다드 
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

.container {
  .label {
    // 필수 입력 정보 설명
    display: flex;
    align-items: flex-start;
    gap: 23px; // *와 텍스트 사이 간격
    margin-left: 40px;
    align-items: center; // 수직 정렬

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