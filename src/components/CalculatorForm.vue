<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-for="field in currentFormFields" :key="field.id">
      <label
        :for="field.id"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        {{ field.label }}
      </label>
      <input
        :id="field.id"
        :ref="(el) => setFieldRef(el as HTMLInputElement, field.id)"
        :value="getFieldValue(field.modelKey)"
        @input="handleInputChange(field.modelKey, $event)"
        :type="field.type"
        :min="field.min"
        :max="field.max"
        :required="field.required"
        :disabled="calculatorStore.isCalculating"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      />
    </div>

    <div class="flex gap-3">
      <button
        type="submit"
        :disabled="calculatorStore.isCalculating"
        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ calculatorStore.isCalculating ? "計算中..." : "計算する" }}
      </button>

      <button
        type="button"
        @click="handleReset"
        :disabled="calculatorStore.isCalculating"
        class="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        リセット
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from "vue";
import { useEventListener } from "@vueuse/core";
import { useCalculatorStore } from "../stores/calculator";
import type { BadHandInputs, ExpMulliganInputs } from "../stores/calculator";
import {
  createBadHandFormFields,
  createExpMulliganFormFields,
} from "../types/form";

const calculatorStore = useCalculatorStore();

// フィールド参照を管理するためのコンポジット
const fieldRefs = ref<Record<string, HTMLInputElement>>({});

const setFieldRef = (el: HTMLInputElement | null, id: string) => {
  if (el) {
    fieldRefs.value[id] = el;
  } else {
    delete fieldRefs.value[id];
  }
};

// 現在のタブに応じたフォームフィールドを取得（純粋関数）
const currentFormFields = computed(() => {
  if (calculatorStore.activeTab === "badHand") {
    return createBadHandFormFields();
  }
  return createExpMulliganFormFields();
});

// フィールド値の取得（型安全）
const getFieldValue = (fieldKey: string): number => {
  if (calculatorStore.activeTab === "badHand") {
    const inputs = calculatorStore.badHandInputs;
    return inputs[fieldKey as keyof typeof inputs];
  }

  const inputs = calculatorStore.expMulliganInputs;
  return inputs[fieldKey as keyof typeof inputs];
};

// 入力値の変更処理（早期リターンパターン）
const handleInputChange = (fieldKey: string, event: Event): void => {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);

  // 無効な数値の場合は早期リターン
  if (isNaN(value)) {
    return;
  }

  if (calculatorStore.activeTab === "badHand") {
    calculatorStore.updateBadHandInputs({
      [fieldKey]: value,
    } as Partial<BadHandInputs>);
    return;
  }

  calculatorStore.updateExpMulliganInputs({
    [fieldKey]: value,
  } as Partial<ExpMulliganInputs>);
};

const handleSubmit = (): void => {
  calculatorStore.calculate();
};

const handleReset = async (): Promise<void> => {
  calculatorStore.resetInputs();

  // リセット後に最初のフィールドにフォーカス
  await nextTick();
  const firstField = currentFormFields.value[0];
  if (firstField && fieldRefs.value[firstField.id]) {
    fieldRefs.value[firstField.id].focus();
  }
};

// キーボードショートカット
useEventListener("keydown", (event: KeyboardEvent) => {
  // Ctrl+Enter で計算実行
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    if (!calculatorStore.isCalculating) {
      handleSubmit();
    }
  }

  // Ctrl+R でリセット
  if ((event.ctrlKey || event.metaKey) && event.key === "r") {
    event.preventDefault();
    if (!calculatorStore.isCalculating) {
      handleReset();
    }
  }
});
</script>
