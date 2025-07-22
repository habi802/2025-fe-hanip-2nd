<script setup>
const props = defineProps({
    item: {
        name: String,
        rating: Number,
        menuName: String,
        menuCount: Number,
        comment: String,
        imagePath: String,
        ownerComment: String,
        created: String,
    }
});
</script>

<template>
    <div class="border rounded p-3 mb-2">
        <div class="mb-2">
            <span class="pe-2">{{ props.item.name }}</span>
            <span>{{ props.item.created }}</span>
        </div>
        <div class="mb-2">
            <span>★★★★★</span>
        </div>
        <div class="p-2">
            <div class="review-image border w-100"></div>
        </div>
        <div class="mb-2">
            <span>{{ props.item.menuName + (props.item.menuCount > 1 ? (' 외 ' + (props.item.menuCount - 1)) + '개' : '') }}</span>
        </div>
        <div class="mb-2">
            <span>{{ props.item.comment }}</span>
        </div>
        <div v-if="props.item.ownerComment !== null && props.item.ownerComment !== ''">
            <div class="owner-comment border rounded p-2">
                {{ props.item.ownerComment }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.owner-comment {
    background-color: #797979;
}

.review-image {
    height: 300px;
}
</style>