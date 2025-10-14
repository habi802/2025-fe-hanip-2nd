<script setup>
import defaultImage from "@/imgs/owner/owner-service2.png";

const props = defineProps({
    storeId: Number,
    menus: Array
});

const baseUrl = import.meta.env.VITE_BASE_URL;

// 이미지 표시
const showImage = (storeId, menuId, image) => {
    return image !== undefined && image !== null && image !== ''
        ? `${baseUrl}/images/store/${storeId}/menu/${menuId}/${image}`
        : defaultImage;
};
</script>

<template>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>이미지</th>
                <th>메뉴명</th>
                <th>개수</th>
                <th>가격</th>
            </tr>
        </thead>
        <tbody v-for="menu in props.menus" :key="menu.menuId">
            <tr>
                <td>
                    <img :src="showImage(props.storeId, menu.menuId, menu.imagePath)" :alt="`${menu.name}의 이미지`" @error="e => e.target.src = defaultImage" class="menu-image" />
                </td>
                <td>{{ menu.name }}</td>
                <td>{{ menu.quantity }}</td>
                <td>{{ menu.price?.toLocaleString() + "원" }}</td>
            </tr>
            <template v-if="menu.options !== undefined && menu.options !== null && menu.options.length > 0" v-for="option in menu.options" :key="option.optionId">
                <tr>
                    <td></td>
                    <td>{{ option.comment }}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr v-for="child in option.children" :key="child.optionId">
                    <td></td>
                    <td>{{ "└ " + child.comment }}</td>
                    <td></td>
                    <td>{{ child.price?.toLocaleString() + '원' }}</td>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<style lang="scss" scoped>
.menu-image {
    width: 100px;
    height: 75px;
}
</style>