<script setup>

</script>

<template>
<div class="contact-header">
    <h2 class="title">고객문의</h2>
    <ul class="tabs">
      <li :class="{ active: activeTab === 'faq' }" @click="setTab('faq')">FAQ</li>
      <li :class="{ active: activeTab === 'qna' }" @click="setTab('qna')">Q&A</li>
      <li :class="{ active: activeTab === 'one' }" @click="setTab('one')">1:1 문의</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.contact-header {
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 5rem;

  .title {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 50px;
  }

  .tabs {
    display: flex;
    justify-content: center;
    gap: 50px;
    list-style: none;
    padding: 0;

    li {
      font-size: 20px;
      cursor: pointer;
      color: #666;

      &.active {
        font-weight: bold;
        color: #ff6666;
      }
    }
  }
}
</style> 