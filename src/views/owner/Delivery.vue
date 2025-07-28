<script setup>
import { inject } from "vue";

const ownerName = inject("ownerName", "");
</script>

<template>
  <div class="min-vh-100 pb-5" style="background-color: #e8e8e8">
    <div>
      <div class="owner-title1">배달 관리</div>
      <div class="owner-title2">
        어서오세요! {{ ownerName }} 사장님, 관리자 페이지에 다시 오신 것을
        환영합니다!
      </div>
    </div>
    <div class="container-fluid d-flex mb-5">
      <div class="card shadow p-5 w-100 rounded-4" style="max-width: 1501px">
        <div class="ps-4">
          <img src="@/imgs/owner/owner-service.png" class="img-fluid w-100" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.owner-title1 {
  font-size: 30px;
  font-weight: bold;
  padding-left: 12px;
  padding-bottom: 2px;
}

.owner-title2 {
  padding-left: 12px;
  padding-bottom: 10px;
  color: #686868;
}
</style>
