import React from 'react';
import CalculatorTabs from "./components/CalculatorTabs";
import CalculatorForm from "./components/CalculatorForm";
import CalculatorResult from "./components/CalculatorResult"; // CalculatorResultをインポート

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md m-auto bg-white rounded-lg shadow-lg p-6">
        <CalculatorTabs />
        <CalculatorForm />
        <CalculatorResult /> {/* CalculatorResultを使用 */}
      </div>
    </div>
  );
};

export default App;
