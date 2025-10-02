<script setup>
import { onMounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
    title: String,
    labelY: null,
    type: String,
    chartData: Object
});

console.log(props.chartData)

watch(() => props.chartData, (newData) => {
    if(chartInstance){
        chartInstance.data.labels = newData.label;
        chartInstance.data.datasets[0].data = newData.data;
        chartInstance.update();
    }
}, { deep: true });


const chartCanvas = ref(null);

let chartInstance = null;
const currentChartData = () =>{

    chartInstance = new Chart(chartCanvas.value, {
        type: props.type,
        data: {
        labels: props.chartData?.label || ["x축 제목"], //x축제목,
        datasets: [{
            label: props?.labelY || "Y축 제목", //y축 값 종류(범례)
            data: props.chartData?.data || [0],
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
}
onMounted(() => {
    currentChartData();
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