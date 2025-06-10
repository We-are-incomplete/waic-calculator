import { defineStore } from "pinia";
import { ref, computed, readonly } from "vue";
import { useStorage, useCloned } from "@vueuse/core";
import { calcBadHand } from "../utils/calc_bad_hand";
import { calcExpMulligan } from "../utils/calc_expected_mulligan";

// 代数的データ型の定義
export type CalculatorTab = "badHand" | "expMulligan";

export type BadHandInputs = {
  deck: number;
  hand: number;
  goodArtist: number;
  badArtist: number;
};

export type ExpMulliganInputs = {
  deck: number;
  hand: number;
  artist: number;
};

export type CalculationResult = {
  value: number;
  unit: string;
  description: string;
};

export type CalculationError = {
  message: string;
};

export type CalculationState =
  | { type: "idle" }
  | { type: "calculating" }
  | { type: "success"; result: CalculationResult }
  | { type: "error"; error: CalculationError };

// デフォルト値
const DEFAULT_BAD_HAND_INPUTS: BadHandInputs = {
  deck: 60,
  hand: 7,
  goodArtist: 4,
  badArtist: 1,
};

const DEFAULT_EXP_MULLIGAN_INPUTS: ExpMulliganInputs = {
  deck: 60,
  hand: 7,
  artist: 4,
};

// Pinia ストアの定義（Setup API Style）
export const useCalculatorStore = defineStore("calculator", () => {
  // 永続化された状態（VueUseのuseStorageを使用）
  const activeTab = useStorage<CalculatorTab>("calculator-tab", "badHand");

  const badHandInputs = useStorage<BadHandInputs>(
    "calculator-bad-hand-inputs",
    DEFAULT_BAD_HAND_INPUTS
  );

  const expMulliganInputs = useStorage<ExpMulliganInputs>(
    "calculator-exp-mulligan-inputs",
    DEFAULT_EXP_MULLIGAN_INPUTS
  );

  // 計算状態（セッション中のみ保持）
  const calculationState = ref<CalculationState>({ type: "idle" });

  // 計算された状態（computed refs）
  const isCalculating = computed(
    () => calculationState.value.type === "calculating"
  );
  const hasResult = computed(() => calculationState.value.type === "success");
  const hasError = computed(() => calculationState.value.type === "error");

  const result = computed(() => {
    if (calculationState.value.type === "success") {
      return calculationState.value.result;
    }
    return null;
  });

  const error = computed(() => {
    if (calculationState.value.type === "error") {
      return calculationState.value.error;
    }
    return null;
  });

  // 現在のタブに対応する入力値を取得
  const currentInputs = computed(() => {
    if (activeTab.value === "badHand") {
      return badHandInputs.value;
    }
    return expMulliganInputs.value;
  });

  // アクション（純粋関数として実装）
  const setActiveTab = (tab: CalculatorTab): void => {
    activeTab.value = tab;
    calculationState.value = { type: "idle" };
  };

  const updateBadHandInputs = (inputs: Partial<BadHandInputs>): void => {
    badHandInputs.value = { ...badHandInputs.value, ...inputs };
  };

  const updateExpMulliganInputs = (
    inputs: Partial<ExpMulliganInputs>
  ): void => {
    expMulliganInputs.value = { ...expMulliganInputs.value, ...inputs };
  };

  const calculateBadHand = (): void => {
    calculationState.value = { type: "calculating" };

    const { deck, hand, goodArtist, badArtist } = badHandInputs.value;
    const result = calcBadHand(deck, hand, goodArtist, badArtist);

    if (result.isErr()) {
      calculationState.value = {
        type: "error",
        error: { message: result.error },
      };
      return;
    }

    calculationState.value = {
      type: "success",
      result: {
        value: result.value,
        unit: "%",
        description: "事故率",
      },
    };
  };

  const calculateExpMulligan = (): void => {
    calculationState.value = { type: "calculating" };

    const { deck, hand, artist } = expMulliganInputs.value;
    const result = calcExpMulligan(deck, hand, artist);

    if (result.isErr()) {
      calculationState.value = {
        type: "error",
        error: { message: result.error },
      };
      return;
    }

    calculationState.value = {
      type: "success",
      result: {
        value: result.value,
        unit: "回",
        description: "マリガン期待値",
      },
    };
  };

  const calculate = (): void => {
    if (activeTab.value === "badHand") {
      calculateBadHand();
      return;
    }

    if (activeTab.value === "expMulligan") {
      calculateExpMulligan();
      return;
    }
  };

  const resetCalculation = (): void => {
    calculationState.value = { type: "idle" };
  };

  // 入力値を初期状態にリセット
  const resetInputs = (): void => {
    if (activeTab.value === "badHand") {
      badHandInputs.value = { ...DEFAULT_BAD_HAND_INPUTS };
    } else {
      expMulliganInputs.value = { ...DEFAULT_EXP_MULLIGAN_INPUTS };
    }
    calculationState.value = { type: "idle" };
  };

  // 現在の入力値のクローンを取得（VueUseのuseClonedを活用）
  const { cloned: inputsClone, sync: syncInputsClone } =
    useCloned(currentInputs);

  return {
    // 状態（読み取り専用）
    activeTab: readonly(activeTab),
    calculationState: readonly(calculationState),
    badHandInputs: readonly(badHandInputs),
    expMulliganInputs: readonly(expMulliganInputs),
    currentInputs: readonly(currentInputs),
    inputsClone: readonly(inputsClone),

    // 計算された状態
    isCalculating,
    hasResult,
    hasError,
    result,
    error,

    // アクション
    setActiveTab,
    updateBadHandInputs,
    updateExpMulliganInputs,
    calculate,
    resetCalculation,
    resetInputs,
    syncInputsClone,
  };
});
