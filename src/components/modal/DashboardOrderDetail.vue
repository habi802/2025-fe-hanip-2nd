<script>
</script>
<template>
    <div class="gray-box" @click.self="$emit('close')"></div>
    <div class="modal-wrap white-card">
        모달 만드는 중
    </div>
    <!-- @click="$emit('row-click', { id: n, time: '17:12' }) -->
</template>
<style scoped lang="scss">
.gray-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
}
.modal-wrap {
  position: fixed; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  padding: 20px;
}
</style>