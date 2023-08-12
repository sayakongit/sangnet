import { useState } from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HistoryDonor from "./Components/dashboard/donor/HistoryDonor";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="app">
 
          <BrowserRouter>
            <Routes>
     
              <Route path="/history-donor" element={<HistoryDonor />} />
 
            </Routes>
          </BrowserRouter>

      </div>

    </>
  );
}

export default App;
