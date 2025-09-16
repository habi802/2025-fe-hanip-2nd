<script setup>
const props = defineProps({
    title: String,
});
</script>

<template>
    <b-card class="border-0" body-class="pt-0">
        <b-row>
            <b-col cols="3"><strong>작성일</strong></b-col>
            <b-col cols="3">2025-09-01</b-col>
            <b-col cols="3"><strong>작성자</strong></b-col>
            <b-col cols="3">김갑환</b-col>
        </b-row>

        <template v-if="props.title === 'contact'">
            <b-row>
                <b-col cols="3"><strong>제목</strong></b-col>
                <b-col cols="9">악성 유저를 신고합니다.</b-col>
            </b-row>
        </template>

        <b-row>
            <b-col cols="12"><strong>이미지</strong></b-col>
        </b-row>
        <b-row>
            <b-col cols="12" class="content">이미지가 들어감</b-col>
        </b-row>

        <b-row>
            <b-col cols="12"><strong>내용</strong></b-col>
        </b-row>
        <b-row>
            <b-col cols="12" class="content">아주 사악한 유저입니다. 제발 계정 정지를 시켜주시길 바랍니다.</b-col>
        </b-row>

        <b-row>
            <b-col cols="12"><strong>답변</strong></b-col>
        </b-row>
        <b-row>
            <b-col cols="12" class="content">싫어요.</b-col>
        </b-row>
    </b-card>
</template>

<style lang="scss" scoped>
.card {
    .row {
        border-left: 1px solid #dee2e6;
        border-bottom: 1px solid #dee2e6;

        &:first-child {
            border-top: 1px solid #dee2e6;
        }

        > div {
            border-right: 1px solid #dee2e6;
            padding: 0.5rem;
        }
    }
}

.content {
    min-height: 180px;
}
</style>