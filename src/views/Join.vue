<script setup>

</script>

<template>
  <div class="join">
    <h2 class="join-title">회원가입</h2>

    <form class="join-form" @submit.prevent="submit">

      <!-- 회원구분 -->
      <div class="form-group row">
        <label>회원구분</label>
        <div class="radio-group">
          <label><input type="radio" name="memberType" checked /> 일반</label>
          <label><input type="radio" name="memberType" /> 업주</label>
        </div>
      </div>

      <!-- 회원인증 -->
       <div class="form-certified">
        <label>회원인증</label>
       </div>

      <!-- 아이디, 비밀번호 -->
      <div class="form-group">
        <label>아이디</label>
        <input type="text" placeholder="영문 소문자/숫자, 4~16자" />
      </div>

      <div class="form-group">
        <label>비밀번호</label>
        <input type="password" placeholder="영문 대/소문자+숫자+특수문자 조합 8~16자" />
      </div>

      <div class="form-group">
        <label>비밀번호 확인</label>
        <input type="password" placeholder="비밀번호를 한 번 더 입력해주세요" />
      </div>

      <div class="form-group">
        <label>이름</label>
        <input type="text" />
      </div>

      <!-- 주소 -->
      <div class="form-group address-group">
        <label>주소</label>
        <div class="address-row">
          <input type="text" placeholder="우편번호" />
          <button type="button">주소검색</button>
        </div>
        <input type="text" placeholder="기본주소" />
        <input type="text" placeholder="상세주소 (선택입력가능)" />
      </div>

      <!-- 전화번호 -->
      <div class="form-group">
        <label>전화번호</label>
        <div class="phone-input">
          <select>
            <option>010</option>
            <option>011</option>
          </select>
          <input type="text" />
          <input type="text" />
        </div>
      </div>

      <!-- 휴대전화 -->
      <div class="form-group">
        <label>휴대전화</label>
        <div class="phone-input">
          <select>
            <option>010</option>
            <option>011</option>
          </select>
          <input type="text" />
          <input type="text" />
        </div>
      </div>

      <!-- 이메일 -->
      <div class="form-group">
        <label>이메일</label>
        <input type="email" placeholder="본인 소유의 이메일을 입력해주세요" />
      </div>

      <!-- 약관동의 -->
      <div class="form-group agreement">
        <label>약관동의</label>
        <p class="all-agree">
          <input type="checkbox" /> <strong><span class="highlight">[전체동의]</span></strong> 이용약관 및 개인정보 수집에 모두 동의합니다.
        </p>

        <ul class="terms-list">
          <li><input type="checkbox" /><span class="highlight"> [필수]</span> 이용약관 동의</li>
          <li><input type="checkbox" /> <span class="highlight">[필수]</span> 개인정보 수집 이용 동의</li>
          <li><input type="checkbox" /> <span class="highlight">[필수]</span> 광고성 정보 수신 동의</li>
          <li><input type="checkbox" /> <span class="highlight">[필수]</span> 위치정보 수집 동의</li>
        </ul>

        <div class="marketing">
          <p><span class="highlight">[선택]</span> 광고 수신 동의 수단</p>
          <label><input type="radio" name="marketing" /> 문자 수신 동의</label>
          <label><input type="radio" name="marketing" /> 푸시 수신 동의</label>
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
}
.join {
    max-width: 600px;
    margin: 0 auto;
    padding: 3rem 1rem;
    background: #fff;

.join-title {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 2rem;
    font-weight: bold;
}

.join-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

label {
    font-size: 20px;
    font-weight: 600;
}

  // 공통 입력 폼 스타일
.form-group,
.form-certified {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
        font-weight: 600;
        margin-bottom: 0.2rem;
    }

    input,
    select,
    button {
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
}

.radio-group {
    display: flex;
    gap: 1rem;

    label {
        font-weight: 400;
    }
}

.address-row {
    display: flex;
    gap: 1rem;
    align-items: center;

    input {
        flex: 1;
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
    display: flex;
    gap: 0.5rem;
    align-items: center;

    select {
        width: 80px;
    }

    input {
        flex: 1;
    }
}

.agreement {
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    .highlight {
    color: tomato;
    font-weight: bold;
    }
    .all-agree {
        font-weight: bold;
        margin-bottom: 0.5rem;
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
        }
    }

    .marketing {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;

        p {
        margin: 0;
        font-weight: 600;
        }

        label {
        font-weight: 400;
        }
    }
}

.form-submit {
    margin-top: 1rem;

    button {
        width: 100%;
        background-color: #ff6666;
        color: white;
        font-weight: bold;
        border: none;
        padding: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background-color: #e25555;
                }
            }
        }
    }

</style>