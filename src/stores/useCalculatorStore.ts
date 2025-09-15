import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { calcBadHand } from "../utils/calc_bad_hand";
import { calcExpMulligan } from "../utils/calc_expected_mulligan";
import type { Result } from "neverthrow";

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

  setActiveTab: (tab: CalculatorTab) => void;
  updateBadHandInputs: (inputs: Partial<BadHandInputs>) => void;
  updateExpMulliganInputs: (inputs: Partial<ExpMulliganInputs>) => void;
  calculate: () => void;
  resetCalculation: () => void;
  resetInputs: () => void;
}

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => {
      // ヘルパー関数: 計算結果を処理し、状態を更新
      const handleCalculationResult = (
        result: Result<number, string>,
        successDescription: string,
        unit: string,
      ) => {
        if (result.isErr()) {
          set({
            calculationState: {
              type: "error",
              error: { message: result.error },
            },
          });
          return;
        }

        set({
          calculationState: {
            type: "success",
            result: {
              value: result.value,
              unit: unit,
              description: successDescription,
            },
          },
        });
      };

      return {
        // 永続化される状態
        activeTab: "badHand",
        badHandInputs: DEFAULT_BAD_HAND_INPUTS,
        expMulliganInputs: DEFAULT_EXP_MULLIGAN_INPUTS,

        // 永続化されない状態
        calculationState: { type: "idle" },

        // アクション
        setActiveTab: (tab) => {
          set({ activeTab: tab, calculationState: { type: "idle" } });
        },
        updateBadHandInputs: (inputs) => {
          set((state) => ({
            badHandInputs: { ...state.badHandInputs, ...inputs },
          }));
        },
        updateExpMulliganInputs: (inputs) => {
          set((state) => ({
            expMulliganInputs: { ...state.expMulliganInputs, ...inputs },
          }));
        },
        calculate: () => {
          set({ calculationState: { type: "calculating" } });

          const state = get();
          if (state.activeTab === "badHand") {
            const { deck, hand, goodArtist, badArtist } = state.badHandInputs;
            const result = calcBadHand(deck, hand, goodArtist, badArtist);
            handleCalculationResult(result, "事故率", "%");
            return;
          }
          // expMulligan
          const { deck, hand, artist } = state.expMulliganInputs;
          const result = calcExpMulligan(deck, hand, artist);
          handleCalculationResult(result, "マリガン期待値", "回");
        },
        resetCalculation: () => {
          set({ calculationState: { type: "idle" } });
        },
        resetInputs: () => {
          const state = get();
          set(
            state.activeTab === "badHand"
              ? {
                  badHandInputs: { ...DEFAULT_BAD_HAND_INPUTS },
                  calculationState: { type: "idle" },
                }
              : {
                  expMulliganInputs: { ...DEFAULT_EXP_MULLIGAN_INPUTS },
                  calculationState: { type: "idle" },
                },
          );
        },
      };
    },
    {
      name: "calculator-storage", // localStorageに保存されるキー
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : (undefined as unknown as Storage),
      ), // SSR/テスト環境でも安全
      partialize: (state) => ({
        // 永続化したい状態のみを抽出
        activeTab: state.activeTab,
        badHandInputs: state.badHandInputs,
        expMulliganInputs: state.expMulliganInputs,
      }),
    },
  ),
);
