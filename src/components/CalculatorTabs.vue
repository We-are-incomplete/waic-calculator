<template>
  <div class="flex justify-center mb-6">
    <button
      @click="handleTabChange('badHand')"
      :class="getTabButtonClass('badHand')"
    >
      初手事故率
    </button>
    <button
      @click="handleTabChange('expMulligan')"
      :class="getTabButtonClass('expMulligan')"
    >
      マリガン期待値
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCalculatorStore, type CalculatorTab } from "../stores/calculator";

const calculatorStore = useCalculatorStore();

// 早期リターンパターンを使用したクラス計算
const getTabButtonClass = (tab: CalculatorTab): string => {
  const baseClasses =
    "px-4 py-2 text-sm font-medium transition-colors duration-200";
  const isActive = calculatorStore.activeTab === tab;

  if (tab === "badHand") {
    const roundedClass = "rounded-l-md";
    if (isActive) {
      return `${baseClasses} ${roundedClass} bg-blue-600 text-white`;
    }
    return `${baseClasses} ${roundedClass} bg-gray-200 text-gray-700 hover:bg-gray-300`;
  }

  // expMulligan tab
  const roundedClass = "rounded-r-md";
  if (isActive) {
    return `${baseClasses} ${roundedClass} bg-blue-600 text-white`;
  }
  return `${baseClasses} ${roundedClass} bg-gray-200 text-gray-700 hover:bg-gray-300`;
};

const handleTabChange = (tab: CalculatorTab): void => {
  calculatorStore.setActiveTab(tab);
};
</script>
