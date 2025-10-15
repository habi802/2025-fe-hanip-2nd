<script setup>
const props = defineProps({
    table: Array
});
</script>

<template>
    <tabla class="table">
        <thead>
            <tr>
                <th style="width: 12%;">상호명</th>
                <th style="width: 5%;">대표자명</th>
                <th style="width: 10%;">사업자 등록번호</th>
                <th style="width: 30%;">주소</th>
                <th style="width: 8%;">개업연월일</th>
                <th style="width: 10%;">전화번호</th>
                <th style="width: 7%;">영업 승인</th>
                <th style="width: 18%;">가게 등록일</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in props.table" :key="item.storeId">
                <td>{{ item.name }}</td>
                <td>{{ item.ownerName }}</td>
                <td>{{ item.businessNumber }}</td>
                <td>{{ item.address }}</td>
                <td>{{ item.openDate }}</td>
                <td>{{ item.tel }}</td>
                <td>
                    <span v-if="item.isActive === 0" class="badge bg-danger fs-6">대기</span>
                    <span v-else-if="item.isActive === 1" class="badge bg-success fs-6">완료</span>
                </td>
                <td>{{ item.createdAt }}</td>
            </tr>
        </tbody>
    </tabla>
</template>

<style scoped>
</style>