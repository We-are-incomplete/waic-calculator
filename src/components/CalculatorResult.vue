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
          <button
            @click="copyToClipboard"
            :disabled="!isClipboardSupported || isCopying"
            class="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            :title="
              isClipboardSupported
                ? 'クリップボードにコピー'
                : 'お使いのブラウザはクリップボード機能をサポートしていません'
            "
          >
            <svg
              v-if="!isCopying && !isJustCopied"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <svg
              v-else-if="isJustCopied"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div
              v-else
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            <span v-if="isJustCopied">コピー済み</span>
            <span v-else-if="isCopying">コピー中...</span>
            <span v-else>コピー</span>
          </button>
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

          <div class="text-sm text-gray-600 bg-white bg-opacity-50 rounded p-3">
            <p class="mb-2"><strong>計算パラメータ:</strong></p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div v-for="param in currentParameters" :key="param.label">
                <span class="font-medium">{{ param.label }}:</span>
                <span class="ml-1 tabular-nums">{{ param.value }}</span>
              </div>
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
import { computed, ref } from "vue";
import { useClipboard } from "@vueuse/core";
import { useCalculatorStore } from "../stores/calculator";

const calculatorStore = useCalculatorStore();

// クリップボード機能
const { isSupported: isClipboardSupported, copy } = useClipboard();
const isCopying = ref(false);
const isJustCopied = ref(false);

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

// 現在のパラメータを表示用に整形
const currentParameters = computed(() => {
  if (calculatorStore.activeTab === "badHand") {
    const inputs = calculatorStore.badHandInputs;
    return [
      { label: "デッキ枚数", value: inputs.deck },
      { label: "初期手札枚数", value: inputs.hand },
      { label: "良いカード枚数", value: inputs.goodArtist },
      { label: "悪いカード枚数", value: inputs.badArtist },
    ];
  } else {
    const inputs = calculatorStore.expMulliganInputs;
    return [
      { label: "デッキ枚数", value: inputs.deck },
      { label: "初期手札枚数", value: inputs.hand },
      { label: "対象カード枚数", value: inputs.artist },
    ];
  }
});

// クリップボードにコピー
const copyToClipboard = async (): Promise<void> => {
  if (!result.value || !isClipboardSupported.value || isCopying.value) {
    return;
  }

  isCopying.value = true;

  try {
    const copyText = `${result.value.description}: ${formattedValue.value}${
      result.value.unit
    }

計算パラメータ:
${currentParameters.value
  .map((param) => `${param.label}: ${param.value}`)
  .join("\n")}`;

    await copy(copyText);
    isJustCopied.value = true;

    // 2秒後にコピー状態をリセット
    setTimeout(() => {
      isJustCopied.value = false;
    }, 2000);
  } catch (error) {
    console.error("クリップボードへのコピーに失敗しました:", error);
  } finally {
    isCopying.value = false;
  }
};
</script>
