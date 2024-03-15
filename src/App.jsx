import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LogsScreen from "./screens/LogsScreen";
import MetricsScreen from "./screens/MetricsScreen";
import HomePage from "./components/HomePage"; 
function App() {
  return (
    <Router>
      <div>
        {}
        <Navbar />
        {}
        <Routes>
          <Route exact path="/" element={<HomePage />} /> {}
          <Route path="/logs" element={<LogsScreen />} />
          <Route path="/metrics" element={<MetricsScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
