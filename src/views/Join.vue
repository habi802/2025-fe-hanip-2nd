<script setup>
import router from '@/router/index';
import { reactive, ref } from 'vue'

const memberType = ref('general');

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
    role:'',
  }
});

const submit = async () => {
  const res = await join(state.form);
  console.log('res:', res);
  if (res.status === 200) {
    alert('회원가입을 축하합니다.');
    await router.push('/');
  } else {
    alert('아이디/비밀번호를 확인해 주세요.');
  }
};

</script>

<template>
  <div class="join">
    <h2 class="join-title">회원가입</h2>

    <form class="join-form" @submit.prevent="submit">
      <div class="titleLine"></div>

      <!-- 회원구분 -->
      <div class="form-group">
      <label>✪ 회원구분</label>
        <div class="radio-group">
          <label id="radio"><input type="radio" class="circle" name="memberType" value="general" v-model="memberType" /> 일반</label>
          <label><input type="radio" class="circle" name="memberType" value="owner" v-model="memberType" /> 업주</label>
        </div>
      </div>
      <div class="sevLine"></div>

      <!-- 회원인증 -->
       <div class="form-certified">
        <label>회원인증</label>
       </div>
       <div class="sevLine"></div>

      <!-- 기본 정보 -->
      <label class="serveTitle">기본정보</label>
      <div class="titleLine"></div>
      <div class="form-group">
        
        <label>✪ 아이디</label>
        <input type="text" placeholder="영문 소문자/숫자, 4~16자" />
      </div>
      <div class="sevLine"></div>

      <div class="form-group">
        <label>✪ 비밀번호</label>
        <input type="password" placeholder="영문 대/소문자+숫자+특수문자 조합 8~16자" />
      </div>
      <div class="sevLine"></div>

      <div class="form-group">
        <label>✪ 비밀번호 확인</label>
        <input type="password" placeholder="비밀번호를 한 번 더 입력해주세요" />
      </div>
      <div class="sevLine"></div>
      
      <!-- 일반 회원 -->
      <template v-if="memberType === 'general'">
      <div class="form-group">
        <label>✪ 이름</label>
        <input type="text" />
      </div>
      <div class="sevLine"></div>

      <!-- 주소 -->
      <div class="form-group address-group">
  <label>✪ 주소</label>
  <div class="address-row">
    <input type="text" placeholder="우편번호" />
    <button type="button">주소검색</button>
  </div>
  <div class="sev-addres-row">
    <input type="text" placeholder="기본주소" />
    <input type="text" placeholder="상세주소 (선택입력가능)" />
  </div>
</div>
      <div class="sevLine"></div>
      <!-- 일반번호 -->
      <div class="form-group phone-input-wrap">
  <label>✪ 일반번호</label>
  <div class="phone-input">
    <select>
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
      <div class="sevLine"></div>

      <!-- 휴대전화 -->
      <div class="form-group phone-input-wrap">
  <label>✪ 휴대전화</label>
  <div class="phone-input">
    <select>
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
      <div class="sevLine"></div>

      <!-- 이메일 -->
      <div class="form-group">
        <label>✪ 이메일</label>
        <input type="email" placeholder="반드시 사용 중인 메일을 @ 형식으로 입력하세요." />
      </div>
      <div class="sevLine"></div>
    </template>

    <!-- 업주 회원 -->
    <template v-if="memberType === 'owner'">
      <!-- 대표자 이름 -->
      <div class="form-group owner-form">
        <label>✪ 대표자 이름</label>
        <input type="text" />
      </div>
      <div class="sevLine"></div>

      <!-- 가게주소 -->
      <div class="owner-form form-group address-group">
  <label>✪ 가게주소</label>
  <div class="address-row">
    <input type="text" placeholder="우편번호" />
    <button type="button">주소검색</button>
  </div>
  <div class="sev-addres-row">
    <input type="text" placeholder="기본주소" />
    <input type="text" placeholder="상세주소 (선택입력가능)" />
  </div>
</div>
      <div class="sevLine"></div>

      <!-- 가게전화 -->
      <div class="owner-form form-group phone-input-wrap">
  <label>✪ 가게전화</label>
  <div class="phone-input">
    <select>
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
      <div class="sevLine"></div>

      <!-- 가게 상호명 및 카테고리 -->
      <div class="owner-form form-group phone-input-wrap">
  <label>✪ 가게 상호명 및 카테고리</label>
  <div class="phone-input">
    <input type="text"/>
    <select>
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
      <div class="sevLine"></div>

      <!-- 사업자 등록번호 -->
      <div class="owner-upload owner-form">
  <label>✪ 사업자 등록번호</label>
  <div class="upload-row">
    <input type="text" class="upload-box"/>
    <button type="button">조회</button>
  </div>
  </div>
  <div class="sevLine"></div>

  <!-- 이메일 -->
  <div class="owner-form form-group">
        <label>✪ 이메일</label>
        <input type="email" placeholder="반드시 사용 중인 메일을 @ 형식으로 입력하세요." />
      </div>
      <div class="sevLine"></div>
      <!-- 휴대전화 -->
      <div class="form-group phone-input-wrap">
  <label>✪ 휴대전화</label>
  <div class="phone-input">
    <select>
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
      <div class="sevLine"></div>

      <!-- 사업자 등록증 업로드 -->
      <div class="owner-form owner-upload">
  <label class="upload">✪ 사업자 등록증 업로드</label>
  <div class="upload-row">
    <button type="button">업로드</button>
    <li>등록증 전체가 선명하게 촬영된 이미지 또는 PDF 파일을 업로드해야 합니다.</li>
    <li>사업자등록상의 대표자명과 가입자 정보가 다를 경우, 추가 인증이 필요합니다.</li>
  </div>
  </div>
  <div class="sevLine"></div>

    </template>

      <!-- 약관동의 -->
      <label class="serveTitle">약관동의</label>
      <div class="titleLine"></div>

      <div class="agreement">
        <p class="all-agree"><label class="custom-checkbox">
          <input type="checkbox" class="circle"/> <strong><span class="highlight">[전체동의]</span></strong> 이용약관 및 개인정보수집 및 이용, 쇼핑정보 수신(선택)에 모두 동의합니다. </label>
        </p>

        <ul class="terms-list">
          <li><label class="custom-checkbox"><input type="checkbox" class="circle"/><span class="highlight"> [필수]</span> 이용약관 동의</label></li>
          <li><label class="custom-checkbox"><input type="checkbox" class="circle"/> <span class="highlight">[필수]</span> 개인정보 수집 이용 동의</label></li>
          <li><label class="custom-checkbox"><input type="checkbox" class="circle"/> <span class="highlight">[필수]</span> 개인정보 제3자 제공 동의</label></li>
        </ul>

        <div class="marketing">
          <p><label class="custom-checkbox"><input type="checkbox" class="circle" /><span class="highlight"> [선택]</span> 쇼핑정보 수신 동의</label></p>
        </div>

        <div class="sev-marketing">
          <span><label class="custom-checkbox"><input type="checkbox" class="circle"/> SMS 수신을 동의하십니까?</label></span>
          <span><label class="custom-checkbox"><input type="checkbox" class="circle"/> 이메일 수신을 동의하십니까?</label></span>
        </div>
      </div>

      <!-- 제출 버튼 -->
      <div class="form-submit">
        <button type="submit" @click="router.push('/home')">회원가입</button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
    font-family: 'BMJUA';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
* {
    font-family: 'BMJUA';
    letter-spacing: 1px;
    box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.titleLine {
  border-bottom: 3px solid #7d7d7d;
  margin-top: 0.5em;
  margin-bottom: 1rem;
}

.sevLine {
  border-bottom: 0.5px solid #c8c8c8;
}

.join-wrap {
  width: 100%;
  max-width: 1400px; 
  margin: 0 auto;
  padding: 3rem 2rem;
  background-color: #fff;
}

#radio {
  margin-left: 90px;
}

.join {
    max-width: 1400px;
    margin: 0 auto;
    padding: 3rem 1rem;
    background: #fff;
  

.join-title {
    font-size: 50px;
    text-align: center;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    font-weight: 500;
}
.serveTitle {
  font-size: 1.3rem;
  margin-top: 2rem;
  margin-bottom: -1rem;
  font-weight: 500;
}

.join-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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
    margin-bottom: 0.2rem;
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
  margin-left : 275px;
  margin-top: 10px;
  }
}

.radio-group {
    display: inline;
    gap: 1rem;

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

.address-row {
    display: inline-block;
    gap: 1rem;
    align-items: center;
    
    input {
        flex: 1;
        width: 210px;
        margin-left: 210px;
        }

    button {
        flex-shrink: 0;
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
    margin-left: 180px;

    select {
        width: 213px;
    }

    input {
        flex: 1;
    }
}
.form-group:not(.address-group):not(.phone-input-wrap):not(.agreement):not(:has(.radio-group)) {
  display: block;
  margin-top: 1rem;

  label {
    display: inline-block;
    width: 235px;      // label 고정 폭
    text-align: left;
    margin-left: 0px;
    vertical-align: middle;
  }

  input,
  select {
    display: inline-block;
    width: 620px;
    height: 50px;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #c8c8c8;
    border-radius: 8px;
    margin-left: 20px;
    vertical-align: middle;
  }
}

// 업주 회원칸
.owner-form {
  display: block;
  margin-top: 1rem;

  label {
    display: inline-block;
    width: 240px;      
    text-align: left;
    margin-left: 0px;
    vertical-align: middle;
  }

  input,
  select {
    display: inline-block;
    width: 610px;
    height: 50px;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #c8c8c8;
    border-radius: 8px;
    margin-left: 20px;
    vertical-align: middle;
  }

  .phone-input {
    display: inline-flex;
    max-width: 620px;
    gap: 0.5rem;
    align-items: center;
    margin-left: 0;

    select {
        width: 213px;
    }

    input {
        flex: 1;
    }
  }
}

.owner-upload {
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


// 약관 동의
.agreement {
    display: flex;
    flex-direction: column;
    
    .highlight {
    color: #ff6666;
    font-weight: 500;
    }
    .all-agree {
        font-weight: 500;
    }

    .terms-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

    li {
            font-size: 0.95rem;
            margin-bottom: 10px;
        }
    }

    .marketing {
      font-weight: 400;
      display: flex;
      flex-direction: column;
    }

    .sev-marketing {
      margin-left: -30px;
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

.form-submit {
    margin-top: 1rem;
  

    button {
        width: 100%;
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