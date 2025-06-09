<template>
  <div>
    <!-- 成功時の結果表示 -->
    <div
      v-if="calculatorStore.hasResult && calculatorStore.result"
      class="mt-6 p-4 bg-blue-50 rounded-md"
    >
      <h3 class="text-lg font-semibold text-gray-800 mb-2">計算結果</h3>
      <p class="text-2xl font-bold text-blue-600">
        {{ formatResultValue(calculatorStore.result.value)
        }}{{ calculatorStore.result.unit }}
      </p>
      <p class="text-sm text-gray-600 mt-1">
        {{ calculatorStore.result.description }}
      </p>
    </div>

    <!-- エラー時の表示 -->
    <div
      v-if="calculatorStore.hasError && calculatorStore.error"
      class="mt-6 p-4 bg-red-50 rounded-md"
    >
      <div class="flex items-center">
        <svg
          class="w-5 h-5 text-red-400 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <p class="text-red-600 font-medium">エラー</p>
      </div>
      <p class="text-red-700 mt-2">{{ calculatorStore.error.message }}</p>
    </div>

    <!-- 計算中の表示 -->
    <div
      v-if="calculatorStore.isCalculating"
      class="mt-6 p-4 bg-gray-50 rounded-md"
    >
      <div class="flex items-center">
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-gray-600">計算中です...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCalculatorStore } from "../stores/calculator";

const calculatorStore = useCalculatorStore();

// 結果値のフォーマット（純粋関数）
const formatResultValue = (value: number): string => {
  // 小数点以下2桁で四捨五入
  return value.toFixed(2);
};
</script>
