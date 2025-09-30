<script setup>
import { onMounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
    title: String,
    labelY: null,
    type: String,
    chartData: Array
});

// Chart.js 3.x 이상에서는 사용할 차트 요소를 등록해야 함
// Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend);
const chartCanvas = ref(null);

let chartInstance = null;
onMounted(() => {
    chartInstance = new Chart(chartCanvas.value, {
        type: props.type,
        data: {
            labels: props.chartData?.label || "x축 제목", //x축제목,
            datasets: [{
                label: props?.labelY || "Y축 제목", //y축 값 종류(범례)
                data: props.chartData?.data || [1],
                backgroundColor: '#ffcc66'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
});
</script>

<template>
    <div class="wrap">
        <div class="title">
            <span>{{ props.title || "-" }}</span>
        </div>
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<style scoped lang="scss">
.wrap{
    padding: 20px 40px;
}
canvas {
  max-width: 600px;
  max-height: 400px;
}
.title{
    font-size: 1.5rem;
    font-weight: 700;
}


</style>