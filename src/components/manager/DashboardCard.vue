<script setup>
import DashboardTable from './DashboardTable.vue';

const props = defineProps({
    title: String,
    board: String,
    table: Object
});
</script>

<template>
    <b-card>
        <template #header>
            <div class="d-flex justify-content-between align-items-center">
                <span>{{ props.title }}</span>
                <a :href="`/${props.board}`" class="btn btn-sm btn-primary">더보기</a>
            </div>
        </template>

        <DashboardTable :table="props.table" />
    </b-card>
</template>

<style scoped>

</style>