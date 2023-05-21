import "./App.css";
import InputTable from "./components/InputTable";
import { CurrencyProvider } from "./components/CurrencyContext,";
import { ThemeProvider } from "./components/ThemeContext";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="App">
    <ThemeProvider>
      <CurrencyProvider>
        <NavBar />
        <InputTable />
      </CurrencyProvider>
    </ThemeProvider>
  </div>
  );
}

export default App;
