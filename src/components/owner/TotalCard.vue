<script setup>
const props = defineProps({
  selectedChartOption : String,
  title: String,
  count: Number,
  toLocalString: String
})
</script>

<template>
  <div class="white-card total-box">
    <div class="total-contents">
      <div>
        <span>{{ props.selectedChartOption || "" }} {{props.title || "?"}} </span><br>
        <span class="font-xxlg">{{ props.count || "" }} {{ props.toLocalString || ""}}</span>
      </div>
      <div class="change-rate">
        <span class="icon-up">↑</span><span>4%</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.total-contents{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>