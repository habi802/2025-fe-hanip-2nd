<script setup>
import { onMounted, ref, watch } from 'vue';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Legend } from 'chart.js';

// Chart.js 3.x 이상에서는 사용할 차트 요소를 등록해야 함
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend);

const chartCanvas = ref(null);

const props = defineProps({
    title: String,
    chartData: Array
});

let chartInstance = null;

onMounted(() => {
    chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
            labels: props.chartData.label,
            datasets: [{
                label: props.title,
                data: props.chartData.data,
                backgroundColor: '#E65558'
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

watch(() => [props.chartData, props.title],
    ([newData, newTitle]) => {
        if (chartInstance) {
            chartInstance.data.labels = newData.label;
            chartInstance.data.datasets[0].data = newData.data;
            chartInstance.data.datasets[0].label = newTitle;
            chartInstance.update();
        }
    },
    { deep: true }
);
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