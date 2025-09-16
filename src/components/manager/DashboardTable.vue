<script setup>
const props = defineProps({
    table: Object
});

const getStatus = status => {
    if (props.table.name === '가게 관리') {
        return status ? '활성화' : '비활성화';
    } else {
        return status ? '등록' : '미등록';
    }
};
</script>

<template>
    <tabla class="table">
        <thead>
            <tr>
                <th scope="col" v-for="(title, idx) in props.table.title" :key="idx">
                    {{ title }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(data, idx) in props.table.data" :key="idx">
                <td>{{ data[0] }}</td>
                <td>{{ data[1] }}</td>
                <td>{{ data[2] }}</td>
                <td>
                    <span :class="['badge', data[3] ? 'bg-success' : 'bg-danger']">
                        {{ getStatus(data[3]) }}
                    </span>
                </td>
            </tr>
        </tbody>
    </tabla>
</template>

<style scoped>

</style>