<script setup>

defineProps({
  order: Object
})
const emit = defineEmits(['selectOrder']);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]})`;
};


</script>

<template>
    <div class="orders-list-wrap pb-4">
                <div class="orders-list shadow" @click="emit('selectOrder', order)">
                    <div>
                        <span>주문번호</span>
                        <span class="order-num">01-00-0-{{ order.id }}</span>
                    </div>
                    <div>
                        <span>{{ order.userName }} 님</span>
                        <span class="order-address">{{ order.address }}</span>
                    </div>
                    <div>
                        <span>{{ formatDate(order.updated) }}</span>
                        <span class="order-time">{{ new Date(order.updated).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }) }}</span>
                    </div>
                    <div>
                        <span>총합계</span>
                        <span class="order-account">{{ order.amount.toLocaleString() }} 원</span>
                </div>
            </div>
        </div>
</template>

<style scoped>
.orders-list-wrap{
            width: 85vh;
            .orders-list{    
                background-color: #fff;
                border-radius: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 82vh;
                height: 130px;
                div{
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    min-width: 0;
                    height: 100%;
                    span:first-child{
                        display: block;
                        font-size: 20px;
                    }
                    .order-num{font-size: 20px; color: #838383;}
                    .order-address{
                        display: inline-block;
                        max-width: 200px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-size: 18px;
                    }
                    .order-time{font-size: 30px;}
                    .order-account{ color: #ff8989; font-size: 30px; font-weight: 700;}
                }
            }
        }
        .orders-list:hover{
            background-color: #ff8989;
            span { color: #fff !important; }
        }
</style>