<script setup>
import { onMounted, ref } from 'vue';
import { Chart, BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Legend } from 'chart.js';

// Chart.js 3.x 이상에서는 사용할 차트 요소를 등록해야 함
Chart.register(BarController, BarElement, CategoryScale, LineController, LineElement, PointElement, LinearScale, Legend);

const chartCanvas = ref(null);

const props = defineProps({
    title: String,
    chartData: Object
});

let chartInstance = null;

onMounted(() => {
    chartInstance = new Chart(chartCanvas.value, {
        type: props.title === '가입자 수' || props.title === '가게 등록 수' ? 'bar' : 'line',
        data: {
            labels: props.chartData.label,
            datasets: [{
                label: props.title,
                data: props.chartData.data,
                backgroundColor: props.title === '가입자 수' || props.title === '주문 건 수' ? '#E65558' : '#6799FF'
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
    <canvas ref="chartCanvas"></canvas>
</template>

<style scoped>
canvas { 
    max-width: 100%;
    max-height: 100%;
}
</style>