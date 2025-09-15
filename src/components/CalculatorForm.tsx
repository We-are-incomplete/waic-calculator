import { useCallback, useMemo } from "react";
import { useCalculatorStore } from "../stores/useCalculatorStore";
import type {
  BadHandInputs,
  ExpMulliganInputs,
} from "../stores/useCalculatorStore";
import {
  createBadHandFormFields,
  createExpMulliganFormFields,
} from "../types/form";

// フォームフィールドの定義をコンポーネントの外部に移動
const badHandFormFields = createBadHandFormFields();
const expMulliganFormFields = createExpMulliganFormFields();

const CalculatorForm = () => {
  const {
    activeTab,
    badHandInputs,
    expMulliganInputs,
    calculationState,
    updateBadHandInputs,
    updateExpMulliganInputs,
    calculate,
  } = useCalculatorStore();

  // isCalculating を calculationState から派生させる
  const isCalculating = calculationState.type === "calculating";

  // 現在のタブに応じたフォームフィールドを取得
  const currentFormFields = useMemo<
    readonly (
      | (typeof badHandFormFields)[number]
      | (typeof expMulliganFormFields)[number]
    )[]
  >(() => {
    if (activeTab === "badHand") {
      return badHandFormFields;
    }
    return expMulliganFormFields;
  }, [activeTab]);

  // フィールド値の取得
  type AnyKey = keyof BadHandInputs | keyof ExpMulliganInputs;
  const getFieldValue = useCallback(
    (fieldKey: AnyKey): number => {
      if (activeTab === "badHand") {
        const inputs = badHandInputs;
        return inputs[fieldKey as keyof BadHandInputs];
      }
      const inputs = expMulliganInputs;
      return inputs[fieldKey as keyof ExpMulliganInputs];
    },
    [activeTab, badHandInputs, expMulliganInputs],
  );

  // 入力値の変更処理
  const handleInputChange = useCallback(
    (fieldKey: AnyKey, event: React.ChangeEvent<HTMLInputElement>): void => {
      const value = event.currentTarget.valueAsNumber;

      if (Number.isNaN(value)) {
        return;
      }

      if (activeTab === "badHand") {
        updateBadHandInputs({
          [fieldKey]: value,
        } as Partial<BadHandInputs>);
        return;
      }

      updateExpMulliganInputs({
        [fieldKey]: value,
      } as Partial<ExpMulliganInputs>);
    },
    [activeTab, updateBadHandInputs, updateExpMulliganInputs],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      calculate();
    },
    [calculate],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {currentFormFields.map((field) => (
        <div key={field.id}>
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {field.label}
          </label>
          <input
            id={field.id}
            name={field.id}
            value={getFieldValue(field.modelKey)}
            onChange={(e) => handleInputChange(field.modelKey, e)}
            type={field.type}
            inputMode="numeric"
            min={field.min}
            max={field.max}
            required={field.required}
            disabled={isCalculating}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          />
        </div>
      ))}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isCalculating}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? "計算中..." : "計算する"}
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm;
