<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
    <div class="max-w-md mx-auto pt-12">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        KCG計算機
      </h1>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <CalculatorTabs />
        <CalculatorForm />
        <CalculatorResult />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CalculatorTabs from "./components/CalculatorTabs.vue";
import CalculatorForm from "./components/CalculatorForm.vue";
import CalculatorResult from "./components/CalculatorResult.vue";
</script>
