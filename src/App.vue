<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
    <div class="max-w-md mx-auto pt-12">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        初手事故率計算機
      </h1>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <form @submit.prevent="calculate" class="space-y-6">
          <div>
            <label
              for="deck"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              デッキ枚数
            </label>
            <input
              id="deck"
              v-model.number="inputs.deck"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              for="hand"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              手札枚数
            </label>
            <input
              id="hand"
              v-model.number="inputs.hand"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              for="goodArtist"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              来てほしいArtistの枚数
            </label>
            <input
              id="goodArtist"
              v-model.number="inputs.goodArtist"
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              for="badArtist"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              来てほしくないArtistの枚数
            </label>
            <input
              id="badArtist"
              v-model.number="inputs.badArtist"
              type="number"
              min="0"
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
            {{ result.toFixed(2) }}%
          </p>
          <p class="text-sm text-gray-600 mt-1">事故率</p>
        </div>

        <div v-if="error" class="mt-6 p-4 bg-red-50 rounded-md">
          <p class="text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { calcBadHand } from "./utils/calc_bad_hand";

const inputs = ref<{
  deck: number | null;
  hand: number | null;
  goodArtist: number | null;
  badArtist: number | null;
}>({
  deck: 60,
  hand: 7,
  goodArtist: 4,
  badArtist: 1,
});

const result = ref<number | null>(null);
const error = ref<string | null>(null);

const calculate = () => {
  error.value = null;

  if (
    !inputs.value.deck ||
    !inputs.value.hand ||
    inputs.value.goodArtist == null ||
    inputs.value.badArtist == null
  ) {
    error.value = "すべての項目を入力してください";
    return;
  }

  const { deck, hand, goodArtist, badArtist } = inputs.value;

  // バリデーション
  if (hand > deck) {
    error.value = "手札枚数はデッキ枚数以下にしてください";
    return;
  }

  if (goodArtist + badArtist > deck) {
    error.value = "アーティストの合計枚数はデッキ枚数以下にしてください";
    return;
  }

  try {
    result.value = calcBadHand(deck, hand, goodArtist, badArtist);
  } catch (err) {
    error.value = "計算中にエラーが発生しました";
    console.error(err);
  }
};
</script>
