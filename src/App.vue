<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
    <div class="max-w-md m-auto bg-white rounded-lg shadow-lg p-6">
      <CalculatorTabs />
      <CalculatorForm />
      <CalculatorResult />
    </div>
  </div>
</template>

<script setup lang="ts">
import CalculatorTabs from "./components/CalculatorTabs.vue";
import CalculatorForm from "./components/CalculatorForm.vue";
import CalculatorResult from "./components/CalculatorResult.vue";
</script>
