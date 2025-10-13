<script setup>
import { computed } from 'vue';

const props = defineProps({
    title: String,
    count: Number
});

const formatCount = computed(() => {
    if (props.count !== undefined && props.count !== null) {
        if (props.title === '금일 매출액') {
            const units = [
                { value: 1000000000000, label: '조' },
                { value: 100000000, label: '억' },
                { value: 10000, label: '만' },
                { value: 1, label: '원' }
            ];

            let result = ''
            let remain = props.count;

            for (const unit of units) {
                const unitValue = Math.floor(remain / unit.value);
                if (unitValue > 0) {
                    result += `${unitValue.toLocaleString()}${unit.label} `;
                    remain %= unit.value;
                }
            }

            if (!result.endsWith('원 ')) {
                result = result.trimEnd();
            }

            return result.trim();
        } else {
            return props.count.toLocaleString();
        }
    } else {
        return 0;
    }
});
</script>

<template>
    <b-card>
        <b-card-title tag="h6">{{ props.title }}</b-card-title>
        <b-card-text tag="h3" class="text-nowrap overflow-hidden" style="text-overflow: ellipsis; font-size: 1.5rem; max-width: 100%;">{{ formatCount }}</b-card-text>
    </b-card>
</template>

<style scoped>
.card {
    width: 200px;
}
</style>