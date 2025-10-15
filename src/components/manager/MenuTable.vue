<script setup>
import defaultImage from "@/imgs/owner/owner-service2.png";

const props = defineProps({
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
        <tbody v-for="(menuType, idx) in props.menus" :key="idx">
            <tr>
                <th colspan="7">{{ menuType.menuType }}</th>
            </tr>
            <tr>
                <th style="width: 15%;">이미지</th>
                <th style="width: 20%;">메뉴명</th>
                <th style="width: 15%;">가격</th>
                <th>설명</th>
                <th style="width: 10%;">상태</th>
                <th style="width: 10%;">품절</th>
            </tr>
            <template v-for="menu in menuType.menus" :key="menu.menuId">
                <tr>
                    <td>
                        <img :src="showImage(menu.storeId, menu.menuId, menu.imagePath)" :alt="`${menu.name}의 이미지`" @error="e => e.target.src = defaultImage" class="menu-image" />
                    </td>
                    <td>{{ menu.name }}</td>
                    <td>{{ menu.price?.toLocaleString() + '원' }}</td>
                    <td>{{ menu.comment !== undefined && menu.comment !== null && menu.comment !== '' ? menu.comment : '-' }}</td>
                    <td>{{ menu.isHide === 1 ? '공개' : '숨김' }}</td>
                    <td>{{ menu.isSoldOut === 1 ? '판매중' : '품절' }}</td>
                </tr>
                <!-- <tr v-if="1">
                    <th colspan="7">옵션</th>
                </tr> -->
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