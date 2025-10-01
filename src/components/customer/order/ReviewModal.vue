<script setup>
import { reactive, ref } from "vue";
import { saveReview, getReviewOne, putReview } from "@/services/reviewServices";

defineProps({
    orderId: Number
});

const state = reactive({
    form: {
        orderId: 0,
        rating: 0,
        comment: '',
        pics: []
    }
});

const openReview = async id => {
    console.log(id);
};

defineExpose({
    openReview
});

const previewUrl = ref(""); //이미지 경로 저장용

const onImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
        previewUrl.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    state.review.img = file;
};

// 리뷰 별점
const selected = ref(0);
const stars = [1, 2, 3, 4, 5];

const selectStar = (index) => {
    selected.value = index + 1;
};

// 리뷰 등록
const addReview = async () => {
    const id = route.params.id;
    const revId = await getReviewOne(id);

    if (previewUrl.value === "" || previewUrl.value === null) {
        const modal = new bootstrap.Modal(document.getElementById("testModal"));
        modal.show();
        return;
    }

    if (state.review.comment === "" || state.review.comment === null) {
        const modal = new bootstrap.Modal(document.getElementById("commentModal"));
        modal.show();
        return;
    } else {
        state.review.rating = selected.value;

        const formData = new FormData();
        formData.append("img", state.review.img);
        formData.append(
            "req",
            new Blob([JSON.stringify(state.review)], { type: "application/json" })
        );
        const res = await saveReview(formData);
        router.push("/orders");
    }

    if (revId.data.resultData.id > 0) {
        if (previewUrl.value === "" || previewUrl.value === null) {
            const modal = new bootstrap.Modal(document.getElementById("testModal"));
            modal.show();
            return;
        }
        if (state.review.comment === "" || state.review.comment === null) {
            const modal = new bootstrap.Modal(document.getElementById("commentModal"));
            modal.show();
            return;
        } else {
            console.log("star", selected.value);
            state.review.rating = selected.value;
            console.log(state.review);

            const formData = new FormData();
            formData.append("img", state.review.img);
            formData.append(
                "req",
                new Blob([JSON.stringify(state.review)], { type: "application/json" })
            );

            const res = await putReview(formData);
            router.push("/review/ok");
        }
    }
};

const baseUrl = import.meta.env.VITE_BASE_URL;
</script>

<template>
    
</template>

<style lang="scss" scoped>

</style>
