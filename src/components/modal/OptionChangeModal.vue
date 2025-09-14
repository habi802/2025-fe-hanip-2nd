<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  menuId: { type: String, required: true },
  visible: { type: Boolean, default: false }
});

const emits = defineEmits(["close", "updateMenu"]);

const menu = ref(null);
const loading = ref(false);
const error = ref(null);

const selectedOptions = ref({});
const quantity = ref(1);

function increaseQty() {
  quantity.value++;
}
function decreaseQty() {
  if (quantity.value > 1) quantity.value--;
}

async function fetchMenu() {
  loading.value = true;
  try {
    const resp = await fetch(`/api/menus/${props.menuId}`);
    if (!resp.ok) throw new Error("메뉴 불러오기 실패");
    const data = await resp.json();
    menu.value = data;

    menu.value.optionGroups.forEach(group => {
      if (group.items && group.items.length > 0) {
        selectedOptions.value[group.id] = group.items[0].id;
      }
    });
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
}

function handleUpdate() {
  const selection = {
    menuId: menu.value.id,
    selectedOptionItems: { ...selectedOptions.value },
    quantity: quantity.value
  };
  emits("updateMenu", selection);
}

onMounted(() => {
  if (props.visible && props.menuId) {
    fetchMenu();
  }
});

watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.menuId) {
      fetchMenu();
    }
  }
);
</script>

<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-container">
      <div v-if="loading" class="loading">로딩 중...</div>
      <div v-else-if="error" class="error">에러 발생: {{ error.message }}</div>

      <div v-else>
        <div class="modal-body">
          <h2 class="modal-title">{{ menu.name }}</h2>
          <p class="modal-desc">{{ menu.description }}</p>

          <div v-for="group in menu.optionGroups" :key="group.id" class="option-group">
            <h3 class="option-title">
              {{ group.name }}
              <span v-if="group.required" class="required">필수선택</span>
            </h3>
            <div class="option-list">
              <label v-for="item in group.items" :key="item.id" class="option-item">
                <input
                  type="radio"
                  :name="group.id"
                  :value="item.id"
                  v-model="selectedOptions[group.id]"
                  class="radio-btn"
                />
                <span class="label">{{ item.label }}</span>
                <span class="price">{{ item.price }}원</span>
              </label>
            </div>
          </div>

          <div class="quantity-row">
            <span class="label">수량</span>
            <div class="qty-box">
              <button @click="decreaseQty" :disabled="quantity === 1" class="qty-btn">-</button>
              <span class="qty-num">{{ quantity }}</span>
              <button @click="increaseQty" class="qty-btn">+</button>
            </div>
          </div>

          <div class="btn-row">
            <button @click="$emit('close')" class="btn-cancel">변경취소</button>
            <button @click="handleUpdate" class="btn-update">변경</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-container {
  background: #fff;
  width: 380px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
}

.modal-desc {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-top: 4px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-title {
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;

  .required {
    color: #ef4444;
    font-size: 0.75rem;
  }
}

.option-list {
  display: grid;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }

  .radio-btn {
    width: 16px;
    height: 16px;
    accent-color: #ef4444;
  }

  .label {
    flex: 1;
    font-size: 0.875rem;
  }

  .price {
    font-size: 0.75rem;
    color: #6b7280;
  }
}

.quantity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .label {
    font-weight: 600;
  }
}

.qty-box {
  display: flex;
  align-items: center;
  gap: 14px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  background: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.qty-num {
  width: 20px;
  text-align: center;
}

.btn-row {
  display: flex;
  gap: 10px;
  padding-top: 8px;
}

.btn-cancel,
.btn-update {
  flex: 1;
  padding: 10px;
  border: 1px solid #ef4444;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  color: #ef4444;
  background: white;
}

.btn-update {
  background: #ef4444;
  color: white;
}
</style>
