<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  menu: {
    type: Object,
    required: true
  }
})

function formatPrice(price) {
  return price.toLocaleString() + '원'
}

function editMenu() {
  alert(`${props.menu.name} 수정하기!`);
}
</script>

<template>
    <div class="card mb-3 shadow-sm" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-5">
          <img class="img-fluid rounded-start" alt="" />
        </div>
        <div class="col-md-7 d-flex flex-column justify-content-between p-3">
          <div>
            <h5 class="card-title">{{  }}</h5>
            <h6 class="text-muted">{{  }}</h6>
            <p class="card-text small mt-2">{{  }}</p>
          </div>
          <button @click="editMenu" class="btn btn-danger align-self-end mt-3">수정 버튼</button>
        </div>
      </div>
    </div>
  </template>
  
