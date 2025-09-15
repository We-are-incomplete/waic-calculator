import React, { useCallback, useEffect, useRef } from "react";
import {
  useCalculatorStore,
  type CalculatorTab,
} from "../stores/useCalculatorStore";
import clsx from "clsx"; // 条件付きクラス名のためにclsxを使用

// タブの定義 (既存のものをそのまま利用)
interface Tab {
  id: CalculatorTab;
  label: string;
}

// tabs配列をコンポーネントの外部に移動
const tabs: Tab[] = [
  {
    id: "badHand",
    label: "事故率計算",
  },
  {
    id: "expMulligan",
    label: "マリガン期待値",
  },
];

const CalculatorTabs: React.FC = () => {
  const activeTab = useCalculatorStore((s) => s.activeTab);
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);
  const tabListRef = useRef<HTMLDivElement>(null);

  // タブの切り替え
  const handleSetActiveTab = useCallback(
    (tabId: CalculatorTab): void => {
      setActiveTab(tabId);
    },
    [setActiveTab],
  );

  // キーボードナビゲーション
  const handleKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
      let newIndex = currentIndex;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case "ArrowRight":
          event.preventDefault();
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case "Home":
          event.preventDefault();
          newIndex = 0;
          break;
        case "End":
          event.preventDefault();
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      if (newIndex !== currentIndex) {
        handleSetActiveTab(tabs[newIndex]!.id);
        // フォーカスを新しいタブボタンに移動
        const newTabButton = tabListRef.current?.children[
          newIndex
        ] as HTMLButtonElement;
        newTabButton?.focus();
      }
    },
    [activeTab, handleSetActiveTab],
  );

  // Alt + 数字キーでタブ切り替え
  useEffect(() => {
    const handleGlobalKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable || target.closest("input, textarea, select"))
      ) {
        return;
      }
      if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        const code = event.code || "";
        const isDigit = code.startsWith("Digit") || code.startsWith("Numpad");
        const keyNum = isDigit ? Number(code.slice(-1)) : NaN;
        if (keyNum >= 1 && keyNum <= tabs.length) {
          event.preventDefault();
          handleSetActiveTab(tabs[keyNum - 1]!.id);
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeydown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeydown);
    };
  }, [handleSetActiveTab]);

  return (
    <div className="mb-6">
      <div
        className="flex space-x-1 p-1 bg-gray-100 rounded-lg"
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeydown}
        ref={tabListRef}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSetActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            role="tab"
            className={clsx(
              "relative flex-1 py-2 px-3 text-sm font-medium text-center rounded-md transition-all duration-200",
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
            )}
          >
            <span className="relative z-10">{tab.label}</span>

            {/* アクティブタブのインジケーター */}
            {activeTab === tab.id && (
              <div
                className="absolute inset-0 bg-white rounded-md shadow-sm transition-all duration-20 pointer-events-none"
                style={{ zIndex: 1 }}
              ></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalculatorTabs;
