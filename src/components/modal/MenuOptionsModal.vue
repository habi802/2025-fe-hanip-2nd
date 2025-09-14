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
    const resp = await axios.get(`/api/menus/${props.menuId}`);
    menu.value = resp.data;
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
  <div v-if="visible" class="menu-modal-backdrop">
    <div class="menu-modal">
      <div v-if="loading" class="menu-modal__loading">로딩 중...</div>
      <div v-else-if="error" class="menu-modal__error">에러 발생: {{ error.message }}</div>

      <div v-else>
        <img :src="menu.imageUrl" :alt="menu.name" class="menu-modal__image" />

        <div class="menu-modal__content">
          <!-- 제목 -->
          <div class="menu-modal__header">
            <h2>{{ menu.name }}</h2>
            <p>{{ menu.description }}</p>
          </div>

          <!-- 옵션 그룹 -->
          <div
            v-for="group in menu.optionGroups"
            :key="group.id"
            class="menu-modal__option-group"
          >
            <h3>
              {{ group.name }}
              <span v-if="group.required" class="required">(필수)</span>
              <span v-else class="optional">(추가)</span>
            </h3>
            <div class="menu-modal__options">
              <label
                v-for="item in group.items"
                :key="item.id"
                class="menu-modal__option"
              >
                <input
                  type="radio"
                  :name="group.id"
                  :value="item.id"
                  v-model="selectedOptions[group.id]"
                />
                <span class="label">{{ item.label }}</span>
                <span class="price">+{{ item.price }}원</span>
              </label>
            </div>
          </div>

          <!-- 수량 -->
          <div class="menu-modal__quantity">
            <span>수량</span>
            <div class="controls">
              <button @click="decreaseQty">-</button>
              <span class="count">{{ quantity }}</span>
              <button @click="increaseQty">+</button>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="menu-modal__actions">
            <button @click="$emit('close')" class="cancel">취소</button>
            <button @click="handleAddToCart" class="confirm">메뉴담기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-modal-backdrop {
  @apply fixed inset-0 flex items-center justify-center bg-black/50 z-50;
}

.menu-modal {
  width: 420px;
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);

  &__loading,
  &__error {
    padding: 1.5rem;
    text-align: center;
  }

  &__error {
    color: #ef4444;
  }

  &__image {
    width: 100%;
    height: 12rem;
    object-fit: cover;
  }

  &__content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__header {
    h2 {
      font-size: 1.25rem;
      font-weight: 700;
    }
    p {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }
  }

  &__option-group {
    h3 {
      font-weight: 600;
      margin-bottom: 0.5rem;
      .required {
        font-size: 0.75rem;
        color: #ef4444;
        margin-left: 0.25rem;
      }
      .optional {
        font-size: 0.75rem;
        color: #9ca3af;
        margin-left: 0.25rem;
      }
    }
  }

  &__options {
    display: grid;
    gap: 0.5rem;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #f9fafb;
    }

    input[type="radio"] {
      accent-color: #ef4444;
      width: 1rem;
      height: 1rem;
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

  &__quantity {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-weight: 600;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 1rem;

      button {
        width: 2rem;
        height: 2rem;
        border: 1px solid #e5e7eb;
        border-radius: 9999px;
        font-size: 1.125rem;
        font-weight: 700;
        background: #fff;
        transition: background 0.2s;

        &:hover {
          background: #f3f4f6;
        }
      }

      .count {
        width: 1.5rem;
        text-align: center;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    padding-top: 0.5rem;

    button {
      flex: 1;
      padding: 0.75rem;
      border-radius: 0.75rem;
      font-weight: 600;
      transition: background 0.2s;
    }

    .cancel {
      border: 1px solid #d1d5db;
      color: #4b5563;

      &:hover {
        background: #f3f4f6;
      }
    }

    .confirm {
      background: #ef4444;
      color: #fff;
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);

      &:hover {
        background: #dc2626;
      }
    }
  }
}
</style>
