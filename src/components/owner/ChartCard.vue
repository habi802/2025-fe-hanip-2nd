<script setup>
import { onMounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
    title: String,
    labelY: null,
    type: String,
    chartData: Object,
    unit: {       //단위 추가 ("건", "원", "만 원" 등)
    type: String,
    default: "",
    }
});

console.log(props.chartData)

watch(() => props.chartData, (newData) => {
    if (!newData || !chartInstance ) return;
    const maxValue = Math.max(...(newData.data || [0])) * 1.1;
    if(chartInstance){
        chartInstance.options.scales.y.suggestedMax = maxValue; // y축 최대값 옵션 갱신
        chartInstance.data.labels = newData.label;
        chartInstance.data.datasets[0].data = newData.data;
        chartInstance.update();
    }
}, { deep: true });


const chartCanvas = ref(null);
let chartInstance = null;
const currentChartData = () =>{

    if (chartInstance) {
    chartInstance.destroy(); // 중복차트 방지
    }

    chartInstance = new Chart(chartCanvas.value, {
        type: props.type,
        data: {
        labels: props.chartData?.label || ["x축 제목"], //x축제목,
        datasets: [{
            label: props?.labelY || "Y축 제목", //y축 값 종류(범례)
            data: props.chartData?.data || [0],
            backgroundColor: '#ffcc66',
            tension: 0.4, // 👈 이게 "부드러운 곡선"의 핵심!
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                                        // stepSize: 1 로 고정하면 항상 정수 눈금만
                    stepSize: 1,
                    // 소수점 표시 제거
                    precision: 0,
                    // Y축 단위 표시 : "건", "원", "만 원" 등의 단위
                    callback: function (value) {
                    
                    if (props.unit === "만원") {
                        return Math.round(value / 10000) + " 만 원";
                    }
                    if (props.unit === "건") {
                        return value + "건";
                    }
                    return value + (props.unit ? props.unit : "");
                    },
                },
                grace: 0, //0~1 비율로 y축 여유공간
                suggestedMin: 0, // 최소값
                suggestedMax: Math.max(...props.chartData?.data || [0]) * 1.1, // y축 최대값
            },

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
    <div class="wrap white-card">
        <!-- <div class="title"> <span>{{ props.title || "-" }}</span> </div> -->
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<style scoped lang="scss">
.wrap{
    width: 100% !important;
    height: 100%;
    padding: 20px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px;
}
.title{
    width: 90%;
    text-align: left;
}
canvas {
  max-width: 1500px;
  max-height: 800px;
}
.title{
    font-size: 1.5rem;
    font-weight: 700;
}


</style>