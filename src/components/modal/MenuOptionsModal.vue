<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  menuId: { type: String, required: true },
  visible: { type: Boolean, default: false }
});

const emits = defineEmits(["close", "addToCart"]);

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
    if (!resp.ok) {
      throw new Error("메뉴 불러오기 실패");
    }
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

function handleAddToCart() {
  const selection = {
    menuId: menu.value.id,
    selectedOptionItems: { ...selectedOptions.value },
    quantity: quantity.value
  };
  emits("addToCart", selection);
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
        <img :src="menu.imageUrl" :alt="menu.name" class="modal-image" />

        <div class="modal-body">
          <div>
            <h2 class="modal-title">{{ menu.name }}</h2>
            <p class="modal-desc">{{ menu.description }}</p>
          </div>

          <div v-for="group in menu.optionGroups" :key="group.id" class="option-group">
            <h3 class="option-title">
              {{ group.name }}
              <span v-if="group.required" class="required">(필수)</span>
              <span v-else class="optional">(추가)</span>
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
                <span class="price">+{{ item.price }}원</span>
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
            <button @click="$emit('close')" class="btn-cancel">취소</button>
            <button @click="handleAddToCart" class="btn-add">메뉴담기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped >
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
  width: 420px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.modal-image {
  width: 100%;
  height: 12rem;
  object-fit: cover;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.modal-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-title {
  font-weight: 600;
  font-size: 1rem;
}

.required {
  color: #ef4444;
  font-size: 0.75rem;
  margin-left: 4px;
}

.optional {
  color: #9ca3af;
  font-size: 0.75rem;
  margin-left: 4px;
}

.option-list {
  display: grid;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

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
  gap: 16px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  font-size: 1.125rem;
  font-weight: bold;
  background: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.qty-num {
  width: 24px;
  text-align: center;
}

.btn-row {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  color: #4b5563;
  background: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }
}

.btn-add {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  background: #ef4444;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.4);
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #dc2626;
  }
}

.loading {
  padding: 24px;
  text-align: center;
}

.error {
  padding: 24px;
  color: #ef4444;
}
</style>
