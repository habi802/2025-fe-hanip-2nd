<script setup>
import { onMounted, ref, watch } from 'vue';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Legend } from 'chart.js';

// Chart.js 3.x 이상에서는 사용할 차트 요소를 등록해야 함
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend);

const chartCanvas = ref(null);

const props = defineProps({
    chartData: Array
});

let chartInstance = null;

onMounted(() => {
    chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
            labels: ['임시x축제목'],
            datasets: [{
                label: '임시 y축 제목',
                data: [111],
                backgroundColor: '#ff8686'
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
  max-width: 600px;
  max-height: 400px;
}


</style>