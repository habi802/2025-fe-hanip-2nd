<script setup></script>

<template>
  <div class="GuideBox">
    <div class="f_text">이용가이드</div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: 'BMJUA';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff')
    format('woff');
  font-weight: normal;
  font-style: normal;
}
.GuideBox {
  width: auto;
  height: 1000px;
  background-color: #f9f9f9;

  .f_text {
    font-family: 'BMJUA';
    letter-spacing: 3px;
    font-size: 2em;
    font-weight: 700;
    text-align: center;
    padding-top: 80px;
  }
}
</style>
