<script setup>
import '@/assets/manager/manager.css'

import { reactive, ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';

const state = reactive({
    form: {
        startDate: '',
        endDate: '',
        name: '',
        title: '',
        comment: '',
        managerComment: 0,
    }
});
</script>

<template>
    <b-container>
        <h5 class="mb-3">추천 관리</h5>
        <b-row class="align-items-center">
            <b-col cols="12">
                
            </b-col>
        </b-row>
    </b-container>
</template>

<style scoped>

</style>