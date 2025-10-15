<script setup>
const props = defineProps({
  order: {}
});
</script>

<template>
  <div class="wrap">
    <section>
      <h3>주문 정보 {{ order?.orderId }}</h3>
      <table class="info-table">
        <tbody>
          <tr>
            <th>고객명</th>
            <td>{{ order?.userName ?? "--" }}</td>
          </tr>
          <tr>
            <th>전화</th>
            <td>{{ order?.userPhone ?? "--" }}</td>
          </tr>
          <tr>
            <th>주소</th>
            <td>
              {{ order?.postcode ? `(${order.postcode}) ` : "" }}
              {{ [order?.address, order?.addressDetail].filter(Boolean).join(" ") || "--" }}
            </td>
          </tr>
          <tr>
            <th>특이사항</th>
            <td>{{ order?.storeRequest ?? "--" }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/components/owner/orderInfo/orderInfoCommon.scss';
</style>
