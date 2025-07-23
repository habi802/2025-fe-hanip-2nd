<template>
  <div class="flex gap-4 border-b mb-4">
    <button
      v-for="tab in tabs"
      :key="tab"
      @click="$emit('update:activeTab', tab)"
      :class="[
        'px-4 py-2 font-semibold',
        activeTab === tab ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500'
      ]"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  tabs: Array,
  activeTab: String
});
defineEmits(['update:activeTab']);
</script>
