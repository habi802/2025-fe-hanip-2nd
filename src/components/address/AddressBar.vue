<script setup></script>

<template>
  <div class="address-bar">
    <div class="container">
      <input
        type="text"
        placeholder="검색바 : 지번, 도로명, 건물명으로 검색"
        class="search-input"
      />
      <button class="location-btn">현재 위치</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  // 프리텐다드
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
    format("woff");
  font-weight: 400;
  font-style: normal;
}
* {
    font-family: "Pretendard-Regular";
}
.address-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;

  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 0.95rem;
  }

  .location-btn {
    background-color: #f75a5a;
    color: #fff;
    border: none;
    padding: 0 1.25rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      background-color: #e14b4b;
    }
  }
}
</style>
