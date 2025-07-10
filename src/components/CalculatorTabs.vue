<template>
  <div class="mb-6">
    <div
      class="flex space-x-1 p-1 bg-gray-100 rounded-lg"
      role="tablist"
      @keydown="handleKeydown"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="setActiveTab(tab.id)"
        :aria-selected="calculatorStore.activeTab === tab.id"
        :tabindex="calculatorStore.activeTab === tab.id ? 0 : -1"
        role="tab"
        class="relative flex-1 py-2 px-3 text-sm font-medium text-center rounded-md transition-all duration-200"
        :class="[
          calculatorStore.activeTab === tab.id
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
        ]"
      >
        <span class="relative z-10">{{ tab.label }}</span>

        <!-- アクティブタブのインジケーター -->
        <div
          v-if="calculatorStore.activeTab === tab.id"
          class="absolute inset-0 bg-white rounded-md shadow-sm transition-all duration-200"
          style="z-index: 1"
        ></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { useCalculatorStore, type CalculatorTab } from "../stores/calculator";

const calculatorStore = useCalculatorStore();

// タブの定義
interface Tab {
  id: CalculatorTab;
  label: string;
}

const tabs: Tab[] = [
  {
    id: "badHand",
    label: "事故率計算",
  },
  {
    id: "expMulligan",
    label: "マリガン期待値",
  },
];

// タブの切り替え
const setActiveTab = (tabId: CalculatorTab): void => {
  calculatorStore.setActiveTab(tabId);
};

// キーボードナビゲーション
const handleKeydown = (event: KeyboardEvent): void => {
  const currentIndex = tabs.findIndex(
    (tab) => tab.id === calculatorStore.activeTab,
  );

  let newIndex = currentIndex;

  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      break;
    case "ArrowRight":
      event.preventDefault();
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      break;
    case "Home":
      event.preventDefault();
      newIndex = 0;
      break;
    case "End":
      event.preventDefault();
      newIndex = tabs.length - 1;
      break;
    default:
      return;
  }

  if (newIndex !== currentIndex) {
    setActiveTab(tabs[newIndex].id);
  }
};

// 数字キーでタブ切り替え
useEventListener("keydown", (event: KeyboardEvent) => {
  // Alt + 数字キーでタブ切り替え
  if (event.altKey && !event.ctrlKey && !event.metaKey) {
    const keyNum = parseInt(event.key);
    if (keyNum >= 1 && keyNum <= tabs.length) {
      event.preventDefault();
      setActiveTab(tabs[keyNum - 1].id);
    }
  }
});
</script>
