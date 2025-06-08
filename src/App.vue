<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
    <div class="max-w-md mx-auto pt-12">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        KCG計算機
      </h1>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-center mb-6">
          <button
            @click="activeTab = 'badHand'"
            :class="{
              'px-4 py-2 rounded-l-md text-sm font-medium transition-colors duration-200': true,
              'bg-blue-600 text-white': activeTab === 'badHand',
              'bg-gray-200 text-gray-700 hover:bg-gray-300':
                activeTab !== 'badHand',
            }"
          >
            初手事故率
          </button>
          <button
            @click="activeTab = 'expMulligan'"
            :class="{
              'px-4 py-2 rounded-r-md text-sm font-medium transition-colors duration-200': true,
              'bg-blue-600 text-white': activeTab === 'expMulligan',
              'bg-gray-200 text-gray-700 hover:bg-gray-300':
                activeTab !== 'expMulligan',
            }"
          >
            マリガン期待値
          </button>
        </div>

        <form @submit.prevent="calculate" class="space-y-6">
          <div v-for="field in currentFormFields" :key="field.id">
            <label
              :for="field.id"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              {{ field.label }}
            </label>
            <input
              :id="field.id"
              v-model.number="inputs[field.modelKey]"
              :type="field.type"
              :min="field.min"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            計算する
          </button>
        </form>

        <div v-if="result !== null" class="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">計算結果</h3>
          <p class="text-2xl font-bold text-blue-600">
            {{ result.toFixed(2) }}{{ activeTab === "badHand" ? "%" : "回" }}
          </p>
          <p class="text-sm text-gray-600 mt-1">
            {{ activeTab === "badHand" ? "事故率" : "マリガン期待値" }}
          </p>
        </div>

        <div v-if="error" class="mt-6 p-4 bg-red-50 rounded-md">
          <p class="text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { calcBadHand } from "./utils/calc_bad_hand";
import { calcExpMulligan } from "./utils/calc_expected_mulligan";

type Tab = "badHand" | "expMulligan";
const activeTab = ref<Tab>("badHand");

const inputs = ref<{
  deck: number | null;
  hand: number | null;
  Artist: number | null;
  goodArtist: number | null;
  badArtist: number | null;
  mulliganCount: number | null;
}>({
  deck: 60,
  hand: 7,
  Artist: 4,
  goodArtist: 4,
  badArtist: 1,
  mulliganCount: 1,
});

const result = ref<number | null>(null);
const error = ref<string | null>(null);

watch(activeTab, () => {
  result.value = null;
  error.value = null;
});

type FormField = {
  id: string;
  label: string;
  modelKey: keyof typeof inputs.value;
  type: string;
  min: number;
};

const badHandFormFields: FormField[] = [
  { id: "deck", label: "デッキ枚数", modelKey: "deck", type: "number", min: 1 },
  { id: "hand", label: "手札枚数", modelKey: "hand", type: "number", min: 1 },
  {
    id: "goodArtist",
    label: "来てほしいArtistの枚数",
    modelKey: "goodArtist",
    type: "number",
    min: 0,
  },
  {
    id: "badArtist",
    label: "来てほしくないArtistの枚数",
    modelKey: "badArtist",
    type: "number",
    min: 0,
  },
];

const expMulliganFormFields: FormField[] = [
  { id: "deck", label: "デッキ枚数", modelKey: "deck", type: "number", min: 1 },
  { id: "hand", label: "手札枚数", modelKey: "hand", type: "number", min: 1 },
  {
    id: "Artist",
    label: "Artistの枚数",
    modelKey: "Artist",
    type: "number",
    min: 0,
  },
];

const currentFormFields = computed(() => {
  if (activeTab.value === "badHand") {
    return badHandFormFields;
  } else {
    return expMulliganFormFields;
  }
});

const calculate = () => {
  error.value = null;
  result.value = null;

  if (activeTab.value === "badHand") {
    if (
      inputs.value.deck === null ||
      inputs.value.hand === null ||
      inputs.value.goodArtist === null ||
      inputs.value.badArtist === null
    ) {
      error.value = "すべての項目を入力してください";
      return;
    }

    const { deck, hand, goodArtist, badArtist } = inputs.value;

    try {
      result.value = calcBadHand(deck, hand, goodArtist, badArtist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "計算中に不明なエラーが発生しました";
      }
      console.error(err);
    }
  } else {
    // expMulligan
    if (
      inputs.value.deck === null ||
      inputs.value.hand === null ||
      inputs.value.Artist === null
    ) {
      error.value = "すべての項目を入力してください";
      return;
    }

    const { deck, hand, Artist } = inputs.value;

    try {
      result.value = calcExpMulligan(deck, hand, Artist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "計算中に不明なエラーが発生しました";
      }
      console.error(err);
    }
  }
};
</script>
