<template>
  <div class="mt-8">
    <Transition
      name="result"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform scale-95"
      enter-to-class="opacity-100 transform scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform scale-100"
      leave-to-class="opacity-0 transform scale-95"
    >
      <div
        v-if="calculatorStore.hasResult && result"
        class="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 shadow-lg"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-green-800">計算結果</h3>
        </div>

        <div class="space-y-4">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          >
            <span class="text-gray-700 font-medium">
              {{ result.description }}:
            </span>
            <div class="flex items-center gap-2">
              <span
                ref="resultValue"
                class="text-2xl sm:text-3xl font-bold text-green-600 tabular-nums"
              >
                {{ formattedValue }}
              </span>
              <span class="text-lg text-green-600">{{ result.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition
      name="error"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform scale-95"
      enter-to-class="opacity-100 transform scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform scale-100"
      leave-to-class="opacity-0 transform scale-95"
    >
      <div
        v-if="calculatorStore.hasError && error"
        class="bg-red-50 border border-red-200 rounded-lg p-6 shadow-lg"
      >
        <div class="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-red-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800">エラー</h3>
            <p class="text-red-700 mt-1">{{ error.message }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <div
      v-if="calculatorStore.isCalculating"
      class="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-lg"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-blue-700 font-medium">計算中...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCalculatorStore } from "../stores/calculator";

const calculatorStore = useCalculatorStore();

// 結果とエラーの取得
const result = computed(() => calculatorStore.result);
const error = computed(() => calculatorStore.error);

// 数値フォーマット用
const formattedValue = computed(() => {
  if (!result.value) return "0";

  const value = result.value.value;

  // 小数点以下の桁数を適切に調整
  if (value % 1 === 0) {
    // 整数の場合
    return value.toLocaleString();
  } else {
    // 小数の場合、有効桁数を考慮
    return Number(value.toFixed(3)).toLocaleString();
  }
});
</script>
