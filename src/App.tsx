import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartingPage from "./pages/StartingPage";
import Back from "./pages/GameBackground";
import SolverBack from "./pages/SolverBackground";

// onClick={colorMode.toggleColor
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StartingPage />} />
          <Route path="/game" element={<Back />} />
          <Route path="/manual-solver" element={<SolverBack />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
