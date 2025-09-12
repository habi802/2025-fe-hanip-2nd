<script setup>

</script>

<template>
  <div class="white-card">
    <div class="section-title">
      <div>가게 상태 관리</div>
      <div>가게 정보 수정 시 비밀번호 인증이 필요합니다.</div>
    </div>

    <div class="password-wrap">
      <form action="#">
        <label for="submit">
          <div>비밀번호 확인</div>
          <input id="submit" class="gray-content" type="password" placeholder="현재 비밀번호를 입력하세요">
        </label>
        <button class="hn-btn-white" type="submit">제출</button>
      </form>
    </div>
  </div>

</template>

<style scoped lang="scss">
.white-card{
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 90%;
  align-items: center;
}
.section-title{
  margin-top: 50px;
  height: 35vh;
  justify-content: center;
  align-items: center;
  text-align: center;
  div:nth-child(1) {
    font-size: var(--card-font-size-xlg);
    margin-bottom: 20px;
  }
  div:nth-child(2) {
    color: var(--primary);
  }
}

.password-wrap{
  width: 90%;
  form{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  label{
    display: flex;
    gap: 10px;
    div{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    input{
      width: 500px;
    }
  }
}
</style>
