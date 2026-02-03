import React, { useMemo } from "react";
import { useCalculatorStore } from "../stores/useCalculatorStore";

const CalculatorResult: React.FC = () => {
  const calculationState = useCalculatorStore((state) => state.calculationState);

  // calculationState から派生状態を導出
  const isCalculating = calculationState.type === "calculating";
  const hasResult = calculationState.type === "success";
  const hasError = calculationState.type === "error";
  const result = hasResult ? calculationState.result : null;
  const error = hasError ? calculationState.error : null;

  // 数値フォーマット用
  const formattedValue = useMemo(() => {
    if (!result) return "0";

    const value = result.value;

    if (!Number.isFinite(value)) {
      return "-";
    }

    // 小数点以下の桁数を適切に調整
    if (value % 1 === 0) {
      // 整数の場合
      return value.toLocaleString();
    } else {
      // 小数の場合、3桁まで表示（末尾の0も保持）
      return value.toFixed(3);
    }
  }, [result]);

  return (
    <div className="mt-8">
      {/* 結果表示 */}
      {hasResult && result && (
        <div
          role="status"
          aria-live="polite"
          className="scale-100 transform rounded-lg border border-green-200 bg-linear-to-r from-green-50 to-blue-50 p-6 opacity-100 shadow-lg transition-all duration-300 ease-out"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-green-800">計算結果</h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium text-gray-700">{result.description}:</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600 tabular-nums sm:text-3xl">{formattedValue}</span>
                <span className="text-lg text-green-600">{result.unit}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {hasError && error && (
        <div
          role="alert"
          className="scale-100 transform rounded-lg border border-red-200 bg-red-50 p-6 opacity-100 shadow-lg transition-all duration-300 ease-out"
        >
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-800">エラー</h3>
              <p className="mt-1 text-red-700">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* 計算中表示 */}
      {isCalculating && (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="scale-100 transform rounded-lg border border-blue-200 bg-blue-50 p-6 opacity-100 shadow-lg transition-all duration-300 ease-out"
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <span className="font-medium text-blue-700">計算中...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorResult;
