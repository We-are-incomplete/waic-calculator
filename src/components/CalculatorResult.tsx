import React, { useMemo } from "react";
import { useCalculatorStore } from "../stores/useCalculatorStore";

const CalculatorResult: React.FC = () => {
  const { hasResult, hasError, isCalculating } = useCalculatorStore();
  const result = useCalculatorStore((state) => state.result);
  const error = useCalculatorStore((state) => state.error);

  // 数値フォーマット用
  const formattedValue = useMemo(() => {
    if (!result) return "0";

    const value = result.value;

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
          className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 shadow-lg
                     transition-all duration-300 ease-out opacity-100 transform scale-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-800">計算結果</h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-gray-700 font-medium">
                {result.description}:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-green-600 tabular-nums">
                  {formattedValue}
                </span>
                <span className="text-lg text-green-600">{result.unit}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {hasError && error && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-lg
                     transition-all duration-300 ease-out opacity-100 transform scale-100"
        >
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500 flex-shrink-0"
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
              <p className="text-red-700 mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* 計算中表示 */}
      {isCalculating && (
        <div
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-lg
                     transition-all duration-300 ease-out opacity-100 transform scale-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-700 font-medium">計算中...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorResult;
