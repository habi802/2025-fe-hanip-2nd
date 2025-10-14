<script setup lang="ts">
import { reactive, ref, watch, onActivated } from "vue";

const props = defineProps<{
  form: Record<string, any>;
  isActive?: number;
}>();
const emit = defineEmits<{ "update-form": [any] }>();

const localForm = reactive({ ...props.form });

watch(
  () => props.form,
  (v) => {
    Object.assign(localForm, v ?? {});
  },
  { deep: true }
);

watch(
  localForm,
  (v) => {
    emit("update-form", { ...v });
  },
  { deep: true }
);

onActivated(() => {
  Object.assign(localForm, props.form ?? {});
});

const fmt = new Intl.NumberFormat("ko-KR");
const uncomma = (s: string) =>
  Number(String(s ?? "").replace(/[^\d]/g, "") || 0);
const comma = (n: number) => (isNaN(n) ? "" : fmt.format(n));

/* 금액 입력 핸들러 */
const onMoneyInput = (
  e: Event,
  key: "minAmount" | "minDeliveryFee" | "maxDeliveryFee"
) => {
  const el = e.target as HTMLInputElement;
  const num = uncomma(el.value);
  (localForm as any)[key] = num;
  el.value = comma(num);
};

/* 토글 (1/0) */
const onToggle = (key: "isOpen" | "isPickUp", v: boolean) => {
  (localForm as any)[key] = v ? 1 : 0;
};
</script>

<template>
  <div class="container-fluid">
    <h5 class="mb-3 fw-bold border-bottom pb-2 text-center">가게 운영관리</h5>

    <div class="row align-items-start">
      <!-- 좌측: 영업 상태/포장 여부 -->
      <div class="col-md-6">
        <!-- 영업 중 -->
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">영업 중</label>
          <div class="col-sm-8 d-flex align-items-center">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                :checked="localForm.isOpen === 1"
                @change="
                  onToggle(
                    'isOpen',
                    ($event.target as HTMLInputElement).checked
                  )
                "
                :disabled="props.isActive === 1"
              />
              <span class="ms-2">{{
                localForm.isOpen === 1 ? "ON" : "OFF"
              }}</span>
            </div>
          </div>
        </div>

        <!-- 포장 주문 가능 -->
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">포장 주문</label>
          <div class="col-sm-8 d-flex align-items-center">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                :checked="localForm.isPickUp === 1"
                @change="
                  onToggle(
                    'isPickUp',
                    ($event.target as HTMLInputElement).checked
                  )
                "
                :disabled="props.isActive === 1"
              />
              <span class="ms-2">{{
                localForm.isPickUp === 1 ? "가능" : "불가"
              }}</span>
            </div>
          </div>
        </div>

        <!-- 가게 이벤트 공지 -->
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">이벤트 공지</label>
          <div class="col-sm-8">
            <textarea
              class="form-control"
              rows="4"
              :value="localForm.eventComment"
              @input="
                localForm.eventComment = (
                  $event.target as HTMLTextAreaElement
                ).value
              "
              placeholder="최대 500자 이하: 재료소진, 배달지연, 이벤트 안내 등"
              :disabled="props.isActive === 1"
            />
          </div>
        </div>
      </div>

      <!-- 우측: 시간/휴무/금액 -->
      <div class="col-md-6">
        <!-- 영업 시간 -->
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">영업 시간</label>
          <div class="col-sm-8 d-flex align-items-center gap-2">
            <input
              type="time"
              class="form-control w-auto"
              :value="localForm.openTime"
              @change="
                localForm.openTime = ($event.target as HTMLInputElement).value
              "
              :disabled="props.isActive === 1"
            />
            <span class="opacity-75">~</span>
            <input
              type="time"
              class="form-control w-auto"
              :value="localForm.closeTime"
              @change="
                localForm.closeTime = ($event.target as HTMLInputElement).value
              "
              :disabled="props.isActive === 1"
            />
          </div>
        </div>

        <!-- 휴무일 -->
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">휴무일</label>
          <div class="col-sm-8">
            <div class="d-flex flex-wrap gap-3">
              <label class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="closedDay"
                  value="월요일"
                  :checked="localForm.closedDay === '월요일'"
                  @change="localForm.closedDay = '월요일'"
                  :disabled="props.isActive === 1"
                />
                <span class="ms-1">월</span>
              </label>
              <label class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="closedDay"
                  value="화요일"
                  :checked="localForm.closedDay === '화요일'"
                  @change="localForm.closedDay = '화요일'"
                  :disabled="props.isActive === 1"
                />
                <span class="ms-1">화</span>
              </label>
              <label class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="closedDay"
                  value="수요일"
                  :checked="localForm.closedDay === '수요일'"
                  @change="localForm.closedDay = '수요일'"
                  :disabled="props.isActive === 1"
                />
                <span class="ms-1">수</span>
              </label>
              <label class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="closedDay"
                  value="목요일"
                  :checked="localForm.closedDay === '목요일'"
                  @change="localForm.closedDay = '목요일'"
                  :disabled="props.isActive === 1"
                />
                <span class="ms-1">목</span>
              </label>
              <label class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="closedDay"
                  value="금요일"
                  :checked="localForm.closedDay === '금요일'"
                  @change="localForm.closedDay = '금요일'"
                  :disabled="props.isActive === 1"
                />
                <span class="ms-1">금</span>
              </label>
              <label class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="closedDay"
                  value="토요일"
                  :checked="localForm.closedDay === '토요일'"
                  @change="localForm.closedDay = '토요일'"
                  :disabled="props.isActive === 1"
                />
                <span class="ms-1">토</span>
              </label>
              <label class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="closedDay"
                  value="일요일"
                  :checked="localForm.closedDay === '일요일'"
                  @change="localForm.closedDay = '일요일'"
                  :disabled="props.isActive === 1"
                />
                <span class="ms-1">일</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 최소 주문 금액 -->
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold"
            >최소 주문 금액</label
          >
          <div class="col-sm-8">
            <div class="input-group">
              <input
                type="text"
                class="form-control text-end"
                :value="
                  localForm.minAmount
                    ? localForm.minAmount.toLocaleString('ko-KR')
                    : ''
                "
                inputmode="numeric"
                placeholder="0"
                @input="onMoneyInput($event, 'minAmount')"
                :disabled="props.isActive === 1"
              />
              <span class="input-group-text">원 이상</span>
            </div>
          </div>
        </div>

        <!-- 배달료 -->
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label fw-semibold">배달료</label>
          <div class="col-sm-8 d-flex align-items-center gap-2">
            <div class="input-group w-50">
              <input
                type="text"
                class="form-control text-end"
                :value="
                  localForm.minDeliveryFee
                    ? localForm.minDeliveryFee.toLocaleString('ko-KR')
                    : ''
                "
                inputmode="numeric"
                placeholder="0"
                @input="onMoneyInput($event, 'minDeliveryFee')"
                :disabled="props.isActive === 1"
              />
              <span class="input-group-text">원</span>
            </div>
            <span class="opacity-75">~</span>
            <div class="input-group w-50">
              <input
                type="text"
                class="form-control text-end"
                :value="
                  localForm.maxDeliveryFee
                    ? localForm.maxDeliveryFee.toLocaleString('ko-KR')
                    : ''
                "
                inputmode="numeric"
                placeholder="0"
                @input="onMoneyInput($event, 'maxDeliveryFee')"
                :disabled="props.isActive === 1"
              />
              <span class="input-group-text">원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h5 {
  letter-spacing: 0.2px;
}
.col-form-label {
  color: #212529;
}
.form-check-input {
  cursor: pointer;
}
.input-group-text {
  min-width: 70px;
  justify-content: center;
}

@media (max-width: 575.98px) {
  .input-group-text {
    min-width: 56px;
  }
}

/* --- Switch(토글) 색/크기 커스텀 --- */
:deep(.form-switch .form-check-input) {
  width: 3rem; /* 토글 길이 */
  height: 1.6rem; /* 토글 높이 */
  background-color: #e9ecef; /* OFF 트랙 색 */
  border-color: #ced4da;
}
:deep(.form-switch .form-check-input:not(:checked)) {
  background-color: #adb5bd; /* OFF일 때 좀 더 진한 회색 */
}

/* ON 트랙/테두리 색 */
:deep(.form-switch .form-check-input:checked) {
  background-color: #ff6666; /* Bootstrap primary 예시 (#0d6efd) */
  border-color: #ff6666;
}

/* 토글 '동그라미' 색 (기본은 흰색인데 바꾸고 싶으면) */
:deep(.form-switch .form-check-input::before) {
  background-color: #fff; /* OFF 노브 */
}
:deep(.form-switch .form-check-input:checked::before) {
  background-color: #fff; /* ON 노브 (원하면 #0b5ed7 같은 진한색으로) */
}

/* 포커스 링 */
:deep(.form-switch .form-check-input:focus) {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25); /* primary 색의 투명 링 */
}

/* --- Radio(라디오) 색 커스텀 --- */
:deep(.form-check-input[type="radio"]) {
  border-color: #adb5bd; /* 테두리 기본색 */
}

/* 체크되었을 때 점/배경/테두리 */
:deep(.form-check-input[type="radio"]:checked) {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
}

/* 라디오 포커스 링 */
:deep(.form-check-input[type="radio"]:focus) {
  box-shadow: 0 0 0 0.25rem rgba(255, 107, 107, 0.25);
}
</style>
