<script setup>
const props = defineProps({
    item: {
        id: Number,
        name: String,
        comment: String,
        price: Number,
        imagePath: String
    }
});
</script>

<template>
    <div class="menu border rounded p-3 mb-2">
        <div class="row">
            <div class="col-8 col-md-10">
                <h5>{{ props.item.name }}</h5>
                <p>{{ props.item.comment }}</p>
                <span>{{ props.item.price.toLocaleString() }}원</span>
            </div>
            <div class="col-4 col-md-2 border rounded">
                이것은 메뉴의 이미지다
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.menu {
    cursor: pointer;

    &:hover {
        border-color: #fcaeae !important;
    }
}
</style>
