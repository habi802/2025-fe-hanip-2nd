<script setup>
const props = defineProps({
  selectedChartOption : String,
  title: String,
  count: Number,
  toLocalString: String
})


// <div class="change-rate">
//   <span class="icon-up">↑</span><span>4%</span>
// </div>
</script>

<template>
  <div class="white-card total-box">
        <span>{{ props.selectedChartOption || "" }} {{props.title || "?"}} </span><br>
        <span class="font-xxlg">{{ props.count || "" }} {{ props.toLocalString || ""}}</span>
  </div>
</template>

<style scoped lang="scss">
.total-box{
  width: 280px;
  height: 90px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>