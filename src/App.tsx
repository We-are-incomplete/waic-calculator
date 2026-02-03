import CalculatorTabs from "./components/CalculatorTabs";
import CalculatorForm from "./components/CalculatorForm";
import CalculatorResult from "./components/CalculatorResult";
import "./style.css";

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-4">
      <main className="m-auto max-w-md rounded-lg bg-white p-6 shadow-lg" role="main">
        <CalculatorTabs />
        <CalculatorForm />
        <CalculatorResult /> {/* CalculatorResultを使用 */}
      </main>
    </div>
  );
}

export default App;
