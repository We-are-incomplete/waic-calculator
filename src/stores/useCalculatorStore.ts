import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { calcBadHand } from "../utils/calc_bad_hand";
import { calcExpMulligan } from "../utils/calc_expected_mulligan";

// 代数的データ型の定義 (既存のものをそのまま利用)
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

// デフォルト値 (既存のものをそのまま利用)
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

// Zustandストアの型定義
interface CalculatorStore {
  activeTab: CalculatorTab;
  badHandInputs: BadHandInputs;
  expMulliganInputs: ExpMulliganInputs;
  calculationState: CalculationState;
  isCalculating: boolean;
  hasResult: boolean;
  hasError: boolean;
  result: CalculationResult | null;
  error: CalculationError | null;
  currentInputs: BadHandInputs | ExpMulliganInputs;
  inputsClone: BadHandInputs | ExpMulliganInputs;

  setActiveTab: (tab: CalculatorTab) => void;
  updateBadHandInputs: (inputs: Partial<BadHandInputs>) => void;
  updateExpMulliganInputs: (inputs: Partial<ExpMulliganInputs>) => void;
  calculate: () => void;
  resetCalculation: () => void;
  resetInputs: () => void;
  syncInputsClone: () => void;
}

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
      // 永続化される状態
      activeTab: "badHand",
      badHandInputs: DEFAULT_BAD_HAND_INPUTS,
      expMulliganInputs: DEFAULT_EXP_MULLIGAN_INPUTS,

      // 永続化されない状態
      calculationState: { type: "idle" },

      // 算出プロパティ (getterを使ってリアルタイムに計算)
      get isCalculating() {
        return get().calculationState.type === "calculating";
      },
      get hasResult() {
        return get().calculationState.type === "success";
      },
      get hasError() {
        return get().calculationState.type === "error";
      },
      get result() {
        const state = get().calculationState;
        if (state.type === "success") {
          return state.result;
        }
        return null;
      },
      get error() {
        const state = get().calculationState;
        if (state.type === "error") {
          return state.error;
        }
        return null;
      },
      get currentInputs() {
        if (get().activeTab === "badHand") {
          return get().badHandInputs;
        }
        return get().expMulliganInputs;
      },
      // inputsCloneはcurrentInputsのディープコピーとして初期化
      inputsClone: { ...DEFAULT_BAD_HAND_INPUTS }, // 初期値はbadHandInputsのデフォルト

      // アクション
      setActiveTab: (tab) => {
        set({ activeTab: tab, calculationState: { type: "idle" } });
        // activeTabが変更されたらinputsCloneも更新
        get().syncInputsClone();
      },
      updateBadHandInputs: (inputs) => {
        set((state) => ({
          badHandInputs: { ...state.badHandInputs, ...inputs },
        }));
        get().syncInputsClone();
      },
      updateExpMulliganInputs: (inputs) => {
        set((state) => ({
          expMulliganInputs: { ...state.expMulliganInputs, ...inputs },
        }));
        get().syncInputsClone();
      },
      calculate: () => {
        set({ calculationState: { type: "calculating" } });
        console.log("Calculation started. Current state:", get().calculationState);

        const state = get();
        if (state.activeTab === "badHand") {
          const { deck, hand, goodArtist, badArtist } = state.badHandInputs;
          console.log("Calculating Bad Hand with inputs:", { deck, hand, goodArtist, badArtist });
          const result = calcBadHand(deck, hand, goodArtist, badArtist);

          if (result.isErr()) {
            console.error("Bad Hand Calculation Error:", result.error);
            set({
              calculationState: {
                type: "error",
                error: { message: result.error },
              },
            });
            return;
          }

          console.log("Bad Hand Calculation Success. Result value:", result.value);
          set({
            calculationState: {
              type: "success",
              result: {
                value: result.value,
                unit: "%",
                description: "事故率",
              },
            },
          });
        } else if (state.activeTab === "expMulligan") {
          const { deck, hand, artist } = state.expMulliganInputs;
          console.log("Calculating Expected Mulligan with inputs:", { deck, hand, artist });
          const result = calcExpMulligan(deck, hand, artist);

          if (result.isErr()) {
            console.error("Expected Mulligan Calculation Error:", result.error);
            set({
              calculationState: {
                type: "error",
                error: { message: result.error },
              },
            });
            return;
          }

          console.log("Expected Mulligan Calculation Success. Result value:", result.value);
          set({
            calculationState: {
              type: "success",
              result: {
                value: result.value,
                unit: "回",
                description: "マリガン期待値",
              },
            },
          });
        }
      },
      resetCalculation: () => {
        set({ calculationState: { type: "idle" } });
      },
      resetInputs: () => {
        const state = get();
        if (state.activeTab === "badHand") {
          set({ badHandInputs: { ...DEFAULT_BAD_HAND_INPUTS } });
        } else {
          set({ expMulliganInputs: { ...DEFAULT_EXP_MULLIGAN_INPUTS } });
        }
        set({ calculationState: { type: "idle" } });
        get().syncInputsClone();
      },
      syncInputsClone: () => {
        const current = get().currentInputs;
        set({ inputsClone: JSON.parse(JSON.stringify(current)) }); // ディープコピー
      },
    }),
    {
      name: "calculator-storage", // localStorageに保存されるキー
      storage: createJSONStorage(() => localStorage), // localStorageを使用
      partialize: (state) => ({
        // 永続化したい状態のみを抽出
        activeTab: state.activeTab,
        badHandInputs: state.badHandInputs,
        expMulliganInputs: state.expMulliganInputs,
      }),
    },
  ),
);
