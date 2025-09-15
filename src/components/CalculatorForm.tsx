import React, { useCallback, useEffect } from "react";
import { useCalculatorStore } from "../stores/useCalculatorStore";
import type { BadHandInputs, ExpMulliganInputs } from "../stores/useCalculatorStore";
import {
  createBadHandFormFields,
  createExpMulliganFormFields,
} from "../types/form";
import type { FormField } from "../types/form";

const CalculatorForm: React.FC = () => {
  const {
    activeTab,
    badHandInputs,
    expMulliganInputs,
    isCalculating,
    updateBadHandInputs,
    updateExpMulliganInputs,
    calculate,
  } = useCalculatorStore();

  // 現在のタブに応じたフォームフィールドを取得
  const currentFormFields = React.useMemo(() => {
    if (activeTab === "badHand") {
      return createBadHandFormFields();
    }
    return createExpMulliganFormFields();
  }, [activeTab]);

  // フィールド値の取得
  const getFieldValue = useCallback(
    (fieldKey: string): number => {
      if (activeTab === "badHand") {
        const inputs = badHandInputs;
        return inputs[fieldKey as keyof typeof inputs];
      }
      const inputs = expMulliganInputs;
      return inputs[fieldKey as keyof typeof inputs];
    },
    [activeTab, badHandInputs, expMulliganInputs]
  );

  // 入力値の変更処理
  const handleInputChange = useCallback(
    (fieldKey: string, event: React.ChangeEvent<HTMLInputElement>): void => {
      const value = Number(event.target.value);

      if (isNaN(value)) {
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
    [activeTab, updateBadHandInputs, updateExpMulliganInputs]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      calculate();
    },
    [calculate]
  );

  // キーボードショートカット (Enterで計算実行)
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!isCalculating) {
          calculate();
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isCalculating, calculate]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {currentFormFields.map((field: FormField) => (
        <div key={field.id}>
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {field.label}
          </label>
          <input
            id={field.id}
            value={getFieldValue(field.modelKey)}
            onChange={(e) => handleInputChange(field.modelKey, e)}
            type={field.type}
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
