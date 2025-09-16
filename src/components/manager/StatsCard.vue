<script setup>
const props = defineProps({
    title: String,
    count: Number
});
</script>

<template>
    <b-card>
        <b-card-title tag="h6">{{ props.title }}</b-card-title>
        <b-card-text tag="h1">{{ props.count !== undefined && props.count !== null ? props.count.toLocaleString() : 0 }}</b-card-text>
    </b-card>
</template>

<style scoped>
.card {
    width: 200px;
}
</style>